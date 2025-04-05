import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

export function FeedingLogEntryForm() {
  const navigate = useNavigate();
  const employeeId = useUserStore(state => state.id); //uses stored id
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Employee_ID: employeeId,
    Food_Type: "",
    date: "",
    time: "",
    quantity: "",
    Q_Unit: "",
  });

  const [dropdownData, setDropdownData] = useState({
    Animals: [],
    Food_types: [],
    Units: [],
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    const ID = employeeId; 
  
    fetch(`${import.meta.env.VITE_API_URL}/api/feeding/form-info`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ employee_ID: ID }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Form Info Response Data:", data); //  Log the backend response
        setDropdownData(data);
        console.log(dropdownData.Units);
      })
      .catch((err) => console.error("❌ Error fetching feeding form info:", err));
  }, []);
  

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    updateDateTime(e.target.value, selectedTime);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
    updateDateTime(selectedDate, e.target.value);
  };

  const updateDateTime = (date, time) => {
    if (date && time) {
      setFormData((prev) => ({
        ...prev,
        date: date,
        time: time,
      }));
    }
  };

  const isFormValid =
    formData.Animal_ID && formData.Food_Type && formData.date && formData.time && formData.quantity && formData.Q_Unit;

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isFormValid) return alert("Please complete all fields.");
    
      const payload = {
        animal_ID: formData.Animal_ID,
        employee_ID: formData.Employee_ID,
        date: formData.date,
        time: formData.time,
        foodtID: formData.Food_Type,
        quantity: formData.quantity,
        unittID: formData.Q_Unit,
      };
    
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feeding/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        const result = await res.json();
    
        if (res.ok) {
          alert("Feeding log submitted!");
    
          // Reset the form here
          setFormData({
            Animal_ID: "",
            Employee_ID: "",
            Food_Type: "",
            date: "",
            time: "",
            quantity: "",
            Q_Unit: "",
          });
    
          setSelectedDate("");
          setSelectedTime("");
        } else {
          console.error(result.error);
          alert("Failed to submit feeding log.");
        }
      } catch (error) {
        console.error("❌ Submission error:", error);
        alert("Submission failed. Please try again.");
      }
    };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Feeding Log Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal</label>
                <select
                  value={formData.Animal_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select an Animal</option>
                  {dropdownData.Animals.map((animal) => (
                    <option key={animal.Animal_ID} value={animal.Animal_ID}>
                      {animal.Animal_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Food Type</label>
                <select
                  value={formData.Food_Type}
                  onChange={(e) => handleChange(e, "Food_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select Food</option>
                  {dropdownData.Food_types.map((food) => (
                    <option key={food.foodtype_ID} value={food.foodtype_ID}>
                      {food.food_Types}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                  />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleChange(e, "quantity")}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                    min={0}
                  />
                  <select
                    value={formData.Q_Unit}
                    onChange={(e) => handleChange(e, "Q_Unit")}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm bg-white text-gray-600"
                  >
                    <option value="">Unit</option>
                    {dropdownData.Units.map((unit) => (
                      <option key={unit.Unit_ID} value={unit.Unit_ID}>
                        {unit.Unit_text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/dashboard/Feeding_Log_Query")}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Feeding Log
              </button>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default FeedingLogEntryForm;





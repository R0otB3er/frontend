import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function FeedingLogSearch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Employee_ID: "",
    Food_Type: "",
    date: "",
    Species_ID: "",
    Habitat_ID: "",
  });

  const [dropdownData, setDropdownData] = useState({
    Animals: [],
    Food_types: [],
    Units: [],
    Habitats: [],
    Species: [],
    Employees: [],
  });

  const [feedingLogs, setFeedingLogs] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  const isFormValid =
    formData.Animal_ID || formData.Food_Type || formData.date || formData.Q_Unit || formData.Habitat_ID || formData.Species_ID || formData.Employee_ID;

  useEffect(() => {
  
    fetch(`${import.meta.env.VITE_API_URL}/api/getFeedingQueryDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Query Form Info Response Data:", data); //  Log the backend response
        setDropdownData(data);
        console.log(dropdownData.Units);
      })
      .catch((err) => console.error("Error fetching feeding form info:", err));
  }, []);
  

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    updateDate(e.target.value);
  };

  const updateDate = (date) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date,
      }));
    }
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!isFormValid) return alert("Please complete all fields.");
    
      const payload = {
        animal_ID: formData.Animal_ID,
        employee_ID: formData.Employee_ID,
        date: formData.date,
        time: formData.time,
        foodtID: formData.Food_Type,
        unittID: formData.Q_Unit,
        speciesID: formData.Species_ID,
        EmployeeID: formData.Employee_ID,
        Habitat_ID: formData.Habitat_ID,
      };
    
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/QueryFeedingLogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    
        
    
        if (res.ok) {
          setFeedingLogs([]);
          const result = await res.json();
          console.log(result);
          setFeedingLogs(Array.isArray(result) ? result : []);
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
                  <option value="">Animals</option>
                  {dropdownData.Animals.map((animal) => (
                    <option key={animal.Animal_ID} value={animal.Animal_ID}>
                      {animal.Animal_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Species</label>
                <select
                  value={formData.Species_ID}
                  onChange={(e) => handleChange(e, "Species_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Species</option>
                  {dropdownData.Species.map((species) => (
                    <option key={species.Species_ID} value={species.Species_ID}>
                      {species.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Habitats</label>
                <select
                  value={formData.Habitat_ID}
                  onChange={(e) => handleChange(e, "Habitat_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Habitats</option>
                  {dropdownData.Habitats.map((habitats) => (
                    <option key={habitats.Habitat_ID} value={habitats.Habitat_ID}>
                      {habitats.Habitat_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Caretakers</label>
                <select
                  value={formData.Employee_ID}
                  onChange={(e) => handleChange(e, "Employee_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Employee</option>
                  {dropdownData.Employees.map((employee) => (
                    <option key={employee.Employee_ID} value={employee.Employee_ID}>
                      {`${employee.first_name} ${employee.last_name}`}
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
                    className="border px-3 py-2 w-full rounded-md shadow-sm"
                  />
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

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Feeding Log Query
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Animal name", "Species", "Caretaker name", "Food type", "Quantity", "feeding date", "feeding time"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
 
            {feedingLogs.length > 0 ? (
              feedingLogs.map(({ Animal_Name,
                Name, 
                first_name, 
                last_name, 
                food_Types, 
                Quantity,
                Feeding_Date,
                Feeding_Time,
                Unit_text}, index) => {
                const className = `py-3 px-5 ${index === feedingLogs.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={index}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography variant="small" className="font-semibold text-blue-gray-600">
                            {Animal_Name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Name}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{`${first_name} ${last_name}`}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{food_Types}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{`${Quantity} ${Unit_text}`}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Feeding_Date.split('T')[0]}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Feeding_Time}</Typography>
                    </td>
                   
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No feeding logs found
                </td>
              </tr>
            )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default FeedingLogSearch;
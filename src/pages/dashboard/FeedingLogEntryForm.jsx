import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueDropdownValues } from "@/data"; // ✅ Import function

export function FeedingLogEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Employee_ID: "",
    Food_Type: "",
    date: "",
    quantity: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    animalIDs: [],
    employeeIDs: [],
    foodTypes: [],
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    // Fetch unique values for dropdowns
    const { uniqueAnimals, uniqueEmployees, uniqueFoodTypes } = getUniqueDropdownValues();
    setDropdownValues({
      animalIDs: uniqueAnimals,
      employeeIDs: uniqueEmployees,
      foodTypes: uniqueFoodTypes,
    });
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (!value.trim()) {
      error = "This field cannot be empty.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Date and Time selection
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    updateFeedingTime(event.target.value, selectedTime);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
    updateFeedingTime(selectedDate, event.target.value);
  };

  // Update Feeding Time in proper format
  const updateFeedingTime = (date, time) => {
    if (date && time) {
      const formattedTime = formatTimeTo12Hour(time);
      const formattedDate = formatDateToMMDDYYYY(date);
      const feedingTime = `${formattedTime}, ${formattedDate}`;
      
      setFormData((prev) => ({ ...prev, date: feedingTime }));
    }
  };

  // Convert 24-hour time to 12-hour format
  const formatTimeTo12Hour = (time) => {
    const [hour, minute] = time.split(":");
    let hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12 || 12;
    return `${hourInt}:${minute} ${ampm}`;
  };

  // Format date to MM/DD/YYYY
  const formatDateToMMDDYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Animal_ID.trim() !== "" &&
    formData.Food_Type.trim() !== "" &&
    formData.date.trim() !== "" &&
    formData.quantity.trim() !== "";

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      Animal_ID: "",
      Employee_ID: "",
      Food_Type: "",
      date: "",
      quantity: "",
    });
    setSelectedDate("");
    setSelectedTime("");


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
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animal ID Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal ID</label>
                <select
                  value={formData.Animal_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Animal</option>
                  {dropdownValues.animalIDs.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>

              {/* Employee ID Dropdown }
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <select
                  value={formData.Employee_ID}
                  onChange={(e) => handleChange(e, "Employee_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Employee</option>
                  {dropdownValues.employeeIDs.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>*/}

              {/* Food Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Type</label>
                <select
                  value={formData.Food_Type}
                  onChange={(e) => handleChange(e, "Food_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Food Type</option>
                  {dropdownValues.foodTypes.map((food) => (
                    <option key={food} value={food}>{food}</option>
                  ))}
                </select>
              </div>

              {/* Feeding Time (Date & Time Combined) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Feeding Time</label>
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
                {errors.date && <Typography className="text-red-500 text-xs">{errors.date}</Typography>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input
                  type="text"
                  value={formData.quantity}
                  onChange={(e) => handleChange(e, "quantity")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.quantity && <Typography className="text-red-500 text-xs">{errors.quantity}</Typography>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
            <button
                onClick={() => navigate("/dashboard/Feeding_Log_Query")}

                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Feeding Log
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isFormValid}
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




import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueDropdownValues } from "@/data"; // ✅ Import new function

export function FeedingLogEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Employee_ID: "",
    Food_Type: "",
    date: "",
    quantity: "",
    img: "",
  });

  const [errors, setErrors] = useState({});
  const [imageUploaded, setImageUploaded] = useState(false);
  const [dropdownValues, setDropdownValues] = useState({
    animalIDs: [],
    employeeIDs: [],
    foodTypes: [],
  });

  useEffect(() => {
    // Fetch unique values for dropdowns
    const { uniqueAnimals, uniqueEmployees, uniqueFoodTypes } = getUniqueDropdownValues();
    setDropdownValues({
      animalIDs: uniqueAnimals,
      employeeIDs: uniqueEmployees,
      foodTypes: uniqueFoodTypes,
    });
  }, []);

  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (!value.trim()) {
      error = "This field cannot be empty.";
    } else if (field === "date" && !/^\d{2}:\d{2} (AM|PM), \d{2}\/\d{2}\/\d{4}$/.test(value)) {
      error = "Date must be in HH:MM AM/PM, MM/DD/YYYY format.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      img: URL.createObjectURL(event.target.files[0]),
    }));
    setImageUploaded(true);
  };

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    Object.values(formData).every((val) => val !== "") &&
    formData.Animal_ID !== "Select an Animal" &&
    formData.Employee_ID !== "Select an Employee" &&
    formData.Food_Type !== "Select a Food Type";

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
      img: "",
    });
    setImageUploaded(false);
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
            {/* Image Upload 
            <div className="flex items-center justify-center">
              {!imageUploaded && (
                <label className="cursor-pointer border border-gray-400 rounded-lg w-16 h-16 flex items-center justify-center">
                  <span className="text-xl">+</span>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              {formData.img && <Avatar src={formData.img} size="xl" variant="rounded" />}
            </div>
            */}

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
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee ID Dropdown 
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <select
                  value={formData.Employee_ID}
                  onChange={(e) => handleChange(e, "Employee_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Employee</option>
                  {dropdownValues.employeeIDs.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
              */}

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
                    <option key={food} value={food}>
                      {food}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="dateInput" className="block text-sm font-medium text-gray-700">
                  Date Input
                </label>
                <input
                  type="date"
                  id="dateInput"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time Input */}
              <div>
                <label htmlFor="timeInput" className="block text-sm font-medium text-gray-700">
                  Time Input
                </label>
                <input
                  type="time"
                  id="timeInput"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Feeding Time 
              <div>
                <label className="block text-sm font-medium text-gray-700">Feeding Time</label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleChange(e, "date")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="HH:MM AM/PM, MM/DD/YYYY"
                />
                {errors.date && <Typography className="text-red-500 text-xs">{errors.date}</Typography>}
              </div>
              */}

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
              <button onClick={() => navigate("/feeding-log-report")} className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700">
                Back to Feeding Log
              </button>
              <button type="submit" className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`} disabled={!isFormValid}>
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



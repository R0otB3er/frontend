import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';

export function EmployeeEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_Name: "",
    last_Name: "",
    Email: "",
    Password: "",
    Role: "",
    Salary: "",
    Phone_number: ""
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from API
    fetch(`${import.meta.env.VITE_API_URL}/api/getRoles`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Roles data:", data);
        setRoles(data.roles);
      })
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    // Validation logic
    if (!value.trim() && field !== "password") {
      error = "This field cannot be empty.";
    } else if (field === "email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Enter a valid email address.";
    } else if (field === "phone_number" && !/^\d+$/.test(value)) {
      error = "Phone number must contain only digits.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (value) => {
    setFormData(prev => ({ ...prev, Salary: value || "" }));
  };

  // Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.first_Name.trim() !== "" &&
    formData.last_Name.trim() !== "" &&
    formData.Email.trim() !== "" &&
    formData.Role !== "" &&
    formData.Salary.trim() !== "" &&
    formData.Phone_number.trim() !== "" &&
    /\S+@\S+\.\S+/.test(formData.Email);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/HR/createEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Employee added successfully:", data);
        alert("Employee added successfully!");
        
        // Reset form
        setFormData({
          first_Name: "",
          last_Name: "",
          Email: "",
          Password: "",
          Role: "",
          Salary: "",
          Phone_number: ""
        });
      })
      .catch((err) => {
        console.error("Error adding employee:", err);
        alert("Failed to add employee. Please try again.");
      });
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Employee Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.first_Name}
                  onChange={(e) => handleChange(e, "first_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter first name"
                />
                {errors.first_Name && <Typography className="text-red-500 text-xs">{errors.first_Name}</Typography>}
              </div>

              {/* Last Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.last_Name}
                  onChange={(e) => handleChange(e, "last_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter last name"
                />
                {errors.last_Name && <Typography className="text-red-500 text-xs">{errors.last_Name}</Typography>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => handleChange(e, "Email")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="name@mail.com"
                />
                {errors.Email && <Typography className="text-red-500 text-xs">{errors.Email}</Typography>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={formData.Password}
                  onChange={(e) => handleChange(e, "Password")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter password"
                />
                {errors.Password && <Typography className="text-red-500 text-xs">{errors.Password}</Typography>}
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={formData.Role}
                  onChange={(e) => handleChange(e, "Role")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Role</option>
                  {roles.map((role) => (
                    <option key={role.role_typeID} value={role.role_typeID}>{role.role_types}</option>
                  ))}
                </select>
                {errors.Role && <Typography className="text-red-500 text-xs">{errors.Role}</Typography>}
              </div>

              {/* Salary Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <CurrencyInput
                  placeholder="Enter salary"
                  value={formData.Salary}
                  decimalsLimit={2}
                  onValueChange={handleCurrencyChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>

              {/* Phone Number Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="number"
                  value={formData.Phone_number}
                  onChange={(e) => handleChange(e, "Phone_number")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter phone number"
                />
                {errors.Phone_number && <Typography className="text-red-500 text-xs">{errors.Phone_number}</Typography>}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
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

export default EmployeeEntryForm;
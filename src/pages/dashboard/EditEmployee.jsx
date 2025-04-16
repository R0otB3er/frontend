import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';

// Default empty values for all fields
const DEFAULT_FORM_VALUES = {
  first_Name: "",
  last_Name: "",
  Email: "",
  password: "",
  Role: "",
  Salary: "",
  Phone_number: ""
};

export function EmployeeEditForm() {
  const navigate = useNavigate();
  const { employeeId } = useParams();
  const [employeeData, setEmployeeData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Safe value getter with fallback
  const getSafeValue = (data, key) => data[key] ?? DEFAULT_FORM_VALUES[key];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch roles from API
        const rolesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/getRoles`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const rolesData = await rolesRes.json();
        setRoles(rolesData.roles || []);

        // Fetch employee data
        const employeeRes = await fetch(`${import.meta.env.VITE_API_URL}/api/getEmployeeInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employeeId }),
        });
        const employeeInfo = await employeeRes.json();
        console.log("Employee info:", employeeInfo);
        
        // Set employeeData first
        setEmployeeData({
          ...DEFAULT_FORM_VALUES,
          ...employeeInfo
        });

        // Then set formData with the received data
        setFormData({
          ...DEFAULT_FORM_VALUES,
          ...employeeInfo
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        setEmployeeData({ ...DEFAULT_FORM_VALUES });
        setFormData({ ...DEFAULT_FORM_VALUES });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Handle input changes
  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    // Validation logic
    if (!value.trim() && field !== "Password") {
      error = "This field cannot be empty.";
    } else if (field === "Email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Enter a valid email address.";
    } else if (field === "Phone_number" && !/^\d+$/.test(value)) {
      error = "Phone number must contain only digits.";
    }

    setErrors((prev) => ({ ...prev, [field]: error || null }));
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    try {
      const payload = {
        ...formData,
        Employee_ID: employeeId
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/HR/editEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Employee updated successfully!");
      } else {
        const error = await res.json();
        alert(error.message || "Update failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    // Confirm deletion with user
    const confirmDelete = window.confirm("Are you sure you want to delete this employee? This action cannot be undone.");
    
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/HR/deleteEmployee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Employee_ID: employeeId }),
      });
  
      if (res.ok) {
        alert("Employee deleted successfully!");
        navigate("/dashboard/Employee_Management"); // Redirect after deletion
      } else {
        const error = await res.json();
        alert(error.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Deletion failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading employee data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Edit Employee #{employeeId}
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
                  value={getSafeValue(formData, 'first_Name')}
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
                  value={getSafeValue(formData, 'last_Name')}
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
                  value={getSafeValue(formData, 'Email')}
                  onChange={(e) => handleChange(e, "Email")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="name@mail.com"
                />
                {errors.Email && <Typography className="text-red-500 text-xs">{errors.Email}</Typography>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                <input
                  type="password"
                  value={getSafeValue(formData, 'password')}
                  onChange={(e) => handleChange(e, "password")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter new password"
                />
                {errors.Password && <Typography className="text-red-500 text-xs">{errors.Password}</Typography>}
              </div>

              {/* Role Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={getSafeValue(formData, 'Role')}
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
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <CurrencyInput
                  placeholder="Enter salary"
                  value={getSafeValue(formData, 'Salary')}
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
                  value={getSafeValue(formData, 'Phone_number')}
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
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete Employee
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard/Employee_Management")} //FIX ROUTE 
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Management
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                Update Employee
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default EmployeeEditForm;
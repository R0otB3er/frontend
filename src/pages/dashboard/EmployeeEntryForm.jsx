import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueRoles } from "@/data"; // ✅ Import function

export function EmployeeEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Name: "",
    Role: "",
    Email: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    roles: [],
  });

  useEffect(() => {
    // Fetch unique roles for dropdown
    const { uniqueRoles } = getUniqueRoles();
    setDropdownValues({
      roles: uniqueRoles,
    });
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (!value.trim()) {
      error = "This field cannot be empty.";
    } else if (field === "Email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Enter a valid email address.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Name.trim() !== "" &&
    formData.Role.trim() !== "" &&
    formData.Email.trim() !== "" &&
    /\S+@\S+\.\S+/.test(formData.Email);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log("New Employee Added:", formData);
    setFormData({
      Name: "",
      Role: "",
      Email: "",
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
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => handleChange(e, "Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter full name"
                />
                {errors.Name && <Typography className="text-red-500 text-xs">{errors.Name}</Typography>}
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
                  {dropdownValues.roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Email Field */}
              <div className="col-span-2">
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
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/dashboard/Sign_in_Query")}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Sign In Query
              </button>
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

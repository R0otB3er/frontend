import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function TestingForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  //john.doe@email.com hashed_password1
  const [formData, setFormData] = useState({
    email: "",
    password:"",
  });
  const [role_type, setRole] = useState({
    role_types: "",
  });

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.email.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;

    setIsLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getUserRole`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( { email , password } ),
    });

    if (!res.ok) {
      console.error("Invalid email or password");
      return;
    }

    const ad = await res.json();
    console.log(ad);

    setRole({
      role_types: ad.role_types,
    });

    setIsLoading(false);
  }
  
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

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Testing
          </Typography>
        </CardHeader>
        <CardBody>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">email</label>
                <input
                  type="email"
                  value={formData.email}
                  id="email"
                  name="email"
                  onChange={(e) => handleChange(e, "email")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.email && <Typography className="text-red-500 text-xs">{errors.email}</Typography>}
              </div>
              {/* password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">password</label>
                <input
                  type="password"
                  value={formData.password}
                  id="password"
                  name="password"
                  onChange={(e) => handleChange(e, "password")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.password && <Typography className="text-red-500 text-xs">{errors.password}</Typography>}
              </div>
            </div>

              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isFormValid}
              >
                Submit
              </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default TestingForm;
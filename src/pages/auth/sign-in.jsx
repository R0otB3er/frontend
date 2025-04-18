import React, { useState } from "react";
import {
  Card,
  Alert,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({ 
    email: "",
    password: "",
  });

  const setUserState = useUserStore((state) => state.setUserState); // ✅ CORRECT HOOK USAGE
  const role = useUserStore((state) => state.user_type); // for alert text

  const [showAlerts, setShowAlerts] = useState({
    blue: false,
    red: false,
  });

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.email.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/loginUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        console.error("Invalid email or password");
        setShowAlerts((current) => ({ ...current, red: true }));
        return;
      }

      const data = await res.json();
      console.log(data); // 👈 Debugging login response

      // ✅ Zustand store update (reactive)
      setUserState(data.id, data.user_type);

      // ✅ Redirect to appropriate layout
      if (data.user_type === "visitor") {
        navigate("/visitor/dashboard");
      } else if(data.user_type === "manager"){
        navigate(`/admin/dashboard`);
      } else {
        navigate(`/${data.user_type}/dashboard`);
      }

      setShowAlerts((current) => ({ ...current, blue: true }));
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
    <section className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <Alert
            key="red"
            open={showAlerts.red}
            color="red"
            onClose={() => setShowAlerts((current) => ({ ...current, red: false }))}
          >
            Invalid Login Credentials 
          </Alert>
          <Alert
            key="blue"
            open={showAlerts.blue}
            color="blue"
            onClose={() => setShowAlerts((current) => ({ ...current, blue: false }))}
          >
            You are a {role || ""}
          </Alert>
          <Typography variant="h2" className="font-bold mb-4">
            Sign In
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="border border-gray-300 rounded-md px-3 py-2"
              type="email"
              value={formData.email}
              id="email"
              name="email"
              onChange={(e) => handleChange(e, "email")}
            />
            {errors.email && <Typography className="text-red-500 text-xs">{errors.email}</Typography>}
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="border border-gray-300 rounded-md px-3 py-2"
              value={formData.password}
              id="password"
              name="password"
              onChange={(e) => handleChange(e, "password")}
            />
            {errors.password && <Typography className="text-red-500 text-xs">{errors.password}</Typography>}
          </div>

          <Button 
            type="submit"
            className={`w-full mt-6 rounded-md text-white ${isFormValid ? "" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isFormValid}
          >
            Sign In
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/auth/sign-up" className="text-gray-900 ml-1">
              Create account
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
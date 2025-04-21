import React from "react";
import { 
  Card,
  Input,
  Button,
  Typography,
  Alert
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  //john.doe@email.com hashed_password1
  const [formData, setFormData] = useState({
    email: "",
    password:"",
    password_conf:"",
    Visitor_name:"",
  });

  const [showAlerts, setShowAlerts] = React.useState({
    blue: false,
    red: false,
  });

  const isFormValid =
  Object.values(errors).every((err) => !err) &&
  formData.email.trim() !== "" && 
  formData.password.trim() !== "" && 
  formData.password_conf.trim() == formData.password.trim();

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

  async function handleSubmit(e) {
    e.preventDefault();
    const email = formData.email;
    const password = formData.password;
    const Visitor_name = formData.Visitor_name;

    setIsLoading(true);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/addNewVisitor`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( { email , password, Visitor_name } ),
    });

    if (!res.ok) {
      console.error("Invalid email");
      setShowAlerts((current) => ({ ...current, red: true }));
      return;
    }

    setShowAlerts((current) => ({ ...current, blue: true }));

    setIsLoading(false);
  }
  return (
    <section className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
            Join Us Today
          </Typography>
          <Typography
            variant="paragraph"
            color="blue-gray"
            className="text-lg font-normal"
          >
            Enter your name, email and password to register.
          </Typography>
          <Alert
            key="red"
            open={showAlerts["red"]}
            color={"red"}
            onClose={() => setShowAlerts((current) => ({ ...current, ["red"]: false }))}
          >
            Email is accociated with another account 
          </Alert>
          <Alert
            key="blue"
            open={showAlerts["blue"]}
            color={"blue"}
            onClose={() => setShowAlerts((current) => ({ ...current, ["blue"]: false }))}
          >
            You have been registered!
          </Alert>
        </div>
        <form className="mt-8" onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col gap-6">
          <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your name
            </Typography>
            <Input
              size="lg"
              placeholder="John Doe"
              className="border border-gray-300 rounded-md px-3 py-2"
              type="Visitor_name"
              value={formData.Visitor_name}
              id="Visitor_name"
              name="Visitor_name"
              onChange={(e) => handleChange(e, "Visitor_name")}
            />
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
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Enter a Password
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
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Confirm Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="border border-gray-300 rounded-md px-3 py-2"
              value={formData.password_conf}
              id="password_conf"
              name="password_conf"
              onChange={(e) => handleChange(e, "password_conf")}
            />
          </div>

          <Button 
          type="submit"
          className={`w-full mt-6 rounded-md text-white ${isFormValid ? ":mt-6 w-full" : "bg-gray-400 cursor-not-allowed"}`}
          disabled={!isFormValid}
          >
            Register Now
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;


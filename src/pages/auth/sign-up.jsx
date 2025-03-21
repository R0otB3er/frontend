import { 
  Card,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

export function SignUp() {
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
            Enter your email and password to register.
          </Typography>
        </div>
        <form className="mt-8">
          <div className="mb-6 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Enter a Password
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <Button className="mt-6 w-full">
            Register Now
          </Button>

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">
              Sign in
            </Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignUp;


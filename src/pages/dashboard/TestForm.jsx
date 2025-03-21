import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function TestingForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const email = "john.doe@email.com";
  const [role, setRole] = useState({
    role: "",
  });

    useEffect(() => {
        async function Fetchdata() {

            setIsLoading(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getUserRole?email=${email}`);
       
            if (!res.ok) {
                console.error("Invalid email");
                return;
            }

            const ad = await res.json();

            setRole({
                role: ad.data.role,
            });

            console.log(ad.data.role);
            setIsLoading(false);
        }

        Fetchdata();
    },[]);

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Testing
          </Typography>
        </CardHeader>
        <CardBody>
          
        </CardBody>
      </Card>
    </div>
  );
}

export default TestingForm;
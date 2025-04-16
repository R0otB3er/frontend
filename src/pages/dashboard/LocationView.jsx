import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useUserStore } from "@/user_managment/user_store";

export function LocationView() {
  const Manager_ID = 3; //useUserStore(state => state.id);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

    
  useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            
            // Fetch maintenance requests data
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/getManagerView`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({Manager_ID})
            });
            
            const data = await response.json();
            console.log(data);
            
          } catch (err) {
            console.error("Error fetching maintenance requests:", err);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchData();
      }, []);

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Testing
          </Typography>
        </CardHeader>
        <CardBody>
        <Typography variant="h5" color="white" className="text-center">
            Testing
          </Typography>
        </CardBody>
      </Card>
    </div>
  );
}

export default LocationView;
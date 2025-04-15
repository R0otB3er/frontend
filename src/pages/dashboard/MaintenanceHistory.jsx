import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  import { useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  
  export function MaintenanceHistory() {
    const navigate = useNavigate();
    const [maintenanceRequests, setMaintenanceRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch maintenance requests data
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/maintenanceView`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });
          
          const data = await response.json();
          setMaintenanceRequests(data.maintenance_requests || []);
          console.log(data.maintenance_requests);
          
        } catch (err) {
          console.error("Error fetching maintenance requests:", err);
          setMaintenanceRequests([]);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleRowClick = (maintenanceId) => {
      navigate(`/maintenance/Maintenance_Edit/${maintenanceId}`);
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Typography variant="h5">Loading maintenance requests...</Typography>
        </div>
      );
    }
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Maintenance Requests
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Location", "Location Type", "Department", "Status"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenanceRequests.map((request) => {
                  return (
                    <tr 
                      key={request.Maintenance_ID} 
                      onClick={() => handleRowClick(request.Maintenance_ID)}
                      className="hover:bg-blue-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {request.Maintenance_ID}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {request.LOCATION}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {request.Location_ype}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {request.Department}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {request.status_types}
                        </Typography>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  export default MaintenanceHistory;
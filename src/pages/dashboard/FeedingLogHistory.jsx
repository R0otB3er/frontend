import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  import { useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import { useUserStore } from "@/user_managment/user_store";
  
  export function FeedingLogHistory() {
    const navigate = useNavigate();
    const employee_ID = useUserStore(state => state.id);
    const [feedingLogs, setFeedingLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch maintenance requests data
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employeeFeedingLogView`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({employee_ID}),
          });
          
          const data = await response.json();
          setFeedingLogs(data.feeding_logs || []);
          console.log(data.feeding_logs);
          
        } catch (err) {
          console.error("Error fetching maintenance requests:", err);
          setFeedingLogs([]);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, []);

    const formatDateForOutput = (isoDateString) => {
      if (!isoDateString) return "";
      const date = new Date(isoDateString);
      return date.toISOString().split('T')[0];
    };
  
    const handleRowClick = (logID) => {
      navigate(`/caretaker/FeedingLog_Edit/${logID}`);
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Typography variant="h5">Loading Feeding Logs...</Typography>
        </div>
      );
    }
  
    return (
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
            <Typography variant="h6" color="white">
              Feeding Logs
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["ID", "Habitat", "Animal", "Species", "Date", "Time", "Food", "Ammount"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feedingLogs.map((log) => {
                  return (
                    <tr 
                      key={log.Feeding_ID} 
                      onClick={() => handleRowClick(log.Feeding_ID)}
                      className="hover:bg-blue-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Feeding_ID}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Habitat_Name}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Animal_Name}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Species}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {formatDateForOutput(log.Feeding_Date)}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Feeding_Time}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Food}
                        </Typography>
                      </td>
                      <td className="py-3 px-5 border-b border-blue-gray-50">
                        <Typography variant="small" className="font-semibold text-blue-gray-600">
                          {log.Quantity}{log.Unit_text}
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
  
  export default FeedingLogHistory;
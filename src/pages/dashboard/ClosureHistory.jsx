import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function ClosureHistory() {
  const navigate = useNavigate();
  const [closures, setClosures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/closure/closureView`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await response.json();
        setClosures(data.data || []);
        console.log("Closure data:", data);
      } catch (err) {
        console.error("Error fetching closures:", err);
        setClosures([]);
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

  const handleRowClick = (closureId) => {
    navigate(`/maintenance/Closure_Edit/${closureId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading closure history...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Closure History
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["ID", "Location", "Department", "Type", "Start Date", "End Date", "Status"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {closures.map((closure) => {
                return (
                  <tr 
                    key={closure.closure_ID} 
                    onClick={() => handleRowClick(closure.closure_ID)}
                    className="hover:bg-blue-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.closure_ID}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.Location_Name}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.Department}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.Location_type}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {formatDateForOutput(closure.start_date)}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.end_date}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {closure.status_type}
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

export default ClosureHistory;
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

export function MedicalHistory() {
  const navigate = useNavigate();
  const employeeId = useUserStore(state => state.id);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/animalHealth/getMedicalView`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Employee_ID: employeeId })
        });
        
        const data = await response.json();
        setMedicalRecords(data || []);
        console.log("Medical records data:", data);
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setMedicalRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  const formatDateForOutput = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };

  const handleAddNewRecord = () => {
    navigate("/dashboard/Medical_Entry");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading medical history...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between items-center">
          <Typography variant="h6" color="white">
            Medical Records
          </Typography>
          <Button 
            color="green" 
            size="sm"
            onClick={handleAddNewRecord}
          >
            Add New Record
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          {medicalRecords.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="paragraph" color="blue-gray">
                No medical records found for your account.
              </Typography>
            </div>
          ) : (
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Record ID", "Animal ID", "Checkup Date", "Diagnosis", "Treatment", "Actions"].map((el) => (
                    <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                      <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {medicalRecords.map((record) => (
                  <tr key={record.Record_ID}>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {record.Record_ID}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {record.Animal_ID}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {formatDateForOutput(record.Checkup_Date)}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {record.Diagnosis}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Typography variant="small" className="font-semibold text-blue-gray-600">
                        {record.Treatment}
                      </Typography>
                    </td>
                    <td className="py-3 px-5 border-b border-blue-gray-50">
                      <Button
                        color="blue"
                        size="sm"
                        onClick={() => navigate(`/dashboard/Medical_Edit/${record.Record_ID}`)}
                      >
                        View/Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default MedicalHistory;
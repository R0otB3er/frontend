import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

const DEFAULT_FORM_VALUES = {
  Record_ID: "",
  Animal_ID: "",
  Animal_Name: "",
  Employee_ID: "",
  Checkup_Date: "",
  Diagnosis: "",
  Treatment: ""
};

export function MedicalEditForm() {
  const navigate = useNavigate();
  const employeeId = useUserStore(state => state.id);
  const { recordId } = useParams();
  const [requestData, setRequestData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [dropdownData, setDropdownData] = useState({
    Animals: [],
    Diagnoses: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch medical record details
        const recordRes = await fetch(`${import.meta.env.VITE_API_URL}/api/animalHealth/getMedicalDetails`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Record_ID: recordId })
        });
        const recordData = await recordRes.json();
        console.log(recordData);

        // Fetch available animals (if needed)
        const animalsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/animal/getAnimals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_ID: employeeId })
        });
        const animalsData = await animalsRes.json();

        

        // Set dropdown data
        setDropdownData({
          Animals: animalsData || [],
        });

        // Format date for input field
        const formattedDate = recordData.Checkup_Date 
          ? new Date(recordData.Checkup_Date).toISOString().split('T')[0]
          : "";

        // Set form data
        const initialData = {
          ...recordData,
          Checkup_Date: formattedDate,
        };
        
        setRequestData(initialData);
        setFormData(initialData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [recordId, employeeId]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, Checkup_Date: e.target.value }));
  };

  const isFormValid = () => {
    return (
      formData.Animal_ID &&
      formData.Checkup_Date &&
      formData.Diagnosis &&
      formData.Treatment
    );
  };

  const hasChanges = () => {
    return (
      formData.Animal_ID !== requestData.Animal_ID ||
      formData.Checkup_Date !== requestData.Checkup_Date ||
      formData.Diagnosis !== requestData.Diagnosis ||
      formData.Treatment !== requestData.Treatment
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges()) {
      alert("No changes detected.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/animalHealth/editMedical`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Record_ID: recordId,
          Animal_ID: formData.Animal_ID,
          Employee_ID: employeeId,
          Checkup_Date: formData.Checkup_Date,
          Diagnosis: formData.Diagnosis,
          Treatment: formData.Treatment
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert("Medical record updated successfully!");
        navigate("/caretaker/Medical_History");
      } else {
        alert(result.error || "Failed to update medical record");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while updating the record");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this medical record?")) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/animalHealth/deleteMedical`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Record_ID: recordId })
      });

      if (response.ok) {
        alert("Medical record deleted successfully!");
        navigate("/caretaker/Medical_History");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to delete medical record");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("An error occurred while deleting the record");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading medical record...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Medical Record #{recordId}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animal Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal*</label>
                <select
                  value={formData.Animal_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select Animal</option>
                  {dropdownData.Animals.map(animal => (
                    <option key={animal.Animal_ID} value={animal.Animal_ID}>
                      {animal.Animal_Name} (ID: {animal.Animal_ID})
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Checkup Date*</label>
                <input
                  type="date"
                  value={formData.Checkup_Date}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  required
                />
              </div>

              {/* Diagnosis  */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <input
                  type = "text"
                  value={formData.Diagnosis}
                  onChange={(e) => handleChange(e, "Diagnosis")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                />
              </div>

              {/* Treatment  */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatment</label>
                <input
                  type = "text"
                  value={formData.Treatment}
                  onChange={(e) => handleChange(e, "Treatment")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete Record
              </button>
              <button
                type="button"
                onClick={() => navigate("/caretaker/Medical_History")}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Back to Records
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  hasChanges() ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!hasChanges()}
              >
                Update Record
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default MedicalEditForm;
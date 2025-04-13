import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

// Default empty values for all fields
const DEFAULT_FORM_VALUES = {
  Feeding_ID: "",
  Animal_ID: "",
  Employee_ID: "",
  Food_Type: "",
  date: "",
  time: "",
  Quantity: "",
  Q_Unit: "",
};

export function FeedingLogEditForm() {
  const navigate = useNavigate();
  const employee_ID = useUserStore(state => state.id);
  const { feedingId } = useParams();
  const [requestData, setRequestData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [dropdownData, setDropdownData] = useState({
    Animals: [],
    Food_types: [],
    Units: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Safe value getter with fallback
  const getSafeValue = (data, key) => data[key] ?? DEFAULT_FORM_VALUES[key];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch dropdown options
        const formInfoRes = await fetch(`${import.meta.env.VITE_API_URL}/api/feeding/form-info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_ID }),
        });
        const formInfo = await formInfoRes.json();
        console.log(formInfo);
        setDropdownData(formInfo);

        // Fetch feeding log data
        const feedingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/feeding/details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedingId }),
        });
        const feedingData = await feedingRes.json();
        console.log(feedingData.request);

        // Format the date from ISO to YYYY-MM-DD
        const formattedDate = feedingData.request.Feeding_Date 
        ? new Date(feedingData.request.Feeding_Date).toISOString().split('T')[0] 
        : "";

        // Format the time to just HH:MM
        const formattedTime = feedingData.request.Feeding_Time 
        ? feedingData.request.Feeding_Time.split(':').slice(0, 2).join(':')
        : "";
            
        // Set requestData first
        setRequestData({
          ...DEFAULT_FORM_VALUES,
          ...feedingData.request,
          date: formattedDate,
          time: formattedTime,

        });

        // Then set formData with the received data
        setFormData({
          ...DEFAULT_FORM_VALUES,
          ...feedingData.request,
          date: formattedDate,
          time: formattedTime,
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        setRequestData({ ...DEFAULT_FORM_VALUES });
        setFormData({ ...DEFAULT_FORM_VALUES });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [feedingId]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    setFormData(prev => ({
      ...prev,
      date: e.target.value
    }));
  };

  const handleTimeChange = (e) => {
    setFormData(prev => ({
      ...prev,
      time: e.target.value
    }));
  };

  const isFormValid =
     formData.Food_Type !== requestData.Food_Type || 
     formData.date  !== requestData.date || 
     formData.time !== requestData.time||
     formData.Quantity !== requestData.Quantity ||
     formData.Q_Unit !== requestData.Q_Unit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return alert("Please complete all fields.");
  
    const payload = {
      Feeding_ID: feedingId,
      Animal_ID: formData.Animal_ID,
      Employee_ID: formData.Employee_ID,
      date: formData.date,
      time: formData.time,
      Food_Type: formData.Food_Type,
      Quantity: formData.Quantity,
      Q_Unit: formData.Q_Unit,
    };
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/editFeedingLog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        alert("Feeding log updated successfully!");
        navigate("/caretaker/Feeding_Log_History");
      } else {
        const error = await res.json();
        alert(error.message || "Update failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this feeding log? This action cannot be undone.");
    
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deleteFeedingLog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Feeding_ID: feedingId }),
      });

      if (res.ok) {
        alert("Feeding log deleted successfully!");
        navigate("/caretaker/Feeding_Log_History");
      } else {
        const error = await res.json();
        alert(error.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Deletion failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading feeding log data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Feeding Log #{feedingId}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Non-editable Animal */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal</label>
                <div className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100 text-gray-700">
                  {dropdownData.Animals.find(a => a.Animal_ID === requestData.Animal_ID)?.Animal_Name || "N/A"}
                </div>
              </div>

              {/* Non-editable Employee */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee</label>
                <div className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100 text-gray-700">
                  {requestData.first_Name || "N/A"} {requestData.last_Name || ""}
                </div>
              </div>

              {/* Editable Food Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Food Type*</label>
                <select
                  value={getSafeValue(formData, 'Food_Type')}
                  onChange={(e) => handleChange(e, "Food_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select Food</option>
                  {dropdownData.Food_types?.map((food) => (
                    <option key={food.foodtype_ID} value={food.foodtype_ID}>
                      {food.food_Types}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date & Time*</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={getSafeValue(formData, 'date')}
                    onChange={handleDateChange}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                    required
                  />
                  <input
                    type="time"
                    value={getSafeValue(formData, 'time')}
                    onChange={handleTimeChange}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity*</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={getSafeValue(formData, 'Quantity')}
                    onChange={(e) => handleChange(e, "Quantity")}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm"
                    min={0}
                    required
                  />
                  <select
                    value={getSafeValue(formData, 'Q_Unit')}
                    onChange={(e) => handleChange(e, "Q_Unit")}
                    className="border px-3 py-2 w-1/2 rounded-md shadow-sm bg-white text-gray-600"
                    required
                  >
                    <option value="">Unit</option>
                    {dropdownData.Units?.map((unit) => (
                      <option key={unit.Unit_ID} value={unit.Unit_ID}>
                        {unit.Unit_text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Delete Log
              </button>
              <button
                type="button"
                onClick={() => navigate("/caretaker/Feeding_Log_History")}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Back to Logs
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                Update Log
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default FeedingLogEditForm;
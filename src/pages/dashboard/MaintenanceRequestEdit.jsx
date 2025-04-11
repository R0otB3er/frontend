import CurrencyInput from 'react-currency-input-field';
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

// Default empty values for all fields
const DEFAULT_FORM_VALUES = {
  Maintenance_ID: "",
  Location_Name: "",
  Location_type: "",
  request_desc: "",
  End_Date: "",
  Description: "",
  Status: "",
  cost: "",
  Maintenance_EmployeeID: "",
  RecentCheck: new Date().toISOString().split('T')[0],
};

export function MaintenanceEditForm() {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [requestData, setRequestData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    employees: [],
    statuses: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Safe value getter with fallback
  const getSafeValue = (data, key) => data[key] ?? DEFAULT_FORM_VALUES[key];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
  
        // Fetch dropdown options
        const formInfoRes = await fetch(`${import.meta.env.VITE_API_URL}/api/getMaintenanceEditFormInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const formInfo = await formInfoRes.json();
        setDropdownValues({
          employees: formInfo.employees || [],
          statuses: formInfo.statuses || []
        });
  
        // Fetch maintenance request data
        const maintenanceRes = await fetch(`${import.meta.env.VITE_API_URL}/api/getMaintenanceInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ requestId }),
        });
        const maintenanceData = await maintenanceRes.json();
        console.log(maintenanceData.request);
        // Set requestData first
        setRequestData({
          ...DEFAULT_FORM_VALUES,
          ...maintenanceData.request
        });
  
        // Then set formData with the received data
        setFormData({
          ...DEFAULT_FORM_VALUES,
          ...maintenanceData.request,  // Use the fresh data directly
          End_Date: formatDateForInput(maintenanceData.request.End_Date),
          RecentCheck: new Date().toISOString().split('T')[0]
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
  }, [requestId]);

  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setErrors((prev) => ({ ...prev, [field]: value.trim() ? null : "This field cannot be empty." }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => { 
    const dateValue = e.target.value || "";
    setFormData(prev => ({
      ...prev,
      End_Date: dateValue
    }));
    setErrors(prev => ({
      ...prev,
      End_Date: dateValue ? null : "This field cannot be empty."
    }));
  };

  const handleCurrencyChange = (value) => {
    setFormData(prev => ({ ...prev, cost: value || "" }));
  };

  const isFormValid = Object.values(errors).every(err => !err) && 
    formData.Status && 
    formData.Maintenance_EmployeeID;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) return;

    try {
      const payload = {
        ...formData,
        Maintenance_ID: requestId,
        Description: formData.Description || null,
        cost: formData.cost || null, // Handle empty cost
        End_Date: formData.End_Date || null // Handle empty date
      };

      console.log(payload);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/editMaintenanceRow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Maintenance request updated successfully!");
        //navigate(-1);
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
    // Confirm deletion with user
    const confirmDelete = window.confirm("Are you sure you want to delete this maintenance request? This action cannot be undone.");
    
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/deleteMaintenanceRow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Maintenance_ID: requestId }),
      });
  
      if (res.ok) {
        alert("Maintenance request deleted successfully!");
        navigate(-1); // Go back to previous page after deletion
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
        <Typography variant="h5">Loading request data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Maintenance Request #{requestId}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Non-editable Location ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">{getSafeValue(requestData, 'Location_type')}</label>
                <div className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100 text-gray-700">
                  {getSafeValue(requestData, 'Location_Name')}
                </div>
                <input 
                  type="hidden" 
                  name="Location_Name" 
                  value={getSafeValue(formData, 'Location_Name')} 
                />
              </div>

              {/* Non-editable Request Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Original Request</label>
                <div className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100 text-gray-700 min-h-[42px]">
                  {getSafeValue(requestData, 'request_desc')}
                </div>
              </div>

              {/* Employee Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Employee*</label>
                <select
                  value={getSafeValue(formData, 'Maintenance_EmployeeID')}
                  onChange={(e) => handleChange(e, "Maintenance_EmployeeID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select an employee</option>
                  {dropdownValues.employees?.map((emp) => (
                    <option key={emp.Employee_ID} value={emp.Employee_ID}>
                      {emp.first_Name} {emp.last_Name}
                    </option>
                  ))}
                </select>
                {errors.Maintenance_Employee && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Maintenance_Employee}
                  </Typography>
                )}
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status*</label>
                <select
                  value={getSafeValue(formData, 'Status')}
                  onChange={(e) => handleChange(e, "Status")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select status</option>
                  {dropdownValues.statuses?.map((stat) => (
                    <option key={stat.status_typeID} value={stat.status_typeID}>
                      {stat.status_types}
                    </option>
                  ))}
                </select>
                {errors.Status && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Status}
                  </Typography>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Resolution Description*</label>
                <textarea
                  value={getSafeValue(formData, 'Description')}
                  onChange={(e) => handleChange(e, "Description")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600 min-h-[100px]"
                />
                {errors.Description && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Description}
                  </Typography>
                )}
              </div>

              {/* Cost Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Cost</label>
                <CurrencyInput
                  placeholder="Enter cost"
                  value={getSafeValue(formData, 'cost')}
                  decimalsLimit={2}
                  onValueChange={handleCurrencyChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>

              {/* Completion Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Completion Date</label>
                <input
                  type="date"
                  value={getSafeValue(formData, 'End_Date')}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
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
              Delete Request
            </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                Update Request
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default MaintenanceEditForm;
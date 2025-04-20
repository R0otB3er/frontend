import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography,
  Button
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

const DEFAULT_FORM_VALUES = {
  closure_ID: "",
  start_date: "",
  end_date: "",
  location_ID: "",
  description: "",
  mnt_ID: "",
  Location_Name: "",
  Location_type: "",
  Department: ""
};

export function EditClosure() {
  const navigate = useNavigate();
  const { closureId } = useParams();
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClosureData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/closure/getClosureInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ closure_ID: closureId }),
        });
        
        const data = await response.json();

        console.log(data);

        if (data) {
          setFormData({
            ...data.closure,
            start_date: formatDateForInput(data.closure.start_date),
            end_date: formatDateForInput(data.closure.end_date)
          });
        }
      } catch (err) {
        console.error("Error fetching closure data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClosureData();
  }, [closureId]);

  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: value.trim() ? null : "This field is required" }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: value ? null : "This field is required" }));
  };

  const isFormValid = () => {
    return (
      formData.start_date &&
      formData.end_date &&
      formData.description &&
      new Date(formData.start_date) <= new Date(formData.end_date)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert("Please fill all required fields and ensure dates are valid");
      return;
    }

    try {
      const payload = {
        closure_ID: closureId,
        start_date: formData.start_date,
        end_date: formData.end_date,
        location_ID: formData.location_ID,
        description: formData.description,
        mnt_ID: formData.mnt_ID
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/closure/editClosure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Closure updated successfully!");
        navigate("/maintenance/Closure_History");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update closure");
      }
    } catch (err) {
      console.error("Error updating closure:", err);
      alert("Failed to update closure. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this closure? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/closure/deleteClosure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ closure_ID: closureId }),
      });

      if (response.ok) {
        alert("Closure deleted successfully!");
        navigate("/closure/Closure_History");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete closure");
      }
    } catch (err) {
      console.error("Error deleting closure:", err);
      alert("Failed to delete closure. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading closure data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Edit Closure #{closureId}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Non-editable Location */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <div className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100 text-gray-700">
                  {formData.Location_Name} ({formData.Location_type}) - {formData.Department}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date*</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  required
                />
                {errors.start_date && (
                  <Typography className="text-red-500 text-xs">
                    {errors.start_date}
                  </Typography>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date*</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleDateChange}
                  min={formData.start_date}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  required
                />
                {errors.end_date && (
                  <Typography className="text-red-500 text-xs">
                    {errors.end_date}
                  </Typography>
                )}
                {formData.start_date && formData.end_date && 
                  new Date(formData.start_date) > new Date(formData.end_date) && (
                  <Typography className="text-red-500 text-xs">
                    End date must be after start date
                  </Typography>
                )}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm min-h-[100px]"
                  required
                />
                {errors.description && (
                  <Typography className="text-red-500 text-xs">
                    {errors.description}
                  </Typography>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                type="button"
                onClick={handleDelete}
                color="red"
                className="px-4 py-2"
              >
                Delete Closure
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/closure/Closure_History")}
                color="gray"
                className="px-4 py-2"
              >
                Back to History
              </Button>
              <Button
                type="submit"
                color="green"
                className="px-4 py-2"
                disabled={!isFormValid()}
              >
                Update Closure
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default EditClosure;
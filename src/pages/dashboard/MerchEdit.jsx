import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography,
  Button,
  Tooltip
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';

// Default empty values for all fields
const DEFAULT_FORM_VALUES = {
  Item_Name: "",
  Item_Type: "",
  V_ID: "",
  Item_Price: "",
  m_cost: ""
};

export function MerchEdit() {
  const navigate = useNavigate();
  const { Merchandise_ID } = useParams();
  const [merchData, setMerchData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownValues, setDropdownValues] = useState({
    types: [],
    vendors: []
  });

  // Safe value getter with fallback
  const getSafeValue = (data, key) => data[key] ?? DEFAULT_FORM_VALUES[key];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dropdown options
        const dropdownRes = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/getDropdowns`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const dropdownData = await dropdownRes.json();
        setDropdownValues({
          types: dropdownData.types || [],
          vendors: dropdownData.vendors || []
        });

        // Fetch merchandise data
        const merchRes = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/getMerchByID`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Merchandise_ID),
        });
        
        if (!merchRes.ok) {
          throw new Error("Failed to fetch merchandise data");
        }

        const merchInfo = await merchRes.json();
        
        if (!merchInfo || merchInfo.length === 0) {
          throw new Error("No merchandise found with that ID");
        }

        setMerchData(merchInfo[0]);
        setFormData({
          ...DEFAULT_FORM_VALUES,
          ...merchInfo[0]
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        alert(err.message || "Failed to load merchandise data");
        navigate("/admin/Merch_Stock");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [Merchandise_ID, navigate]);

  const handleChange = (event, field) => {
    const value = event.target.value;
    setErrors((prev) => ({ ...prev, [field]: value.trim() ? null : "This field cannot be empty." }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value || "" }));
    setErrors(prev => ({ ...prev, [field]: value ? null : "This field is required" }));
  };

  const isFormValid = () => {
    return formData.Item_Name && 
           formData.Item_Type && 
           formData.V_ID && 
           formData.Item_Price && 
           formData.m_cost;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const payload = {
        ...formData,
        Merchandise_ID: Merchandise_ID
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/updateMerchandise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Merchandise updated successfully!");
        navigate("/admin/Merch_Stock"); 
      } else {
        const error = await res.json();
        alert(error.error || "Update failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this merchandise? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/deleteMerchandise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Merch_ID: Merchandise_ID }),
      });

      if (res.ok) {
        alert("Merchandise deleted successfully!");
        navigate("/admin/Merch_Stock");
      } else {
        const error = await res.json();
        alert(error.error || "Deletion failed");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Deletion failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading merchandise data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Edit Merchandise #{Merchandise_ID}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Item Name*</label>
                <input
                  type="text"
                  value={getSafeValue(formData, 'Item_Name')}
                  onChange={(e) => handleChange(e, "Item_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                />
                {errors.Item_Name && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Item_Name}
                  </Typography>
                )}
              </div>

              {/* Item Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Type*</label>
                <select
                  value={getSafeValue(formData, 'Item_Type')}
                  onChange={(e) => handleChange(e, "Item_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select an item type</option>
                  {dropdownValues.types?.map((type) => (
                    <option key={type.item_typeID} value={type.item_typeID}>
                      {type.item_types}
                    </option>
                  ))}
                </select>
                {errors.Item_Type && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Item_Type}
                  </Typography>
                )}
              </div>

              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor*</label>
                <select
                  value={getSafeValue(formData, 'V_ID')}
                  onChange={(e) => handleChange(e, "V_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select a vendor</option>
                  {dropdownValues.vendors?.map((vendor) => (
                    <option key={vendor.Vendor_ID} value={vendor.Vendor_ID}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
                {errors.V_ID && (
                  <Typography className="text-red-500 text-xs">
                    {errors.V_ID}
                  </Typography>
                )}
              </div>

              {/* Item Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Price*</label>
                <CurrencyInput
                  placeholder="Enter retail price"
                  value={getSafeValue(formData, 'Item_Price')}
                  decimalsLimit={2}
                  onValueChange={(value) => handleCurrencyChange("Item_Price", value)}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                />
                {errors.Item_Price && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Item_Price}
                  </Typography>
                )}
              </div>

              {/* Cost */}
              <div>
                <div className="flex items-center gap-1">
                  <label className="block text-sm font-medium text-gray-700">Cost*</label>
                  <Tooltip
                    content="bulk purchases will automatically update this value"
                    placement="top"
                    className="bg-gray-800 p-2"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor" 
                      className="w-4 h-4 text-gray-500 cursor-help"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </Tooltip>
                </div>
                <CurrencyInput
                  placeholder="Enter cost"
                  value={getSafeValue(formData, 'm_cost')}
                  decimalsLimit={2}
                  onValueChange={(value) => handleCurrencyChange("m_cost", value)}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                />
                {errors.m_cost && (
                  <Typography className="text-red-500 text-xs">
                    {errors.m_cost}
                  </Typography>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleDelete}
                color="red"
                className="px-4 py-2"
              >
                Delete Merchandise
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(-1)}
                  color="gray"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="green"
                  className="px-4 py-2"
                  disabled={!isFormValid()}
                >
                  Update Merchandise
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default MerchEdit;
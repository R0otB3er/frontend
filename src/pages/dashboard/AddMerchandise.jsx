import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Tooltip } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import CurrencyInput from 'react-currency-input-field';

export function AddMerch() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Item_Name: "",
    Item_Type: "",
    V_ID: "",
    Item_Price: "",
    m_cost: ""
  });

  const [errors, setErrors] = useState({});
  const [dropdowns, setDropdowns] = useState({
    types: [],
    vendors: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dropdown data from API
    const fetchDropdowns = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/getDropdowns`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        const data = await response.json();
        setDropdowns({
          types: data.types || [],
          vendors: data.vendors || []
        });
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    // Validation logic
    if (!value.trim()) {
      error = "This field cannot be empty.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value || "" }));
    setErrors(prev => ({ ...prev, [field]: value ? null : "This field is required" }));
  };

  // Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Item_Name.trim() !== "" &&
    formData.Item_Type !== "" &&
    formData.V_ID !== "" &&
    formData.Item_Price !== "" &&
    formData.m_cost !== "";

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log(formData);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/merchandise/addMerchandise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("Merchandise added successfully:", data);
        alert("Merchandise added successfully!");
        
        // Reset form
        setFormData({
          Item_Name: "",
          Item_Type: "",
          V_ID: "",
          Item_Price: "",
          m_cost: ""
        });
        
        // Optionally navigate away
        navigate("/admin/Merch_Stock");
      } else {
        alert(data.error || "Failed to add merchandise");
      }
    } catch (err) {
      console.error("Error adding merchandise:", err);
      alert("Failed to add merchandise. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading form data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Add New Merchandise
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Name Field */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Item Name*</label>
                <input
                  type="text"
                  value={formData.Item_Name}
                  onChange={(e) => handleChange(e, "Item_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="Enter item name"
                />
                {errors.Item_Name && <Typography className="text-red-500 text-xs">{errors.Item_Name}</Typography>}
              </div>

              {/* Item Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Type*</label>
                <select
                  value={formData.Item_Type}
                  onChange={(e) => handleChange(e, "Item_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select an item type</option>
                  {dropdowns.types.map((type) => (
                    <option key={type.item_typeID} value={type.item_typeID}>
                      {type.item_types}
                    </option>
                  ))}
                </select>
                {errors.Item_Type && <Typography className="text-red-500 text-xs">{errors.Item_Type}</Typography>}
              </div>

              {/* Vendor Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Vendor*</label>
                <select
                  value={formData.V_ID}
                  onChange={(e) => handleChange(e, "V_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select a vendor</option>
                  {dropdowns.vendors.map((vendor) => (
                    <option key={vendor.Vendor_ID} value={vendor.Vendor_ID}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
                {errors.V_ID && <Typography className="text-red-500 text-xs">{errors.V_ID}</Typography>}
              </div>

              {/* Item Price Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Price*</label>
                <CurrencyInput
                  placeholder="Enter retail price"
                  value={formData.Item_Price}
                  decimalsLimit={2}
                  onValueChange={(value) => handleCurrencyChange("Item_Price", value)}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.Item_Price && <Typography className="text-red-500 text-xs">{errors.Item_Price}</Typography>}
              </div>

              {/* Cost Field */}
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
                    value={formData.m_cost}
                    decimalsLimit={2}
                    onValueChange={(value) => handleCurrencyChange("m_cost", value)}
                    className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.m_cost && <Typography className="text-red-500 text-xs">{errors.m_cost}</Typography>}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!isFormValid}
              >
                Add Merchandise
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddMerch;
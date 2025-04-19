import CurrencyInput from 'react-currency-input-field';
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function BulkPurchaseEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Merchandise_ID: "",
    Bulk_cost: "",
    Amount_of_items: "",
    Date_purchased: "",
  });

  const [errors, setErrors] = useState({}); 
  const [dropdownValues, setDropdownValues] = useState({
    item_types: [],
    merchandise: [],
  });

  useEffect(() => {
  
    fetch(`${import.meta.env.VITE_API_URL}/api/BulkPurchase/getBulkPurchaseFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Form Info Response Data:", data); //  Log the backend response
        setDropdownValues(data);
      })
      .catch((err) => console.error("❌ Error fetching feeding form info:", err));
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    let value = event.target.value;
    let error = "";

    // Validation checks
    if (!value.trim()) {
      error = "This field cannot be empty.";
    }
    
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => { 
    const dateValue = e.target.value;
    setFormData(prev => ({
      ...prev,
      Date_purchased: dateValue
    }));
    
    // Clear any date error if date is selected
    setErrors(prev => ({
      ...prev,
      Date_purchased: dateValue ? null : "This field cannot be empty."
    }));
  };
  

  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Merchandise_ID.trim() !== "" &&
    formData.Bulk_cost.trim() !== "" &&
    formData.Amount_of_items.trim() !== "" &&
    formData.Date_purchased.trim() !== "";

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    const payload = { ...formData };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/BulkPurchase/addBulkPurchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        console.log("Form submitted:", payload);
      } else {
        console.error(res.error);
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    } finally {
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Bulk Purchase Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item types Dropdown 
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Types</label>
                <select
                  value={formData.Merchandise_ID}
                  onChange={(e) => handleChange(e, "Item_name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Item</option>
                  {dropdownValues.merchandise.map((item) => (
                    <option key={item} value={item.Merchandise_ID}>{item.Item_Name}</option>
                  ))}
                </select>
              </div>*/}
              
              {/* Item Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <select
                  value={formData.Merchandise_ID}
                  onChange={(e) => handleChange(e, "Merchandise_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Item</option>
                  {dropdownValues.merchandise.map((item) => (
                    <option key={item.Merchandise_ID} value={item.Merchandise_ID}>{item.Item_Name}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Cost Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bulk Cost ($)</label>
                <CurrencyInput
                  placeholder="Please enter the cost"
                  value={formData.Bulk_cost}
                  decimalsLimit={2}
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, Bulk_cost: value || "" }));
                    setErrors(prev => ({ ...prev, Bulk_cost: value ? null : "This field cannot be empty." }));
                  }}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.Bulk_cost && <Typography className="text-red-500 text-xs">{errors.Bulk_cost}</Typography>}
              </div>

              {/* Amount of Items Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount of Items</label>
                <input
                  type="number"
                  value={formData.Amount_of_items}
                  onChange={(e) => handleChange(e, "Amount_of_items")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  min = {0}
                />
                {errors.Amount_of_items && <Typography className="text-red-500 text-xs">{errors.Amount_of_items}</Typography>}
              </div>

              {/* Date Purchased */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Purchased</label>
                <input
                  type="date"
                  value={formData.Date_purchased}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isFormValid}
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default BulkPurchaseEntryForm;

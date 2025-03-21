import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueBulkPurchaseValues } from "@/data"; // ✅ Import function

export function BulkPurchaseEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Merchant_Name: "",
    Item_name: "",
    Bulk_cost: "",
    Amount_of_items: "",
    Date_purchased: "",
    Producer: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    merchantNames: [],
    itemNames: [],
    producers: [],
  });

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    // Fetch unique values for dropdowns
    const { uniqueMerchantNames, uniqueItemNames, uniqueProducers } = getUniqueBulkPurchaseValues();
    setDropdownValues({
      merchantNames: uniqueMerchantNames,
      itemNames: uniqueItemNames,
      producers: uniqueProducers,
    });
  }, []);

  // Handle input changes
  const handleChange = (event, field) => {
    let value = event.target.value;
    let error = "";

    // Validation checks
    if (!value.trim()) {
      error = "This field cannot be empty.";
    } else if (field === "Bulk_cost" && !/^\$\d+(\.\d{2})?$/.test(value)) {
      error = "Bulk cost must be in the format $XX.XX";
    } else if (field === "Amount_of_items" && !/^\d+$/.test(value)) {
      error = "Amount must be a whole number.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Date selection
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    updateDatePurchased(event.target.value);
  };

  // Update Date in MM/DD/YYYY format
  const updateDatePurchased = (date) => {
    if (date) {
      const formattedDate = formatDateToMMDDYYYY(date);
      setFormData((prev) => ({ ...prev, Date_purchased: formattedDate }));
    }
  };

  // Format date to MM/DD/YYYY
  const formatDateToMMDDYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Merchant_Name.trim() !== "" &&
    formData.Item_name.trim() !== "" &&
    formData.Bulk_cost.trim() !== "" &&
    formData.Amount_of_items.trim() !== "" &&
    formData.Date_purchased.trim() !== "" &&
    formData.Producer.trim() !== "";

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      Merchant_Name: "",
      Item_name: "",
      Bulk_cost: "",
      Amount_of_items: "",
      Date_purchased: "",
      Producer: "",
    });
    setSelectedDate("");


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
              {/* Merchant Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Merchant Name</label>
                <select
                  value={formData.Merchant_Name}
                  onChange={(e) => handleChange(e, "Merchant_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Merchant</option>
                  {dropdownValues.merchantNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Item Name Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <select
                  value={formData.Item_name}
                  onChange={(e) => handleChange(e, "Item_name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Item</option>
                  {dropdownValues.itemNames.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Bulk Cost Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bulk Cost ($)</label>
                <input
                  type="text"
                  value={formData.Bulk_cost}
                  onChange={(e) => handleChange(e, "Bulk_cost")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  placeholder="$XX.XX"
                />
                {errors.Bulk_cost && <Typography className="text-red-500 text-xs">{errors.Bulk_cost}</Typography>}
              </div>

              {/* Amount of Items Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount of Items</label>
                <input
                  type="text"
                  value={formData.Amount_of_items}
                  onChange={(e) => handleChange(e, "Amount_of_items")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
                {errors.Amount_of_items && <Typography className="text-red-500 text-xs">{errors.Amount_of_items}</Typography>}
              </div>

              {/* Date Purchased */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Purchased</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>

              {/* Producer Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Producer</label>
                <select
                  value={formData.Producer}
                  onChange={(e) => handleChange(e, "Producer")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Producer</option>
                  {dropdownValues.producers.map((producer) => (
                    <option key={producer} value={producer}>{producer}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/dashboard/Bulk_Purchase_Query")}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Bulk Purchase Query
              </button>
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

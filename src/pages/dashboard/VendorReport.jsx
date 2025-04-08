import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import {
  DepartmentSalesChartConfig,
  ItemTypeSalesChartConfig,
  VendorSalesChartConfig,
  MerchSalesChartConfig
} from "@/widgets/charts/vendor-sales-charts";


export function VendorReport() {
  const [formData, setFormData] = useState({
    Department_ID: "",
    Vendor_ID: "",
    item_typeID: "",
    Merchandise_ID: "",
    start_date: "",
    end_date: "",
  });

  const [dropdownData, setDropdownData] = useState({
    Departments: [],
    Vendors: [],
    ItemTypes: [],
    Merchandise: [],
  });

  const [reportData, setReportData] = useState({
    deptSales: [],
    vendorSales: [],
    itemSales: [],
    itemTypeSales: []
  });

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const isFormValid =
    formData.start_date &&
    formData.end_date &&
    formData.start_date < formData.end_date;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getVendMerchReportFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Query Form Info Response Data:", data);
        setDropdownData(data)
      })
      .catch((err) => console.error("Error fetching form data:", err));
  }, []);

  const handleChange = (e, field) => {
    let value;
    
    // Handle different input types
    switch (e.target.type) {
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'date':
        value = e.target.value; // This will be in YYYY-MM-DD format
        break;
      default:
        value = e.target.value;
    }
  
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Reset dependent fields when parent changes
      if (field === "IsGeneral" && value === true) {
        updated.Department = "";
        updated.Attraction = "";
      }
      
      // Additional logic for date validation if needed
      if (field === "start_date" || field === "end_date") {
        // Ensure end date is not before start date
        if (field === "end_date" && updated.start_date && value < updated.start_date) {
          // You could set some error state here or adjust the value
          console.warn("End date cannot be before start date");
        }
        
        if (field === "start_date" && updated.end_date && value > updated.end_date) {
          console.warn("Start date cannot be after end date");
        }
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please input a valid start and end date.");
      return;
    }
  
    setIsLoading(true);
    setShowCharts(false);
  
    const payload = { ...formData };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getVendMerchReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("retrived report info:", result)
        setReportData(result);
        console.log("SAMPLE ITEM DATA:", result.itemSales[0]);
      } else {
        console.error(res.error);
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <div className="mt-12 flex flex-col items-center">
      {/* Form Card */}
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Vendor Report Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Departments"
              value={formData.Department_ID}
              onChange={(e) => handleChange(e, "Department_ID")}
              defaultLabel="All Departments"
              options={dropdownData.Departments.map((d) => ({
                value: d.Department_ID,
                label: d.Department_name,
              }))}
              />

<SelectField
  label="Vendors"
  value={formData.Vendor_ID}
  onChange={(e) => handleChange(e, "Vendor_ID")}
  defaultLabel="All Vendors"
  disabled={!formData.Department_ID} // Disable if no department selected
  options={dropdownData.Vendors
    .filter((v) => v.Dept_ID == formData.Department_ID)
    .map((v) => ({
      value: v.Vendor_ID,
      label: v.name,
    }))}
/>


              <SelectField
              label="Merchandise Types"
              value={formData.item_typeID}
              onChange={(e) => handleChange(e, "item_typeID")}
              defaultLabel="All Merchandise Type"
              options={dropdownData.ItemTypes.map((i) => ({
                value: i.item_typeID,
                label: i.item_types,
              }))}
              />

<SelectField
  label="Specific Merchandise"
  value={formData.Merchandise_ID}
  onChange={(e) => handleChange(e, "Merchandise_ID")}
  defaultLabel="All Merchandise"
  disabled={!formData.item_typeID} // Disable if no item type selected
  options={dropdownData.Merchandise
    .filter((m) => m.Item_Type == formData.item_typeID)
    .map((m) => ({
      value: m.Merchandise_ID,
      label: m.Item_Name,
    }))}
/>

              <InputField
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange(e, "start_date")}
              />
              <InputField
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange(e, "end_date")}
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Spinner */}
      {isLoading && <Spinner className="mt-8 h-10 w-10 text-gray-700" />}

      {/* Chart and Table */}
      {(reportData.deptSales.length > 0 ||
  reportData.vendorSales.length > 0 ||
  reportData.itemTypeSales.length > 0 ||
  reportData.itemSales.length > 0) && (
  <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
    {reportData.deptSales.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-4">
        <StatisticsChart
          color="white"
          chart={DepartmentSalesChartConfig({ data: reportData.deptSales })}
        />
      </div>
    )}

    {reportData.vendorSales.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-4">
        <StatisticsChart
          color="white"
          chart={VendorSalesChartConfig({ data: reportData.vendorSales })}
        />
      </div>
    )}

    {reportData.itemTypeSales.length > 0 && (
      <div className="bg-white rounded-lg shadow-md p-4">
        <StatisticsChart
          color="white"
          chart={ItemTypeSalesChartConfig({ data: reportData.itemTypeSales })}
        />
      </div>
    )}

{reportData.itemSales.length > 0 && (
  <div className="bg-white rounded-lg shadow-md p-4">
    <StatisticsChart
      color="white"
      chart={MerchSalesChartConfig({
        data: reportData.itemSales,
        selectedDepartment: formData.Department_ID || "all",
        selectedItemType: formData.item_typeID || "all",
        selectedMerchItem: formData.Merchandise_ID || "all"
      })}
    />
  </div>
)}

  </div>
)}

{reportData.itemSales.length > 0 && (
  <Card className="mt-6 w-full max-w-6xl">
    <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
      <Typography variant="h6" color="white">
        Sales Report Table
      </Typography>
    </CardHeader>
    <CardBody className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            {["Date", "Item Name", "Sales ($)"].map((head) => (
              <th
                key={head}
                className="px-4 py-2 text-left text-sm font-semibold text-blue-gray-500"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reportData.itemSales.map((row, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">
                {new Date(row.sale_date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{row.Item_Name}</td>
              <td className="px-4 py-2">${parseFloat(row.total_sales).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right pr-4">
        <Typography variant="h6" className="text-green-700">
          Total Revenue: $
          {reportData.itemSales
            .reduce((sum, row) => sum + parseFloat(row.total_sales || 0), 0)
            .toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Typography>
      </div>
    </CardBody>
  </Card>
)}

    </div>
  );
}

function SelectField({ label, value, onChange, options, defaultLabel, disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border px-3 py-2 w-full rounded-md shadow-sm ${
          disabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-600"
        }`}
      >
        <option value="">{defaultLabel}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}



function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input {...props} className="border px-3 py-2 w-full rounded-md shadow-sm" />
    </div>
  );
}

export default VendorReport;

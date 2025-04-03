import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import DepartmentSalesChartConfig from "@/widgets/charts/vendor-sales-charts";

const dummySalesData = [
  { date: "2023-01-01", sales: 2026, department: "Aquatic" },
  { date: "2023-01-01", sales: 1925, department: "Safari" },
  { date: "2023-01-01", sales: 2413, department: "Reptile" },
  { date: "2023-01-01", sales: 2057, department: "Birds" },
  { date: "2023-01-02", sales: 1730, department: "Aquatic" },
  { date: "2023-01-02", sales: 1168, department: "Safari" },
  { date: "2023-01-02", sales: 1317, department: "Reptile" },
  { date: "2023-01-02", sales: 1032, department: "Birds" },
  { date: "2023-01-03", sales: 1651, department: "Aquatic" },
  { date: "2023-01-03", sales: 2094, department: "Safari" },
  // ... add more as needed
];


export function VendorReport() {
  const [formData, setFormData] = useState({
    Department_ID: "",
    Vendor_ID: "",
    item_typeID: "",
    Merchandise_ID: "",
    Start_Date: "",
    End_Date: "",
  });

  /*const [dropdownData, setDropdownData] = useState({
    Departments: [],
    Vendors: [],
    Item_types: [],
    Merchandise: [],
  });*/
  const [dropdownData] = useState({
    Departments: [
      { Department_ID: "1", name: "Aquatic" },
      { Department_ID: "2", name: "Safari" },
      { Department_ID: "3", name: "Reptile" },
    ],
    Vendors: [
      { Vendor_ID: "1", name: "ZooSupply Co." },
      { Vendor_ID: "2", name: "WildThings Inc." },
    ],
    Item_types: [
      { item_typeID: "1", item_types: "Toys" },
      { item_typeID: "2", item_types: "Snacks" },
    ],
    Merchandise: [
      { Merchandise_ID: "1", Item_Name: "Plush Lion" },
      { Merchandise_ID: "2", Item_Name: "Zoo Map Poster" },
    ],
  });

  const [chartData, setChartData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCharts, setShowCharts] = useState(false);

  const isFormValid =
    formData.Start_Date &&
    formData.End_Date &&
    formData.Start_Date < formData.End_Date;

  /*useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getVendMerchReportFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setDropdownData(data))
      .catch((err) => console.error("Error fetching form data:", err));
  }, []);*/

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please input a valid start and end date.");
      return;
    }
  
    setIsLoading(true);
    setShowCharts(false);
  
    setTimeout(() => {
      const filtered = dummySalesData.filter((row) => {
        const rowDate = new Date(row.date);
        const start = new Date(formData.Start_Date);
        const end = new Date(formData.End_Date);
        return rowDate >= start && rowDate <= end;
      });
  
      setChartData(filtered);
      setReportData(filtered);
      const total = filtered.reduce((sum, row) => sum + row.sales, 0);
setTotalRevenue(total);
      setIsLoading(false);
      setShowCharts(true);
    }, 800);
  };

    /*const payload = { ...formData };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/QueryVendorSalesReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        const chartFormatted = result.map((row) => ({
          date: row.date,
          sales: row.sales,
          department: row.department,
        }));

        setChartData(chartFormatted);
        setReportData(result);
        setShowCharts(true);
      } else {
        console.error(result.error);
        alert("Failed to generate report.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };*/


const chartConfig = DepartmentSalesChartConfig.getConfig({
  data: chartData,
  type: "line",
});



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
    label: d.name,
  }))}
/>

<SelectField
  label="Vendors"
  value={formData.Vendor_ID}
  onChange={(e) => handleChange(e, "Vendor_ID")}
  defaultLabel="All Vendors"
  options={dropdownData.Vendors.map((v) => ({
    value: v.Vendor_ID,
    label: v.name,
  }))}
/>

<SelectField
  label="Merchandise Types"
  value={formData.item_typeID}
  onChange={(e) => handleChange(e, "item_typeID")}
  defaultLabel="All Merchandise Type"
  options={dropdownData.Item_types.map((i) => ({
    value: i.item_typeID,
    label: i.item_types,
  }))}
/>

<SelectField
  label="Specific Merchandise"
  value={formData.Merchandise_ID}
  onChange={(e) => handleChange(e, "Merchandise_ID")}
  defaultLabel="All Merchandise"
  options={dropdownData.Merchandise.map((m) => ({
    value: m.Merchandise_ID,
    label: m.Item_Name,
  }))}
/>

              <InputField
                label="Start Date"
                type="date"
                value={formData.Start_Date}
                onChange={(e) => handleChange(e, "Start_Date")}
              />
              <InputField
                label="End Date"
                type="date"
                value={formData.End_Date}
                onChange={(e) => handleChange(e, "End_Date")}
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
      {showCharts && !isLoading && (
        <>
          <StatisticsChart
            color="white"
            chart={chartConfig}
            title="Monthly Department Sales"
            description="Comparison across all departments"
          />

          <Card className="mt-6 w-full max-w-4xl">
            <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
              <Typography variant="h6" color="white">
                Sales Report Table
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    {["Date", "Sales", "Department"].map((head) => (
                      <th key={head} className="px-4 py-2 text-left text-sm font-semibold text-blue-gray-500">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">${row.sales}</td>
                      <td className="px-4 py-2">{row.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {reportData.length > 0 && (
  <div className="mt-4 text-right pr-4">
    <Typography variant="h6" className="text-green-700">
      Total Revenue: ${totalRevenue.toLocaleString()}
    </Typography>
  </div>
)}

            </CardBody>
          </Card>
          
        </>
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, defaultLabel }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
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

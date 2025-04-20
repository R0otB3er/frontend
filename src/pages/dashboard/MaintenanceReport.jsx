import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
  Spinner,
} from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import MaintenanceCostChartConfig from "@/widgets/charts/maintenance-cost-chart";
import MaintenanceDurationChartConfig from "@/widgets/charts/maintenance-duration-chart";

export function MaintenanceReport() {
  const [formData, setFormData] = useState({
    departmentID: "",
    startDate: "",
    endDate: "",
    includeVendor: false,
    includeAttraction: false,
    includeHabitat: false,
    vendorID: "",
    attractionID: "",
    habitatID: "",
    workerID: "",
  });

  const [dropdownData, setDropdownData] = useState({
    departments: [],
    vendors: [],
    attractions: [],
    habitats: [],
    workers: [],
  });

  const [totalCost, setTotalCost] = useState(0);
  const [costData, setCostData] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) <= new Date(formData.endDate);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/maintenance/form-info`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setDropdownData({
          departments: data.departments || [],
          vendors: data.vendors || [],
          attractions: data.attractions || [],
          habitats: data.habitats || [],
          workers: data.workers || [],
        });
      } catch (err) {
        console.error("Error fetching dropdown data:", err);
      }
    }

    fetchDropdownData();
  }, []);

  const handleChange = (e, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return alert("Please enter a valid date range.");
  
    setIsLoading(true);
    setShowCharts(false);
  
    // ✅ Only include fields that matter
    const payload = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      includeVendor: formData.includeVendor,
      includeAttraction: formData.includeAttraction,
      includeHabitat: formData.includeHabitat,
      vendorID: formData.includeVendor ? formData.vendorID : null,
      attractionID: formData.includeAttraction ? formData.attractionID : null,
      habitatID: formData.includeHabitat ? formData.habitatID : null,
      workerID: formData.workerID || null,
      departmentID: formData.departmentID || null, // ✅ Always send null if unselected
    };
  
    console.log("📤 Payload:", payload);
  
    fetch(`${import.meta.env.VITE_API_URL}/api/maintenance/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch maintenance report.");
        return res.json();
      })
      .then((result) => {
        console.log("✅ Report Data Received:", result);
        const { costData, durationData } = result;
  
        setCostData(Array.isArray(costData) ? costData : []);
        setDurationData(Array.isArray(durationData) ? durationData : []);
  
        const total = (costData || []).reduce((acc, row) => acc + parseFloat(row.cost || 0), 0);
        setTotalCost(total);
        setShowCharts(true);
      })
      .catch((error) => {
        console.error("❌ Error in fetch:", error);
        alert("Could not load report. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  const costChartConfig = MaintenanceCostChartConfig.getConfig({
    data: costData,
    type: "line",
  });

  const durationChartConfig = MaintenanceDurationChartConfig.getConfig({
    data: durationData,
    type: "bar",
  });

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Maintenance Report
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.departmentID}
                  onChange={(e) => handleChange(e, "departmentID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                >
                  <option value="">All Departments</option>
                  {dropdownData.departments.map((dept) => (
                    <option key={dept.Department_ID} value={dept.Department_ID}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Worker</label>
                <select
                  value={formData.workerID}
                  onChange={(e) => handleChange(e, "workerID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                >
                  <option value="">All Workers</option>
                  {dropdownData.workers.map((worker) => (
                    <option key={worker.Employee_ID} value={worker.Employee_ID}>
                      {worker.first_name} {worker.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Checkbox
                    label="Include Vendor"
                    checked={formData.includeVendor}
                    onChange={(e) => handleChange(e, "includeVendor")}
                  />
                  <select
                    disabled={!formData.includeVendor}
                    value={formData.vendorID}
                    onChange={(e) => handleChange(e, "vendorID")}
                    className="mt-2 border px-3 py-2 w-full rounded-md shadow-sm"
                  >
                    <option value="">Select Vendor</option>
                    {dropdownData.vendors.map((v) => (
                      <option key={v.Vendor_ID} value={v.Vendor_ID}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Checkbox
                    label="Include Attraction"
                    checked={formData.includeAttraction}
                    onChange={(e) => handleChange(e, "includeAttraction")}
                  />
                  <select
                    disabled={!formData.includeAttraction}
                    value={formData.attractionID}
                    onChange={(e) => handleChange(e, "attractionID")}
                    className="mt-2 border px-3 py-2 w-full rounded-md shadow-sm"
                  >
                    <option value="">Select Attraction</option>
                    {dropdownData.attractions.map((a) => (
                      <option key={a.Attraction_ID} value={a.Attraction_ID}>
                        {a.Attraction_Name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Checkbox
                    label="Include Habitat"
                    checked={formData.includeHabitat}
                    onChange={(e) => handleChange(e, "includeHabitat")}
                  />
                  <select
                    disabled={!formData.includeHabitat}
                    value={formData.habitatID}
                    onChange={(e) => handleChange(e, "habitatID")}
                    className="mt-2 border px-3 py-2 w-full rounded-md shadow-sm"
                  >
                    <option value="">Select Habitat</option>
                    {dropdownData.habitats.map((h) => (
                      <option key={h.Habitat_ID} value={h.Habitat_ID}>
                        {h.Habitat_Name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange(e, "startDate")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange(e, "endDate")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>
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

      {isLoading && <Spinner className="mt-8 h-10 w-10 text-gray-700" />}

      {showCharts && !isLoading && (
        <>
          <div className="flex flex-col md:flex-row gap-6 w-full max-w-6xl mt-10">
            <div className="w-full md:w-1/2">
              <StatisticsChart
                color="white"
                chart={costChartConfig}
                title="Maintenance Cost Over Time"
                description="Track maintenance spending by date"
              />
            </div>
            <div className="w-full md:w-1/2">
              <StatisticsChart
                color="white"
                chart={durationChartConfig}
                title="Maintenance Duration by Category"
                description="How long tasks took by type"
              />
            </div>
          </div>

          <Card className="mt-6 w-full max-w-6xl">
            <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
              <Typography variant="h6" color="white">
                Maintenance Cost Breakdown
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Start Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">End Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody>
  {costData.length === 0 ? (
    <tr>
      <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
        No report data found for the selected filters.
      </td>
    </tr>
  ) : (
    <>
      {costData.map((row, idx) => (
        <tr key={idx} className="border-t">
          <td className="px-4 py-2">{new Date(row.Start_Date).toLocaleDateString()}</td>
          <td className="px-4 py-2">{new Date(row.End_Date).toLocaleDateString()}</td>
          <td className="px-4 py-2">{row.Location || "N/A"}</td>
          <td className="px-4 py-2">${parseFloat(row.cost).toFixed(2)}</td>
        </tr>
      ))}
      <tr className="border-t font-semibold">
        <td className="px-4 py-2"></td>
        <td className="px-4 py-2"></td>
        <td className="px-4 py-2 text-right">Total Cost:</td>
        <td className="px-4 py-2">${totalCost.toFixed(2)}</td>
      </tr>
    </>
  )}
</tbody>
              </table>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

export default MaintenanceReport;


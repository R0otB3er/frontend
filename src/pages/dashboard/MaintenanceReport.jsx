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

  const [costData, setCostData] = useState([]);
  const [durationData, setDurationData] = useState([]);
  const [showCharts, setShowCharts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isFormValid =
    formData.startDate &&
    formData.endDate &&
    new Date(formData.startDate) <= new Date(formData.endDate);

  useEffect(() => {
    // Simulate dropdown data
    setDropdownData({
      departments: ["General Zoo", "Aquatics", "Safari", "Reptiles"],
      vendors: ["Vendor A", "Vendor B"],
      attractions: ["Roller Coaster", "Petting Zoo"],
      habitats: ["Savannah", "Rainforest"],
      workers: ["John Doe", "Jane Smith", "Alex Kim"],
    });
  }, []);

  const handleChange = (e, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Please enter a valid date range.");
      return;
    }

    setIsLoading(true);
    setShowCharts(false);

    // Simulated fetch based on criteria
    setTimeout(() => {
      const dummyFilteredCost = [
        { date: formData.startDate, cost: 1000 },
        { date: formData.endDate, cost: 1300 },
      ];

      const dummyFilteredDuration = [
        formData.includeAttraction && { category: "Attractions", duration: 6 },
        formData.includeVendor && { category: "Vendors", duration: 4 },
        formData.includeHabitat && { category: "Habitats", duration: 8 },
      ].filter(Boolean); // Remove false entries

      setCostData(dummyFilteredCost);
      setDurationData(dummyFilteredDuration);
      setIsLoading(false);
      setShowCharts(true);
    }, 1000); // simulate network delay
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
      {/* Form Card */}
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
                  <option value="">General Zoo</option>
                  {dropdownData.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
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
                  <option value="">Select Worker</option>
                  {dropdownData.workers.map((worker) => (
                    <option key={worker} value={worker}>
                      {worker}
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkbox Section */}
              <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Vendor */}
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
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attraction */}
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
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Habitat */}
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
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Range */}
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

      {/* Loading Spinner */}
      {isLoading && <Spinner className="mt-8 h-10 w-10 text-gray-700" />}

      {/* Charts & Table */}
      {showCharts && !isLoading && (
        <>
         {showCharts && !isLoading && (
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
)}

          

          {/* Table of Chart Data */}
          <Card className="mt-6 w-full max-w-4xl">
            <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
              <Typography variant="h6" color="white">
                Maintenance Cost Breakdown
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {costData.map((row, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-4 py-2">{row.date}</td>
                      <td className="px-4 py-2">${row.cost}</td>
                    </tr>
                  ))}
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

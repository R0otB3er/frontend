import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import {
  PersonTypeSalesBarChart,
  TotalSalesOverTimeChart,
  MembershipSalesBarChart,
} from "@/widgets/charts/ticket-sales-charts";
import { StatisticsChart } from "@/widgets/charts";

export function TicketSalesSearch() {
  const [formData, setFormData] = useState({
    Department: "",
    Attraction: "",
    Person_Type: "",
    Membership_type: "",
    start_date: "",
    end_date: "",
    IsGeneral: false,
  });

  const [dropdownData, setDropdownData] = useState({
    departments: [],
    attractions: [],
    personTypes: [],
    membershipStatuses: [],
  });

  const [ticketResults, setTicketResults] = useState({
    GeneralSales: [],
    DeptSales: [],
    PTypeSales: [],
    AllSales: [],
    MemTypeSales: [], 
  });

  const isFormValid = formData.start_date && formData.end_date && (formData.start_date < formData.end_date);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getTicketReportFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setDropdownData(data);
      })
      .catch((err) => console.error("Error fetching ticket report form info:", err));
  }, []);

  const handleChange = (e, field) => {
    let value;
    switch (e.target.type) {
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'date':
        value = e.target.value;
        break;
      default:
        value = e.target.value;
    }

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "IsGeneral" && value === true) {
        updated.Department = "";
        updated.Attraction = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return alert("Please complete all fields.");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getTicketReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        setTicketResults({
          DeptSales: Array.isArray(result.DeptSales) ? result.DeptSales : [],
          PTypeSales: Array.isArray(result.PTypeSales) ? result.PTypeSales : [],
          GeneralSales: Array.isArray(result.GeneralSales) ? result.GeneralSales : [],
          AllSales: Array.isArray(result.AllSales) ? result.AllSales : [],
        });
      } else {
        alert("Failed to generate ticket report.");
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Ticket Sales Report
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Checkbox
                  label="General Admissions only"
                  checked={formData.IsGeneral}
                  onChange={(e) => handleChange(e, "IsGeneral")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.Department}
                  onChange={(e) => handleChange(e, "Department")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  disabled={formData.IsGeneral}
                >
                  <option value="">Select Department</option>
                  {dropdownData.departments.map((dept) => (
                    <option key={dept.Department_ID} value={dept.Department_ID}>
                      {dept.department_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Attraction</label>
                <select
                  value={formData.Attraction}
                  onChange={(e) => handleChange(e, "Attraction")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  disabled={formData.IsGeneral || !formData.Department}
                >
                  <option value="">Select Attraction</option>
                  {dropdownData.attractions
                    .filter(attr => attr.Dept_ID == formData.Department)
                    .map((attr) => (
                      <option key={attr.Attraction_ID} value={attr.Attraction_ID}>
                        {attr.Attraction_Name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Person Type</label>
                <select
                  value={formData.Person_Type}
                  onChange={(e) => handleChange(e, "Person_Type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select Type</option>
                  {dropdownData.personTypes.map((type) => (
                    <option key={type.PersonType_ID} value={type.PersonType_ID}>
                      {type.ticket_person}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Membership</label>
                <select
                  value={formData.Membership_type}
                  onChange={(e) => handleChange(e, "Membership_type")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select Status</option>
                  {dropdownData.membershipStatuses.map((m) => (
                    <option key={m.membership_TypeID} value={m.membership_TypeID}>
                      {m.membership_Type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange(e, "start_date")}
                    className="border px-3 py-2 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange(e, "end_date")}
                    className="border px-3 py-2 rounded-md shadow-sm"
                  />
                </div>
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

      {(ticketResults.PTypeSales?.length > 0 || ticketResults.AllSales?.length > 0) ? (
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {ticketResults.PTypeSales.length > 0 && (
         <StatisticsChart
         color="white"
         chart={PersonTypeSalesBarChart(ticketResults.PTypeSales || [])}
         title="Ticket Sales by Person Type"
         description="Adult, Child, Senior breakdown"
       />
       
        
          )}

          {ticketResults.AllSales.length > 0 && (
           <StatisticsChart
  color="white"
  chart={TotalSalesOverTimeChart(ticketResults.AllSales || [])}
  title="Ticket Sales Over Time"
  description="Total tickets sold each day"
/>

          )}

{ticketResults.MemTypeSales?.length > 0 && (
  <StatisticsChart
    color="white"
    chart={MembershipSalesBarChart(ticketResults.MemTypeSales || [])}
    title="Sales by Membership Type"
    description="Bronze, Silver, Gold membership ticket sales"
  />
)}

        </div>
      ) : (
        <Typography className="text-gray-500 text-center mt-10">
          No chart data found for this filter.
        </Typography>
      )}

      <Card className="mt-6 w-full max-w-4xl">
        <CardHeader variant="gradient" color="gray" className="mb-4 p-4">
          <Typography variant="h6" color="white">
            Ticket Sales Report
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                {[
                  "Attraction",
                  "Department",
                  "Person Type",
                  "Membership",
                  "Date",
                  "Tickets Sold",
                ].map((head) => (
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
            {ticketResults.AllSales?.length > 0 ? (
  ticketResults.AllSales.map((row, index) => (
    <tr key={index} className="border-t">
      <td className="px-4 py-2">{row.Attraction_Name || "N/A"}</td>
      <td className="px-4 py-2">{row.department_name || "N/A"}</td>
      <td className="px-4 py-2">{row.ticket_person || "N/A"}</td>
      <td className="px-4 py-2">{row.membership_type || "N/A"}</td>
      <td className="px-4 py-2">
  {new Date(row.sale_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
</td>

      <td className="px-4 py-2">{row.tickets_sold}</td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="6" className="text-center py-4 text-gray-500">
      No ticket sales found.
    </td>
  </tr>
)}

            </tbody>
          </table>

          {ticketResults.AllSales?.length > 0 && (
            <div className="mt-4 text-right pr-4">
              <Typography variant="h6" className="text-green-700">
                Total Revenue: $
                {ticketResults.AllSales
                  .reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Typography>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default TicketSalesSearch;


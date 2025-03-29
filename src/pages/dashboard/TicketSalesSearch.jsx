import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Checkbox,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function TicketSalesSearch() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    attraction: "",
    personType: "",
    membershipStatus: "",
    startDate: "",
    endDate: "",
    allAttractions: false,
  });

  const [ticketResults, setTicketResults] = useState([]);

  const departments = ["Customer Service", "Sales", "Marketing"];
  const attractions = {
    "Customer Service": ["Zoo Map Station", "Lost & Found"],
    Sales: ["Main Entrance", "VIP Booth"],
    Marketing: ["Photo Booth", "Interactive Display"],
  };

  const personTypes = ["Adult", "Veteran", "Student", "Children", "Seniors"];
  const membershipStatuses = ["None", "Bronze", "Silver", "Gold"];

  const dummyData = [
    {
      attraction: "Main Entrance",
      department: "Sales",
      personType: "Adult",
      membership: "Gold",
      date: "2025-03-25",
      ticketsSold: 120,
    },
    {
      attraction: "Photo Booth",
      department: "Marketing",
      personType: "Student",
      membership: "Silver",
      date: "2025-03-26",
      ticketsSold: 35,
    },
    {
      attraction: "Zoo Map Station",
      department: "Customer Service",
      personType: "Senior",
      membership: "None",
      date: "2025-03-26",
      ticketsSold: 12,
    },
  ];

  const handleChange = (e, field) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "allAttractions" && value === true) {
        updated.department = "";
        updated.attraction = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = dummyData.filter((row) => {
      const matchDepartment =
        formData.allAttractions || !formData.department || row.department === formData.department;

      const matchAttraction =
        formData.allAttractions || !formData.attraction || row.attraction === formData.attraction;

      const matchPersonType =
        !formData.personType || row.personType === formData.personType;

      const matchMembership =
        !formData.membershipStatus || row.membership === formData.membershipStatus;

      const matchStartDate =
        !formData.startDate || new Date(row.date) >= new Date(formData.startDate);

      const matchEndDate =
        !formData.endDate || new Date(row.date) <= new Date(formData.endDate);

      return (
        matchDepartment &&
        matchAttraction &&
        matchPersonType &&
        matchMembership &&
        matchStartDate &&
        matchEndDate
      );
    });

    setTicketResults(filtered);
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Ticket Sales Search
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Checkbox
                  label="Search All Attractions"
                  checked={formData.allAttractions}
                  onChange={(e) => handleChange(e, "allAttractions")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => handleChange(e, "department")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  disabled={formData.allAttractions}
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Attraction</label>
                <select
                  value={formData.attraction}
                  onChange={(e) => handleChange(e, "attraction")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  disabled={formData.allAttractions || !formData.department}
                >
                  <option value="">Select Attraction</option>
                  {(attractions[formData.department] || []).map((attr) => (
                    <option key={attr} value={attr}>{attr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Person Type</label>
                <select
                  value={formData.personType}
                  onChange={(e) => handleChange(e, "personType")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select Type</option>
                  {personTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Membership</label>
                <select
                  value={formData.membershipStatus}
                  onChange={(e) => handleChange(e, "membershipStatus")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Select Status</option>
                  {membershipStatuses.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange(e, "startDate")}
                    className="border px-3 py-2 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange(e, "endDate")}
                    className="border px-3 py-2 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Table of results */}
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
                {["Attraction", "Department", "Person Type", "Membership", "Date", "Tickets Sold"].map((head) => (
                  <th key={head} className="px-4 py-2 text-left text-sm font-semibold text-blue-gray-500">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ticketResults.length > 0 ? (
                ticketResults.map((row, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2">{row.attraction}</td>
                    <td className="px-4 py-2">{row.department}</td>
                    <td className="px-4 py-2">{row.personType}</td>
                    <td className="px-4 py-2">{row.membership}</td>
                    <td className="px-4 py-2">{row.date}</td>
                    <td className="px-4 py-2">{row.ticketsSold}</td>
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
        </CardBody>
      </Card>
    </div>
  );
}

export default TicketSalesSearch;


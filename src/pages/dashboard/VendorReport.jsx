import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function VendorReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Department_ID: "",
    Vendor_ID: "",
    item_typeID: "",
    Merchandise_ID: "",
    Start_Date: "",
    End_Date: "",
  });

  const [dropdownData, setDropdownData] = useState({
    Departments: [],
    Vendors: [],
    Item_types: [],
    Merchandise: [],
  });

  const [ReportData, setReportData] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  const isFormValid = formData.Start_Date && formData.End_Date && (formData.Start_Date < formData.End_Date);

  useEffect(() => {
  
    fetch(`${import.meta.env.VITE_API_URL}/api/getVendMerchReportFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Query Form Info Response Data:", data); //  Log the backend response
        setDropdownData(data);
      })
      .catch((err) => console.error("Error fetching feeding form info:", err));
  }, []);
  

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    updateDate(e.target.value);
  };

  const updateDate = (date) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date,
      }));
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return alert("Please Input a valid start and end date.");
    
        const payload = {
            Department_ID: formData.Department_ID,
            Vendor_ID: formData.Vendor_ID,
            item_typeID: formData.item_typeID,
            Merchandise_ID: formData.Merchandise_ID,
            Start_Date: formData.Start_Date,
            End_Date: formData.End_Date,
        };
    
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/QueryFeedingLogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
    
            if (res.ok) {
                setReportData([]);
                const result = await res.json();
                console.log(result);
                setReportData(Array.isArray(result) ? result : []);
            } else {
                console.error(result.error);
                alert("Failed to submit feeding log.");
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
            Vendor Report Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Departments</label>
                <select
                  value={formData.Department_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">All Departments</option>
                  {dropdownData.Departments.map((department) => (
                    <option key={department.Department_ID} value={department.Department_ID}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">All Vendors</label>
                <select
                  value={formData.Vendor_ID}
                  onChange={(e) => handleChange(e, "Vendor_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Vendors</option>
                  {dropdownData.Vendors.map((vendors) => (
                    <option key={vendors.Vendor_ID} value={vendors.Vendor_ID}>
                      {vendors.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Merchandise Types</label>
                <select
                  value={formData.item_typeID}
                  onChange={(e) => handleChange(e, "item_typeID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">All types</option>
                  {dropdownData.Item_types.map((types) => (
                    <option key={types.item_typeID} value={types.item_typeID}>
                      {types.item_types}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Specific Merchandise</label>
                <select
                  value={formData.Merchandise_ID}
                  onChange={(e) => handleChange(e, "Merchandise_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="">Employee</option>
                  {dropdownData.Merchandise.map((merchandise) => (
                    <option key={merchandise.Merchandise_ID} value={merchandise.Merchandise_ID}>
                      {merchandise.Item_Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={formData.Start_Date}
                    onChange={(e) => handleChange(e, "Start_Date")}
                    className="border px-3 py-2 w-full rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={formData.End_Date}
                    onChange={(e) => handleChange(e, "End_Date")}
                    className="border px-3 py-2 w-full rounded-md shadow-sm"
                  />
                </div>
              </div>

            </div>

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`} 
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Feeding Log Query
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Animal name", "Species", "Caretaker name", "Food type", "Quantity", "feeding date", "feeding time"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
 
            {feedingLogs.length > 0 ? (
              feedingLogs.map(({ Animal_Name,
                Name, 
                first_name, 
                last_name, 
                food_Types, 
                Quantity,
                Feeding_Date,
                Feeding_Time,
                Unit_text}, index) => {
                const className = `py-3 px-5 ${index === feedingLogs.length - 1 ? "" : "border-b border-blue-gray-50"}`;

                return (
                  <tr key={index}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <div>
                          <Typography variant="small" className="font-semibold text-blue-gray-600">
                            {Animal_Name}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Name}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{`${first_name} ${last_name}`}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{food_Types}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{`${Quantity} ${Unit_text}`}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Feeding_Date.split('T')[0]}</Typography>
                    </td>
                    <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Feeding_Time}</Typography>
                    </td>
                   
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No feeding logs found
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

export default VendorReport;
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { MaintenanceQuery } from "@/data";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export function Maintenance_query() {
  const [authorsData, setAuthorsData] = useState(MaintenanceQuery);
  const [editingRow, setEditingRow] = useState(null);
  const [errors, setErrors] = useState({});
  const [newRow, setNewRow] = useState(null);
  const [newErrors, setNewErrors] = useState({});

  const handleEditClick = (index) => {
    setEditingRow(index);
  };

  const handleSaveClick = () => {
    if (!Object.values(errors[editingRow] || {}).some((err) => err)) {
      setEditingRow(null);
    }
  };


  const handleDeleteClick = (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this row?");
    if (confirmDelete) {
      setAuthorsData((prevData) => prevData.filter((_, i) => i !== index));
      setEditingRow(null);
    }
  };

  const handleChange = (event, index, field) => {
    const value = event.target.value;
    const updatedData = [...authorsData];
    let error = "";

    if (!value.trim()) {
      error = "This field cannot be empty.";
    } else if (field === "Start_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      error = "Date must be in MM/DD/YYYY format.";
    } else if (field === "End_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        error = "Date must be in MM/DD/YYYY format.";
      }
  

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [field]: error || null },
    }));

    updatedData[index][field] = value;
    setAuthorsData(updatedData);
  };



  const handleNewRowChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (!value.trim()) {
        error = "This field cannot be empty.";
      } else if (field === "Start_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        error = "Date must be in MM/DD/YYYY format.";
      }else if (field === "End_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        error = "Date must be in MM/DD/YYYY format.";
      }

    setNewErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setNewRow((prev) => ({ ...prev, [field]: value }));
  };

  const isNewRowValid = () => {
    if (!newRow) return false; // Prevents crashes
  
    // Check if any required field is empty (excluding image)
    const requiredFields = ["Maintenance_ID", "Attraction_Name", "Employee_ID", "Start_Date", "End_Date", "Description", "Status"];
    if (requiredFields.some(field => !newRow[field]?.trim())) return false;
  
    // Validate Feeding Time format
    if (!/\d{2}\/\d{2}\/\d{4}$/.test(newRow.Start_Date)) return false;
    if (!/\d{2}\/\d{2}\/\d{4}$/.test(newRow.End_Date)) return false;

    return true;
  };


  const handleAddNewRow = () => {
    setNewRow({
      Maintenance_ID: "",
      Attraction_Name: "",
      Employee_ID: "",
      Start_Date: "",
      End_Date: "",
      Description: "",
      Status: ""
    });
    setNewErrors({});
  };

  const handleSaveNewRow = () => {
    if (!newRow || Object.values(newErrors).some((err) => err)) {
      alert("All fields must be filled out correctly.");
      return;
    }

    setAuthorsData([newRow, ...authorsData]);
    setNewRow(null);
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      {/* Create New Button (Black) */}
      <button
        onClick={handleAddNewRow}
        className="mb-4 px-4 py-2 bg-black text-white rounded w-32"
      >
        + Create New
      </button>

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Maintenance Query
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Maintenance_ID", "Attraction_Name", "Employee_ID", "Start_Date", "End_Date", "Description", "Status", "Actions"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* New Entry Row */}
              {newRow && (
                <tr className="bg-white">
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">

                      <input
                        type="text"
                        value={newRow.Maintenance_ID}
                        onChange={(e) => handleNewRowChange(e, "Maintenance_ID")}
                        className="border px-2 py-1 text-xs"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Attraction_Name}
                      onChange={(e) => handleNewRowChange(e, "Attraction_Name")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Employee_ID}
                      onChange={(e) => handleNewRowChange(e, "Employee_ID")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Start_Date}
                      onChange={(e) => handleNewRowChange(e, "Start_Date")}
                      className="border px-2 py-1 text-xs"
                      placeholder="MM/DD/YYYY"
                    />
                    {newErrors.Start_Date && (
                      <Typography className="text-red-500 text-xs">{newErrors.Start_Date}</Typography>
                    )}
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.End_Date}
                      onChange={(e) => handleNewRowChange(e, "End_Date")}
                      className="border px-2 py-1 text-xs"
                      placeholder="MM/DD/YYYY"
                    />
                    {newErrors.End_Date && (
                      <Typography className="text-red-500 text-xs">{newErrors.End_Date}</Typography>
                    )}
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Description}
                      onChange={(e) => handleNewRowChange(e, "Description")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Status}
                      onChange={(e) => handleNewRowChange(e, "Status")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
  <button
    onClick={handleSaveNewRow}
    className={`text-xs font-semibold ${isNewRowValid() ? "text-green-600" : "text-gray-400 cursor-not-allowed"}`}
    disabled={!isNewRowValid()}
  >
    Save
  </button>
</td>

                </tr>
              )}


              {authorsData.map(({ Maintenance_ID, Attraction_Name, Employee_ID, Start_Date, End_Date, Description, Status }, index) => {
                const className = `py-3 px-5 ${index === authorsData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const hasErrors = errors[index] && Object.values(errors[index]).some((err) => err);

                return (
                  <tr key={index}>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Maintenance_ID}
                            onChange={(e) => handleChange(e, index, "Maintenance_ID")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Maintenance_ID && (
                            <Typography className="text-red-500 text-xs">{errors[index].Maintenance_ID}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Maintenance_ID}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Attraction_Name}
                            onChange={(e) => handleChange(e, index, "Attraction_Name")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Attraction_Name && (
                            <Typography className="text-red-500 text-xs">{errors[index].Attraction_Name}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Attraction_Name}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Employee_ID}
                            onChange={(e) => handleChange(e, index, "Employee_ID")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Employee_ID && (
                            <Typography className="text-red-500 text-xs">{errors[index].Employee_ID}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Employee_ID}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Start_Date}
                            onChange={(e) => handleChange(e, index, "Start_Date")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Start_Date && (
                            <Typography className="text-red-500 text-xs">{errors[index].Start_Date}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Start_Date}</Typography>
                      )}
                    </td>

                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={End_Date}
                            onChange={(e) => handleChange(e, index, "End_Date")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.End_Date && (
                            <Typography className="text-red-500 text-xs">{errors[index].End_Date}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{End_Date}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Description}
                            onChange={(e) => handleChange(e, index, "Description")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Description && (
                            <Typography className="text-red-500 text-xs">{errors[index].Description}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Description}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Status}
                            onChange={(e) => handleChange(e, index, "Status")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Status && (
                            <Typography className="text-red-500 text-xs">{errors[index].Status}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Status}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <div className="flex items-center gap-2">
                        {/* SAVE BUTTON */}
                        <button
                          onClick={handleSaveClick}
                          className={`text-xs font-semibold ${
                            hasErrors ? "text-gray-400 cursor-not-allowed" : "text-green-600"
                          }`}
                          disabled={hasErrors}
                        >
                          Save
                        </button>
                        
                        {/* TRASH BUTTON */}
                        <button
                          onClick={() => handleDeleteClick(index)}
                          className="text-xs text-black-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>           
                      ) : (
                        <button
                          onClick={() => handleEditClick(index)}
                          className="text-xs font-semibold text-blue-gray-600"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Maintenance_query;

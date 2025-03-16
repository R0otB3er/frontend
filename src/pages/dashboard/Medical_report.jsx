import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { MedicalReport } from "@/data";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export function Medical_report() {
  const [authorsData, setAuthorsData] = useState(MedicalReport);
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
    } else if (field === "Checkup_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
      } else if (field === "Checkup_Date" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
    const requiredFields = ["Record_ID", "Animal_ID", "Employee_ID", "Checkup_Date", "Diagnosis", "Treatment"];
    if (requiredFields.some(field => !newRow[field]?.trim())) return false;
  
    // Validate Feeding Time format
    if (!/\d{2}\/\d{2}\/\d{4}$/.test(newRow.Checkup_Date)) return false;


    return true;
  };


  const handleAddNewRow = () => {
    setNewRow({
      Record_ID: "",
      Animal_ID: "",
      Employee_ID: "",
      Checkup_Date: "",
      Diagnosis: "",
      Treatment: ""
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
            Medical Report
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Record_ID", "Animal_ID", "Employee_ID", "Checkup_Date", "Diagnosis", "Treatment", "Actions"].map((el) => (
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
                        value={newRow.Record_ID}
                        onChange={(e) => handleNewRowChange(e, "Record_ID")}
                        className="border px-2 py-1 text-xs"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Animal_ID}
                      onChange={(e) => handleNewRowChange(e, "Animal_ID")}
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
                      value={newRow.Checkup_Date}
                      onChange={(e) => handleNewRowChange(e, "Checkup_Date")}
                      className="border px-2 py-1 text-xs"
                      placeholder="MM/DD/YYYY"
                    />
                    {newErrors.Checkup_Date && (
                      <Typography className="text-red-500 text-xs">{newErrors.Checkup_Date}</Typography>
                    )}
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Diagnosis}
                      onChange={(e) => handleNewRowChange(e, "Diagnosis")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Treatment}
                      onChange={(e) => handleNewRowChange(e, "Treatment")}
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


              {authorsData.map(({ Record_ID, Animal_ID, Employee_ID, Checkup_Date, Diagnosis, Treatment }, index) => {
                const className = `py-3 px-5 ${index === authorsData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const hasErrors = errors[index] && Object.values(errors[index]).some((err) => err);

                return (
                  <tr key={index}>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Record_ID}
                            onChange={(e) => handleChange(e, index, "Record_ID")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Record_ID && (
                            <Typography className="text-red-500 text-xs">{errors[index].Record_ID}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Record_ID}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Animal_ID}
                            onChange={(e) => handleChange(e, index, "Animal_ID")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Animal_ID && (
                            <Typography className="text-red-500 text-xs">{errors[index].Animal_ID}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Animal_ID}</Typography>
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
                            value={Checkup_Date}
                            onChange={(e) => handleChange(e, index, "Checkup_Date")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Checkup_Date && (
                            <Typography className="text-red-500 text-xs">{errors[index].Checkup_Date}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Checkup_Date}</Typography>
                      )}
                    </td>

                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Diagnosis}
                            onChange={(e) => handleChange(e, index, "Diagnosis")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Diagnosis && (
                            <Typography className="text-red-500 text-xs">{errors[index].Diagnosis}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Diagnosis}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Treatment}
                            onChange={(e) => handleChange(e, index, "Treatment")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Treatment && (
                            <Typography className="text-red-500 text-xs">{errors[index].Treatment}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Treatment}</Typography>
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

export default Medical_report;

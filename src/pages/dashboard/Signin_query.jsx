import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { SignInQuery } from "@/data";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export function Signin_query() {
  const [authorsData, setAuthorsData] = useState(SignInQuery);
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
    } else if (field === "Date_accessed" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
      } else if (field === "Date_accessed" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
    const requiredFields = ["Name", "Role", "Email"];
    if (requiredFields.some(field => !newRow[field]?.trim())) return false;
  
    if (!/\d{2}\/\d{2}\/\d{4}$/.test(newRow.Date_accessed)) return false;


    return true;
  };


  const handleAddNewRow = () => {
    setNewRow({
      Name: "",
      Role: "",
      Email: "",
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

      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Sign In Query
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">

          <thead>
              <tr>
                {["Name", "Role", "Email"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>


              {authorsData.map(({ Name, Role, Email}, index) => {
                const className = `py-3 px-5 ${index === authorsData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const hasErrors = errors[index] && Object.values(errors[index]).some((err) => err);

                return (
                  <tr key={index}>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Name}
                            onChange={(e) => handleChange(e, index, "Name")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Name && (
                            <Typography className="text-red-500 text-xs">{errors[index].Name}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Name}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Role}
                            onChange={(e) => handleChange(e, index, "Role")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Role && (
                            <Typography className="text-red-500 text-xs">{errors[index].Role}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Role}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Email}
                            onChange={(e) => handleChange(e, index, "Email")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Email && (
                            <Typography className="text-red-500 text-xs">{errors[index].Email}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Email}</Typography>
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

export default Signin_query;

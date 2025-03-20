import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { FeedingLogQuery } from "@/data";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export function Adfeedinglog_query() {
  const [authorsData, setAuthorsData] = useState(FeedingLogQuery);
  const [editingRow, setEditingRow] = useState(null);
  const [errors, setErrors] = useState({});

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
    } else if (field === "date" && !/^\d{2}:\d{2} (AM|PM), \d{2}\/\d{2}\/\d{4}$/.test(value)) {
      error = "Date must be in HH:MM AM/PM, MM/DD/YYYY format.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [index]: { ...prevErrors[index], [field]: error || null },
    }));

    updatedData[index][field] = value;
    setAuthorsData(updatedData);
  };

  const handleFileChange = (event) => {
    if (newRow) {
      setNewRow({ 
        ...newRow, 
        img: URL.createObjectURL(event.target.files[0]), 
        imageUploaded: true // NEW FLAG SET TO TRUE AFTER UPLOAD
      });
    }
  };

  

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">

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
                {["Animal_ID", "Employee_ID", "Food Type", "Feeding Time", "Quantity", "Actions"].map((el) => (
                  <th key={el} className="border-b border-blue-gray-50 py-3 px-5 text-left">
                    <Typography variant="small" className="text-[11px] font-bold uppercase text-blue-gray-400">
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
 


              {authorsData.map(({ img, Animal_ID, Employee_ID, Food_Type, date, quantity }, index) => {
                const className = `py-3 px-5 ${index === authorsData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const hasErrors = errors[index] && Object.values(errors[index]).some((err) => err);

                return (
                  <tr key={index}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar src={img} alt={Animal_ID} size="sm" variant="rounded" />
                        <div>
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
                            <Typography variant="small" className="font-semibold text-blue-gray-600">
                              {Animal_ID}
                            </Typography>
                          )}
                        </div>
                      </div>
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
                            value={Food_Type}
                            onChange={(e) => handleChange(e, index, "Food_Type")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Food_Type && (
                            <Typography className="text-red-500 text-xs">{errors[index].Food_Type}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Food_Type}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={date}
                            onChange={(e) => handleChange(e, index, "date")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.date && (
                            <Typography className="text-red-500 text-xs">{errors[index].date}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{date}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={quantity}
                            onChange={(e) => handleChange(e, index, "quantity")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.quantity && (
                            <Typography className="text-red-500 text-xs">{errors[index].quantity}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{quantity}</Typography>
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

export default Adfeedinglog_query;

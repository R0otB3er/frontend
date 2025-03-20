import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
} from "@material-tailwind/react";
import { BulkPurchaseQuery } from "@/data";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";

export function Adbulkpurchase_query() {
  const [authorsData, setAuthorsData] = useState(BulkPurchaseQuery);
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
    } else if (field === "Date_purchased" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
      } else if (field === "Date_purchased" && !/\d{2}\/\d{2}\/\d{4}$/.test(value)) {
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
    const requiredFields = ["Merchant_Name", "Item_name", "Bulk_cost", "Amount_of_items", "Date_purchased", "Producer"];
    if (requiredFields.some(field => !newRow[field]?.trim())) return false;
  
    // Validate Feeding Time format
    if (!/\d{2}\/\d{2}\/\d{4}$/.test(newRow.Date_purchased)) return false;


    return true;
  };


  const handleAddNewRow = () => {
    setNewRow({
      Merchant_Name: "",
      Item_name: "",
      Bulk_cost: "",
      Amount_of_items: "",
      Date_purchased: "",
      Producer: ""
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
            Bulk Purchase Query
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Merchant_Name", "Item_name", "Bulk_cost", "Amount_of_items", "Date_purchased", "Producer", "Actions"].map((el) => (
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
                        value={newRow.Merchant_Name}
                        onChange={(e) => handleNewRowChange(e, "Merchant_Name")}
                        className="border px-2 py-1 text-xs"
                      />
                    </div>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Item_name}
                      onChange={(e) => handleNewRowChange(e, "Item_name")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Bulk_cost}
                      onChange={(e) => handleNewRowChange(e, "Bulk_cost")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Amount_of_items}
                      onChange={(e) => handleNewRowChange(e, "Amount_of_items")}
                      className="border px-2 py-1 text-xs"
                    />
                  </td>

                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Date_purchased}
                      onChange={(e) => handleNewRowChange(e, "Date_purchased")}
                      className="border px-2 py-1 text-xs"
                      placeholder="MM/DD/YYYY"
                    />
                    {newErrors.Date_purchased && (
                      <Typography className="text-red-500 text-xs">{newErrors.Date_purchased}</Typography>
                    )}
                  </td>


                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <input
                      type="text"
                      value={newRow.Producer}
                      onChange={(e) => handleNewRowChange(e, "Producer")}
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


              {authorsData.map(({ Merchant_Name, Item_name, Bulk_cost, Amount_of_items, Date_purchased, Producer}, index) => {
                const className = `py-3 px-5 ${index === authorsData.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                const hasErrors = errors[index] && Object.values(errors[index]).some((err) => err);

                return (
                  <tr key={index}>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Merchant_Name}
                            onChange={(e) => handleChange(e, index, "Mechant_ID")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Merchant_Name && (
                            <Typography className="text-red-500 text-xs">{errors[index].Merchant_Name}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Merchant_Name}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Item_name}
                            onChange={(e) => handleChange(e, index, "Item_name")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Item_name && (
                            <Typography className="text-red-500 text-xs">{errors[index].Item_name}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Item_name}</Typography>
                      )}
                    </td>
                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Bulk_cost}
                            onChange={(e) => handleChange(e, index, "Bulk_cost")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Bulk_cost && (
                            <Typography className="text-red-500 text-xs">{errors[index].Bulk_cost}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Bulk_cost}</Typography>
                      )}
                    </td>

                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Amount_of_items}
                            onChange={(e) => handleChange(e, index, "Amount_of_items")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Amount_of_items && (
                            <Typography className="text-red-500 text-xs">{errors[index].Amount_of_items}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Amount_of_items}</Typography>
                      )}
                    </td>

                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Date_purchased}
                            onChange={(e) => handleChange(e, index, "Date_purchased")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Date_purchased && (
                            <Typography className="text-red-500 text-xs">{errors[index].Date_purchased}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Date_purchased}</Typography>
                      )}
                    </td>


                    <td className={className}>
                      {editingRow === index ? (
                        <>
                          <input
                            type="text"
                            value={Producer}
                            onChange={(e) => handleChange(e, index, "Producer")}
                            className="border px-2 py-1 text-xs"
                          />
                          {errors[index]?.Producer && (
                            <Typography className="text-red-500 text-xs">{errors[index].Producer}</Typography>
                          )}
                        </>
                      ) : (
                        <Typography className="text-xs font-semibold text-blue-gray-600">{Producer}</Typography>
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

export default Adbulkpurchase_query;

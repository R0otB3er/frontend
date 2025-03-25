import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueMaintenanceValues } from "@/data"; // ✅ Import function

export function MtMaintenanceEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Attraction_Name: "",
    Description: "",
    Status: "",
    Start_Date: "",
    End_Date: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    attractionNames: [],
    descriptions: [],
  });

  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndDate, setSelectedEndDate] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  useEffect(() => {
    const { uniqueAttractionNames, uniqueDescriptions } = getUniqueMaintenanceValues();
    setDropdownValues({
      attractionNames: uniqueAttractionNames,
      descriptions: uniqueDescriptions,
    });
  }, []);

  const handleChange = (event, field) => {
    const value = event.target.value;
    let error = "";

    if (!value.trim()) {
      error = "This field cannot be empty.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: error || null,
    }));

    setFormData((prev) => ({ ...prev, [field]: value }));

  };

  // Date and Time Handlers
  const handleStartDateChange = (event) => {
    setSelectedStartDate(event.target.value);
    updateMaintenanceDates(event.target.value, selectedStartTime, selectedEndDate, selectedEndTime);
  };

  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
    updateMaintenanceDates(selectedStartDate, event.target.value, selectedEndDate, selectedEndTime);
  };

  const handleEndDateChange = (event) => {
    setSelectedEndDate(event.target.value);
    updateMaintenanceDates(selectedStartDate, selectedStartTime, event.target.value, selectedEndTime);
  };

  const handleEndTimeChange = (event) => {
    setSelectedEndTime(event.target.value);
    updateMaintenanceDates(selectedStartDate, selectedStartTime, selectedEndDate, event.target.value);
  };

  // Update Maintenance Time
  const updateMaintenanceDates = (startDate, startTime, endDate, endTime) => {
    if (startDate && startTime) {
      const formattedStartTime = formatTimeTo12Hour(startTime);
      const formattedStartDate = formatDateToMMDDYYYY(startDate);
      const fullStart = `${formattedStartTime}, ${formattedStartDate}`;

      setFormData((prev) => ({ ...prev, Start_Date: fullStart }));
    }

    if (endDate && endTime) {
      const formattedEndTime = formatTimeTo12Hour(endTime);
      const formattedEndDate = formatDateToMMDDYYYY(endDate);
      const fullEnd = `${formattedEndTime}, ${formattedEndDate}`;

      setFormData((prev) => ({ ...prev, End_Date: fullEnd }));
    }

    // Validate End Date & Time
    if (startDate && startTime && endDate && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      if (endDateTime < startDateTime) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          End_Date: "End date & time must be after the start date & time.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          End_Date: null,
        }));
      }
    }
  };

  // Time and Date Formatting
  const formatTimeTo12Hour = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    let hourInt = parseInt(hour, 10);
    const ampm = hourInt >= 12 ? "PM" : "AM";
    hourInt = hourInt % 12 || 12;
    return `${hourInt}:${minute} ${ampm}`;
  };

  const formatDateToMMDDYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Attraction_Name.trim() !== "" &&
    formData.Description.trim() !== "" &&
    formData.Status.trim() !== "" &&
    formData.Start_Date.trim() !== "" &&
    formData.End_Date.trim() !== "" &&
    selectedStartDate !== "" &&
    selectedStartTime !== "" &&
    selectedEndDate !== "" &&
    selectedEndTime !== "" &&
    new Date(`${selectedEndDate}T${selectedEndTime}`) > new Date(`${selectedStartDate}T${selectedStartTime}`); // ✅ Ensure Start Time is before End Time

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      Attraction_Name: "",
      Description: "",
      Status: "",
      Start_Date: "",
      End_Date: "",
    });
    setSelectedStartDate("");
    setSelectedStartTime("");
    setSelectedEndDate("");
    setSelectedEndTime("");


  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Maintenance Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Attraction ID Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Attraction Name</label>
                <select
                  value={formData.Attraction_Name}
                  onChange={(e) => handleChange(e, "Attraction_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Attraction Name</option>
                  {dropdownValues.attractionNames.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>


              {/* Start Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <div className="flex space-x-2">
                  <input type="date" value={selectedStartDate} onChange={handleStartDateChange} className="border px-3 py-2 w-1/2 rounded-md shadow-sm" />
                  <input type="time" value={selectedStartTime} onChange={handleStartTimeChange} className="border px-3 py-2 w-1/2 rounded-md shadow-sm" />
                </div>
              </div>

              {/* End Date & Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <div className="flex space-x-2">
                  <input type="date" value={selectedEndDate} onChange={handleEndDateChange} className="border px-3 py-2 w-1/2 rounded-md shadow-sm" />
                  <input type="time" value={selectedEndTime} onChange={handleEndTimeChange} className="border px-3 py-2 w-1/2 rounded-md shadow-sm" />
                </div>
              </div>

{/* Description Dropdown */}
<div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <select
                  value={formData.Description}
                  onChange={(e) => handleChange(e, "Description")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Description</option>
                  {dropdownValues.descriptions.map((desc) => (
                    <option key={desc} value={desc}>{desc}</option>
                  ))}
                </select>
              </div>

              {/* Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.Status}
                  onChange={(e) => handleChange(e, "Status")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Status</option>
                  <option value="Finished">Finished</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Not Yet Started">Not Yet Started</option>
                </select>
              </div>


            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/dashboard/Maintenance_Query")}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Maintenance Query
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${isFormValid ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                disabled={!isFormValid}
              >
                Submit
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default MtMaintenanceEntryForm;

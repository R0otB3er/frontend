import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { getUniqueMedicalValues } from "@/data";


export function CtMedicalEntryForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Checkup_Date: "",
    Diagnosis: "",
    Treatment: "",
  });

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    animalIDs: [],
    diagnoses: [],
  });

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const { uniqueAnimalIDs, uniqueDiagnoses } = getUniqueMedicalValues();
    console.log("Unique Medical Values:", uniqueAnimalIDs, uniqueDiagnoses); // Debugging
    setDropdownValues({
      animalIDs: uniqueAnimalIDs,
      diagnoses: uniqueDiagnoses,
    });
  }, []);

  // Handle input changes
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

  // Handle Date selection
  const handleDateChange = (event) => {
    const selected = event.target.value;
    setSelectedDate(selected);
    updateCheckupDate(selected);
  };
  
  const updateCheckupDate = (date) => {
    if (date && date.includes("-")) { // Ensure the format is correct
      const formattedDate = formatDateToMMDDYYYY(date);
      setFormData((prev) => ({ ...prev, Checkup_Date: formattedDate }));
    }
  };
  
  const formatDateToMMDDYYYY = (date) => {
    const [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  };

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Animal_ID.trim() !== "" &&
    formData.Checkup_Date.trim() !== "" &&
    formData.Diagnosis.trim() !== "" &&
    formData.Treatment.trim() !== "";

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    console.log("Form submitted:", formData);
    setFormData({
      Animal_ID: "",
      Checkup_Date: "",
      Diagnosis: "",
      Treatment: "",
    });
    setSelectedDate("");

  };

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Medical Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animal ID Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal ID</label>
                <select
                  value={formData.Animal_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select an Animal ID</option>
                  {dropdownValues.animalIDs.map((id) => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>

              {/* Checkup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Checkup Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                />
              </div>

              {/* Diagnosis Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <select
                  value={formData.Diagnosis}
                  onChange={(e) => handleChange(e, "Diagnosis")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select a Diagnosis</option>
                  {dropdownValues.diagnoses.map((diag) => (
                    <option key={diag} value={diag}>{diag}</option>
                  ))}
                </select>
              </div>

              {/* Treatment Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatment</label>
                <select
                  value={formData.Treatment}
                  onChange={(e) => handleChange(e, "Treatment")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select Treatment Status</option>
                  <option value="Not Yet Started">Not Yet Started</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Finished">Finished</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => navigate("/dashboard/Medical_Query")}
                className="px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Back to Medical Query
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

export default CtMedicalEntryForm;

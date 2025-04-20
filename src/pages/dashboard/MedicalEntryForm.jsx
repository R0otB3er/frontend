import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/user_managment/user_store";

export function MedicalEntryForm() {
  const navigate = useNavigate();
  const employeeId = useUserStore(state => state.id); // Get employee ID from store
  const [formData, setFormData] = useState({
    Animal_ID: "",
    Employee_ID: employeeId,
    Checkup_Date: "",
    Diagnosis: "",
    Treatment: "",
  });

  const [dropdownData, setDropdownData] = useState({
    Animals: [],
    Diagnoses: [],
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    // Fetch animals assigned to this employee
    fetch(`${import.meta.env.VITE_API_URL}/api/animal/getAnimals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_ID: employeeId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDropdownData(prev => ({
            ...prev,
            Animals: data
          }));
        } else {
          console.error("Unexpected response format:", data);
        }
      })
      .catch((err) => console.error("Error fetching animals:", err));

    // Fetch diagnoses (assuming this is a separate endpoint)
    // You may need to implement this endpoint or use a static list
    // For now, we'll use a placeholder
    setDropdownData(prev => ({
      ...prev,
      Diagnoses: [
        "Mild fever",
        "Injury",
        "Infection",
        "Parasites",
        "Respiratory issue",
        "Digestive problem"
      ]
    }));
  }, [employeeId]);

  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFormData(prev => ({ ...prev, Checkup_Date: date }));
  };

  const logCurrentDate = () => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    setSelectedDate(currentDate);
    setFormData(prev => ({ ...prev, Checkup_Date: currentDate }));
  };

  const isFormValid =
    formData.Animal_ID &&
    formData.Checkup_Date &&
    formData.Diagnosis &&
    formData.Treatment;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage({ type: "", text: "" });

    if (!isFormValid) {
      setSubmitMessage({ type: "error", text: "Please complete all fields." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/animalHealth/createMedicalRecord`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Animal_ID: formData.Animal_ID,
          Employee_ID: formData.Employee_ID,
          Checkup_Date: formData.Checkup_Date,
          Diagnosis: formData.Diagnosis,
          Treatment: formData.Treatment
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create medical record");
      }

      setSubmitMessage({
        type: "success",
        text: `Medical record created successfully! Record ID: ${result.Record_ID}`
      });

      // Reset form after successful submission
      setFormData({
        Animal_ID: "",
        Employee_ID: employeeId,
        Checkup_Date: "",
        Diagnosis: "",
        Treatment: "",
      });
      setSelectedDate("");
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "An error occurred while submitting the form"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            {/* Status Message */}
            {submitMessage.text && (
              <div className={`p-3 rounded-md ${
                submitMessage.type === "success" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {submitMessage.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animal Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal</label>
                <select
                  value={formData.Animal_ID}
                  onChange={(e) => handleChange(e, "Animal_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select an Animal</option>
                  {dropdownData.Animals.map((animal) => (
                    <option key={animal.Animal_ID} value={animal.Animal_ID}>
                      {animal.Animal_Name} (ID: {animal.Animal_ID})
                    </option>
                  ))}
                </select>
              </div>

              {/* Checkup Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Checkup Date</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="border px-3 py-2 w-full rounded-md shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={logCurrentDate}
                    className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                  >
                    Use Today
                  </button>
                </div>
              </div>

              {/* Diagnosis Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <input
                  type = "text"
                  value={formData.Diagnosis}
                  onChange={(e) => handleChange(e, "Diagnosis")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                />
              </div>

              {/* Treatment Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Treatment</label>
                <input
                  type = "text"
                  value={formData.Treatment}
                  onChange={(e) => handleChange(e, "Treatment")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-4 py-2 rounded-md text-white ${
                  isFormValid && !isSubmitting 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default MedicalEntryForm;
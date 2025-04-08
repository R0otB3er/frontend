import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export function MaintenanceRequestForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Location_ID: "",
    request_desc: "",
  });

  const [locationType, setLocationType] = useState("");

  const [errors, setErrors] = useState({});
  const [dropdownValues, setDropdownValues] = useState({
    Location_type: ["vendor", "habitat", "attraction"],
    vendors: [],
    attractions: [],
    habitats: [],
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getMaintenanceRequestFormInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Query Form Info Response Data:", data); //  Log the backend response
        setDropdownValues(data);
        console.log(dropdownData);
      })
      .catch((err) => console.error("Error fetching feeding form info:", err));
  }, []);

  const handleLocationTypeChange = (event) => {
    const value = event.target.value;
    setLocationType(value);
    // Clear the Location_ID when location type changes
    setFormData(prev => ({ ...prev, Location_ID: "" }));
  };

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

  // ✅ Validate form before enabling submit button
  const isFormValid =
    Object.values(errors).every((err) => !err) &&
    formData.Location_ID.trim() !== "" &&
    formData.request_desc.trim() !== ""; 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Please fill out all fields correctly.");
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/getTicketReport`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        const result = await res.json();
        console.log(result);
        setTicketResults(result);
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
            Maintenance Entry Form
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Grid Layout for Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* location type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Location Types</label>
                <select
                  value={locationType}
                  onChange={handleLocationTypeChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                >
                  <option value="" className="text-gray-400">Select the Type</option>
                  {dropdownValues.Location_type.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {/* habitat Dropdown */}
              {locationType === "habitat" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vendors</label>
                  <select
                    value={formData.Location_ID}
                    onChange={(e) => handleChange(e, "Location_ID")}
                    className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  >
                    <option value="" className="text-gray-400">Select the habitat</option>
                    {dropdownValues.habitats.map((hab) => (
                      <option key={hab.Maintenance_Location} value={hab.Maintenance_Location}>{hab.Habitat_Name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* vendor Dropdown */}
              {locationType === "vendors" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vendors</label>
                  <select
                    value={formData.Location_ID}
                    onChange={(e) => handleChange(e, "Location_ID")}
                    className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  >
                    <option value="" className="text-gray-400">Select the Vendor</option>
                    {dropdownValues.vendors.map((vend) => (
                      <option key={vend.Maintenance_Location} value={vend.Maintenance_Location}>{vend.vendor_name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Attraction Dropdown */}
              {locationType === "attraction" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Attractions</label>
                  <select
                    value={formData.Location_ID}
                    onChange={(e) => handleChange(e, "Location_ID")}
                    className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  >
                    <option value="" className="text-gray-400">Select the Attraction</option>
                    {dropdownValues.attractions.map((att) => (
                      <option key={att.Maintenance_Location} value={att.Maintenance_Location}>{att.Attraction_Name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type = "text"
                  value={formData.request_desc}
                  onChange={(e) => handleChange(e, "request_desc")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                />
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

export default MaintenanceRequestForm;

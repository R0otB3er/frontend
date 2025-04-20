import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography,
  Button 
} from "@material-tailwind/react";
import { useNavigate, useParams } from "react-router-dom";

// Default empty values for all fields
const DEFAULT_FORM_VALUES = {
  Animal_Name: "",
  Birth_Date: "",
  Habitat_ID: "",
  Species_ID: "",
  Wellness_Status: ""
};

export function AnimalEdit() {
  const navigate = useNavigate();
  const { Animal_ID } = useParams();
  const [animalData, setAnimalData] = useState({ ...DEFAULT_FORM_VALUES });
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_VALUES });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownValues, setDropdownValues] = useState({
    habitats: [],
    species: [],
    wellnessStatuses: []
  });

  // Safe value getter with fallback
  const getSafeValue = (data, key) => data[key] ?? DEFAULT_FORM_VALUES[key];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dropdown options
        const dropdownRes = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/getAnimalDropdowns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const dropdownData = await dropdownRes.json();
        console.log(dropdownRes);
        setDropdownValues({
          habitats: dropdownData.habitats || [],
          species: dropdownData.species || [],
          wellnessStatuses: dropdownData.wellnessStatuses || []
        });

        // Fetch animal data
        const animalRes = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/getAnimalById`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Animal_ID }),
        });
        const animalInfo = await animalRes.json();
        
        setAnimalData(animalInfo.animal);
        setFormData({
          ...DEFAULT_FORM_VALUES,
          ...animalInfo.animal,
          Birth_Date: formatDateForInput(animalInfo.animal.Birth_Date)
        });

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [Animal_ID]);

  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";
    const date = new Date(isoDateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (event, field) => {
    const value = event.target.value;
    setErrors((prev) => ({ ...prev, [field]: value.trim() ? null : "This field cannot be empty." }));
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (e) => { 
    const dateValue = e.target.value || "";
    setFormData(prev => ({
      ...prev,
      Birth_Date: dateValue
    }));
  };

  const isFormValid = () => {
    return formData.Animal_Name && 
           formData.Birth_Date && 
           formData.Habitat_ID && 
           formData.Species_ID && 
           formData.Wellness_Status;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) return;

    try {
      const payload = {
        ...formData,
        Animal_ID: Animal_ID
      };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/updateAnimal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Animal updated successfully!");
        navigate("/caretaker/Habitat_View"); 
      } else {
        const error = await res.json();
        alert(error.message || "Update failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this animal record? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/deleteAnimal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Animal_ID }),
      });

      if (res.ok) {
        alert("Animal deleted successfully!");
        navigate("/caretaker/Habitat_View"); // Redirect to animals list
      } else {
        const error = await res.json();
        alert(error.message || "Deletion failed");
      }
    } catch (error) {
      console.error("Deletion error:", error);
      alert("Deletion failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading animal data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Edit Animal #{Animal_ID}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animal Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal Name*</label>
                <input
                  type="text"
                  value={getSafeValue(formData, 'Animal_Name')}
                  onChange={(e) => handleChange(e, "Animal_Name")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                />
                {errors.Animal_Name && (
                  <Typography className="text-red-500 text-xs">
                    {errors.Animal_Name}
                  </Typography>
                )}
              </div>

              {/* Birth Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Birth Date*</label>
                <input
                  type="date"
                  value={getSafeValue(formData, 'Birth_Date')}
                  onChange={handleDateChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                />
              </div>

              {/* Habitat Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Habitat*</label>
                <select
                  value={getSafeValue(formData, 'Habitat_ID')}
                  onChange={(e) => handleChange(e, "Habitat_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select a habitat</option>
                  {dropdownValues.habitats?.map((habitat) => (
                    <option key={habitat.Habitat_ID} value={habitat.Habitat_ID}>
                      {habitat.Habitat_Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Species Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Species*</label>
                <select
                  value={getSafeValue(formData, 'Species_ID')}
                  onChange={(e) => handleChange(e, "Species_ID")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select a species</option>
                  {dropdownValues.species?.map((species) => (
                    <option key={species.Species_ID} value={species.Species_ID}>
                      {species.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wellness Status Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Wellness Status*</label>
                <select
                  value={getSafeValue(formData, 'Wellness_Status')}
                  onChange={(e) => handleChange(e, "Wellness_Status")}
                  className="border px-3 py-2 w-full rounded-md shadow-sm bg-white text-gray-600"
                  required
                >
                  <option value="">Select wellness status</option>
                  {dropdownValues.wellnessStatuses?.map((status) => (
                    <option key={status.wellness_typeID} value={status.wellness_typeID}>
                      {status.wellness_Types}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleDelete}
                color="red"
                className="px-4 py-2"
              >
                Delete Animal
              </Button>
              <Button
                onClick={() => navigate(-1)}
                color="gray"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="green"
                className="px-4 py-2"
                disabled={!isFormValid()}
              >
                Update Animal
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default AnimalEdit;
import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Typography, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { useUserStore } from "@/user_managment/user_store";

export function HabitatView() {
  const employeeId = useUserStore(state => state.id);
  const [habitatData, setHabitatData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [wellnessOptions, setWellnessOptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentHabitat, setCurrentHabitat] = useState("");
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    Species_ID: "",
    Habitat_ID: "",
    Birth_Date: "",
    wellness_typeID: ""
  });

  // Fetch initial data
  useEffect(() => { 
    setIsLoading(true);
    
    // Fetch animal data
    fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/getCaretakerView`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ Employee_ID: employeeId }),
    })
      .then((res) => res.json())
      .then((data) => {
        const groupedByHabitat = data.caretakerData.reduce((acc, animal) => {
            const habitatKey = `${animal.Habitat_ID}|${animal.Habitat_Name}`;
  
            if (!acc[habitatKey]) {
              acc[habitatKey] = {
                id: animal.Habitat_ID,
                name: animal.Habitat_Name,
                animals: []
              };
            }
            
            acc[habitatKey].animals.push(animal);
            return acc;
        }, {});
        setHabitatData(groupedByHabitat);
      })
      .catch((err) => console.error("Error fetching animal data:", err));

    // Fetch species and wellness options
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/getSpecies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
      }).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/getWellness`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
      }).then(res => res.json())
    ])
    .then(([speciesData, wellnessData]) => {
        //console.log(speciesData);
        console.log(wellnessData);
      setSpeciesOptions(speciesData.speciesData);
      setWellnessOptions(wellnessData.wellnessData);
    })
    .catch(err => console.error("Error fetching dropdown options:", err))
    .finally(() => setIsLoading(false));
  }, [employeeId]);

  const handleAddClick = (habitatID, habitatName) => {
    setCurrentHabitat({ id: habitatID, name: habitatName });
  setNewAnimal({
    name: "",
    Species_ID: "",
    Habitat_ID: habitatID,
    Birth_Date: "",
    wellness_typeID: ""
  });
  setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/createAnimal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({newAnimal}),
      });

      if (response.ok) {
        alert("Animal added successfully!");
        setShowAddForm(false);
        // Refresh the data
        const updatedData = await fetch(`${import.meta.env.VITE_API_URL}/api/animalCare/getCaretakerView`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ Employee_ID: employeeId }),
        }).then(res => res.json());
        
        const groupedByHabitat = data.caretakerData.reduce((acc, animal) => {
            const habitatKey = `${animal.Habitat_ID}|${animal.Habitat_Name}`;
  
            if (!acc[habitatKey]) {
              acc[habitatKey] = {
                id: animal.Habitat_ID,
                name: animal.Habitat_Name,
                animals: []
              };
            }
            
            acc[habitatKey].animals.push(animal);
        }, {});
        setHabitatData(groupedByHabitat);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to add animal. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading habitat data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-6xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Animal Care Dashboard
          </Typography>
        </CardHeader>
        <CardBody className="space-y-8">
          {Object.entries(habitatData).map(([habitatKey, habitatInfo]) => (
            <div key={habitatKey} className="mb-8">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                {habitatInfo.name}
              </Typography>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  {/* Table headers and rows same as before */}
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Animal Name</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Species</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Attraction</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Diet Type</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Wellness Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {habitatInfo.animals.map((animal, index) => (
                      <tr key={`${animal.Animal_ID}-${index}`} className="even:bg-blue-gray-50/50">
                        <td className="p-4">{animal.Animal_Name}</td>
                        <td className="p-4">{animal.Species_Type}</td>
                        <td className="p-4">{animal.Attraction_Name}</td>
                        <td className="p-4">{animal.Food_Type}</td>
                        <td className="p-4">{animal.wellness_Types}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <Button 
                color="green" 
                className="mt-4"
                onClick={() => handleAddClick(habitatInfo.id, habitatInfo.name)}
              >
                Add Animal to {habitatInfo.name}
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Add Animal Dialog */}
      <Dialog open={showAddForm} handler={() => setShowAddForm(false)}>
        <DialogHeader>Add New Animal to {currentHabitat.name}</DialogHeader>
        <DialogBody>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={newAnimal.name}
                onChange={handleInputChange}
                className="border px-3 py-2 w-full rounded-md shadow-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Species</label>
              <select
                name="Species_ID"
                value={newAnimal.Species_ID}
                onChange={handleInputChange}
                className="border px-3 py-2 w-full rounded-md shadow-sm"
                required
              >
                <option value="">Select Species</option>
                {speciesOptions?.map(species => (
                  <option key={species.Species_ID} value={species.Species_ID}>
                    {species.Name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Habitat</label>
              <input
                type="text"
                name="Habitat"
                value={currentHabitat.name}
                readOnly
                className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Date (Optional)</label>
              <input
                type="date"
                name="Birth_Date"
                value={newAnimal.Birth_Date}
                onChange={handleInputChange}
                className="border px-3 py-2 w-full rounded-md shadow-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Wellness Status</label>
              <select
                name="wellness_typeID"
                value={newAnimal.wellness_typeID}
                onChange={handleInputChange}
                className="border px-3 py-2 w-full rounded-md shadow-sm"
                required
              >
                <option value="">Select Status</option>
                {wellnessOptions.map(status => (
                  <option key={status.wellness_typeID} value={status.wellness_typeID}>
                    {status.wellness_Types}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setShowAddForm(false)}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={!newAnimal.name || !newAnimal.Species_ID || !newAnimal.wellness_typeID}
          >
            Add Animal
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default HabitatView;
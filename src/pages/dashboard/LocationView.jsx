import { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Button, 
  Dialog, 
  DialogHeader, 
  DialogBody, 
  DialogFooter 
} from "@material-tailwind/react";
import { useUserStore } from "@/user_managment/user_store";

export function LocationView() {
  const Manager_ID = useUserStore(state => state.id);
  const [groupedLocations, setGroupedLocations] = useState({});
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    dept_id: "",
    id: "",
    type: "",
    name: ""
  });
  const [newAssignment, setNewAssignment] = useState({
    Employee_ID: "",
    Dept_ID: "",
    Location_type: "",
    Location_ID: ""
  });
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [Manager_ID]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch manager location data
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/manager/getManagerView`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Manager_ID })
      });
      
      const data = await response.json();
      
      // Group locations by their ID
      const grouped = data.managerData.reduce((acc, location) => {
        const locationName = location.Location_Name;
        const locationType = location.Location_Type;
        
        if (!acc[locationName]) {
          acc[locationName] = {
            Department_ID: location.Department_ID, 
            department_name: location.Department_Name,
            Location_ID: location.Location_ID,
            name: locationName,
            type: locationType,
            annualCost: location.Annual_Cost,
            status: location.status_type,
            employees: []
          };
        }
      
        // Only add employee if one exists
        if (location.Employee_ID) {
          acc[locationName].employees.push({
            id: location.Employee_ID,
            name: location.Employee_Name,
            role: location.Role
          });
        }
        
        return acc;
      }, {});
      
      setGroupedLocations(grouped);
      
      // Fetch available employees for dropdown
      const employeesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/HR/getSCEmployees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const employeesData = await employeesRes.json();
      console.log("given employees: ", employeesData.employees);
      setEmployeeOptions(employeesData.employees || []);
      
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssignment = async (employeeId, locationId) => {
    if (!window.confirm("Are you sure you want to remove this employee from this location?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/HR/deleteWorksAt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Employee_ID: employeeId,
          Location_ID: locationId
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Employee successfully removed from location");
        // Refresh the data
        await fetchData();
      } else {
        alert(`Failed to remove employee: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while removing the employee");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sending:", newAssignment);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/HR/createWorksAt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (response.ok) {
        alert("Worker assigned successfully!");
        setShowAddForm(false);
        await fetchData();
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to assign worker. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = (location) => {
    setCurrentLocation({
      Department_ID: location.Department_ID,
      Location_ID: location.Location_ID,
      type: location.type,
      name: location.name
    });
    
    setNewAssignment({
      Employee_ID: "",
      Department_ID: location.Department_ID,
      Location_ID: location.Location_ID
    });
    
    setShowAddForm(true);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h5">Loading location data...</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 flex flex-col items-center">
      <Card className="w-full max-w-6xl shadow-lg rounded-lg p-6 bg-white">
        <CardHeader variant="gradient" color="gray" className="mb-6 p-6 rounded-t-lg">
          <Typography variant="h5" color="white" className="text-center">
            Location Management
          </Typography>
        </CardHeader>
        <CardBody className="space-y-8">
          {Object.values(groupedLocations).map((location) => (
            <div key={location.Location_ID} className="mb-8 border rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" className="font-semibold">
                    {location.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {location.type}
                  </Typography>
                </div>
                <div className="text-right">
                  <Typography variant="small">
                    <span className="font-semibold">Annual Cost:</span> ${location.annualCost}
                  </Typography>
                  <Typography variant="small">
                    <span className="font-semibold">Department:</span> {location.department_name}
                  </Typography>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                  <thead>
                    <tr>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Assigned Workers</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Role</th>
                      <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {location.employees.length > 0 ? (
                      location.employees.map((employee) => (
                        <tr key={employee.id} className="even:bg-blue-gray-50/50">
                          <td className="p-4">{employee.name}</td>
                          <td className="p-4">{employee.role}</td>
                          <td className="p-4">
                            <Button
                              color="red"
                              size="sm"
                              onClick={() => handleDeleteAssignment(employee.id, location.Location_ID)}
                              disabled={isDeleting}
                            >
                              {isDeleting ? "Removing..." : "Remove"}
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="even:bg-blue-gray-50/50">
                        <td colSpan="3" className="p-4 text-center">No workers assigned</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <Button 
                color="green" 
                className="mt-4"
                onClick={() => { handleAddClick(location) }}
              >
                Assign Worker to {location.name}
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      <Dialog open={showAddForm} handler={() => setShowAddForm(false)}>
        <DialogHeader>Assign Worker to {currentLocation.name}</DialogHeader>
        <DialogBody>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={`${currentLocation.name} (${currentLocation.type})`}
                readOnly
                className="border px-3 py-2 w-full rounded-md shadow-sm bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Select Role</label>
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="border px-3 py-2 w-full rounded-md shadow-sm"
                required
              >
                <option value="">Select Role</option>
                <option value="caretaker">Caretaker</option>
                <option value="service">Service</option>
              </select>
            </div>
            
            {selectedRole && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Employee</label>
                <select
                  name="Employee_ID"
                  value={newAssignment.Employee_ID}
                  onChange={handleInputChange}
                  className="border px-3 py-2 w-full rounded-md shadow-sm"
                  required
                  disabled={!selectedRole}
                >
                  <option value="">Select Employee</option>
                  {employeeOptions
                    .filter(e => e.Role === selectedRole)
                    .map(e => (
                      <option key={e.Employee_ID} value={e.Employee_ID}>
                        {`${e.first_name} ${e.last_name}`}
                      </option>
                    ))}
                </select>
              </div>
            )}
            
            <input type="hidden" name="Dept_ID" value={newAssignment.Dept_ID} />
            <input type="hidden" name="Location_type" value={newAssignment.Location_type} />
            <input type="hidden" name="Location_ID" value={newAssignment.Location_ID} />
            <input type="hidden" name="Role" value={selectedRole} />
          </form>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => {
              setShowAddForm(false);
              setSelectedRole("");
            }}
            className="mr-1"
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="green"
            onClick={handleSubmit}
            disabled={!newAssignment.Employee_ID || !selectedRole}
          >
            Assign Worker
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default LocationView;
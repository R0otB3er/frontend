export const MaintenanceQuery = [
  {
    Maintenance_ID: "232423423",
    Attraction_Name: "Safari Ride",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Needs cleaning",
    Status: "Finished",
  },
  {
    Maintenance_ID: "45664575",
    Attraction_Name: "Water Park",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Broken pole",
    Status: "In Progress",
  },
  {
    Maintenance_ID: "345546745",
    Attraction_Name: "Monkey Jungle",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Tree fell",
    Status: "In Progress",
  },
  {
    Maintenance_ID: "67867867",
    Attraction_Name: "Electric Carousel",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Power Outage",
    Status: "Finished",
  },
  {
    Maintenance_ID: "789696786",
    Attraction_Name: "Aquarium Exhibit",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Leaking Pipe",
    Status: "In Progress",
  },
  {
    Maintenance_ID: "789789780",
    Attraction_Name: "Glass House",
    Employee_ID: "234234",
    Start_Date: "11/12/2024",
    End_Date: "11/14/2024",
    Description: "Shattered Glass",
    Status: "Finished",
  },
];

// Function to get unique values for dropdowns
export const getUniqueMaintenanceValues = () => {
  const uniqueAttractionNames = [...new Set(MaintenanceQuery.map((entry) => entry.Attraction_Name))];
  const uniqueDescriptions = [...new Set(MaintenanceQuery.map((entry) => entry.Description))];

  return { uniqueAttractionNames, uniqueDescriptions };
};

export default MaintenanceQuery;

  
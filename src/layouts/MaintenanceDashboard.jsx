import React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState} from "react";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import { IconButton, Alert } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context"; 

export function MaintenanceDashboard() {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;
  const [notifications, setNotifications] = useState([]);
  
  const [showAlerts, setShowAlerts] = React.useState({
      blue: false,
    });
  
    useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getMaintenanceNotifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("recived data: ",data);
        setNotifications(data.notifications || []);
        if (data.notifications && data.notifications.length > 0) {
          setShowAlerts((current) => ({ ...current, ["blue"]: true }));
        }
      })
      .catch((err) => console.error("Error fetching form data:", err));
  }, []);

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes
          .filter((r) => r.layout === "maintenance")
          .map(group => ({
            ...group,
            pages: group.pages.filter(page => !page.hidden)
        }))}
        brandName="Maintenance Dashboard"
      />
      <div className="p-4 xl:ml-80">
        
        <DashboardNavbar />
        {showAlerts.blue && notifications.length > 0 && (
          <Alert
            key="blue"
            open={showAlerts["blue"]}
            color={"blue"}
            onClose={() => setShowAlerts((current) => ({ ...current, ["blue"]: false }))}
          >
            <span 
              className="cursor-pointer hover:underline"
              onClick={() => navigate(`/maintenance/Maintenance_Edit/${notifications[0].mnt_ID}`)}
            >
            {notifications[0].message} at {notifications[0].Location_Name}
            </span>
          </Alert>
        )}
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes
            .find((r) => r.layout === "maintenance")
            ?.pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default MaintenanceDashboard;

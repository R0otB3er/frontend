import React from "react";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
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

  const handleNotificationClick = (notification) => {
    // First send the API call to mark as seen
    fetch(`${import.meta.env.VITE_API_URL}/api/seenMaintenanceNotification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maintenance_messageID: notification.maintenance_messageID }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Remove the notification from state
          setNotifications(prev => prev.filter(n => n.maintenance_messageID !== notification.maintenance_messageID));
          // Navigate to the maintenance edit page
          navigate(`/maintenance/Maintenance_Edit/${notification.mnt_ID}`);
        }
      })
      .catch(err => console.error("Error marking notification as seen:", err));
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getMaintenanceNotifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("received data: ", data);
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
              onClick={() => handleNotificationClick(notifications[0])}
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
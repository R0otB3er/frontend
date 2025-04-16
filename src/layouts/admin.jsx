import React from "react";
import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { Alert } from "@material-tailwind/react";
import { useEffect, useState} from "react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

export function Admin() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  // Filter routes to include only those with layout "admin"
  const adminRoutes = routes.filter((route) => route.layout === "admin");

  const [notifications, setNotifications] = useState([]);
    
  const [showAlerts, setShowAlerts] = React.useState({
      blue: false,
    });
  
    useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/getVendorNotifications`, {
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
                .filter((r) => r.layout === "admin")
                .map(group => ({
                  ...group,
                  pages: group.pages.filter(page => !page.hidden)
                }))}
              brandName="Admin Dashboard"
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
            {/* Display first notification or join all messages */}
            {notifications[0].message } of {notifications[0].Item_Name}
          </Alert>
        )}
        <Configurator />

        <Routes>
          {routes
            .find((r) => r.layout === "admin")
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

Admin.displayName = "/src/layout/admin.jsx";

export default Admin;

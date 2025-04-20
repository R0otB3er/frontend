import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import routes from "@/routes";
import { Admin, CaretakerDashboard, MaintenanceDashboard, WebsiteLayout, VisitorLayout, Manager } from "@/layouts";

function App() {
  return (
    <Routes>
      {/* Manager Routes */}
      <Route path="/manager/*" element={<Manager />}>
        {routes
          .find((r) => r.layout === "manager")
          .pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={<Admin />}>
        {routes
          .find((r) => r.layout === "admin")
          .pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Route>

      {/* Caretaker Routes */}
      <Route path="/caretaker/*" element={<CaretakerDashboard />}>
        {routes
          .find((r) => r.layout === "caretaker")
          .pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Route>

      {/* Maintenance Routes */}
      <Route path="/maintenance/*" element={<MaintenanceDashboard />}>
        {routes
          .find((r) => r.layout === "maintenance")
          .pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Route>

      {/* Public Routes */}
      <Route path="/" element={<WebsiteLayout />}>
        {routes
          .find((r) => r.layout === "public")
          .pages.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
      </Route>

      <Route path="/visitor/*" element={<VisitorLayout />}>
  {routes
    .find((r) => r.layout === "visitor")
    .pages.map(({ path, element }) => (
      <Route key={path} path={path.replace('/visitor/', '')} element={element} />
    ))}
</Route>


      {/* Auth Routes (standalone) */}
      {routes
        .find((r) => r.layout === "standalone")
        .pages.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@/routes";
import { Admin } from "@/layouts";

// This function recursively maps your route definitions
function renderRoutes(routes) {
  return routes.flatMap((section) =>
    section.pages.map(({ path, element }) => {
      // If the section has a layout wrapper (like WebsiteLayout or Dashboard), nest routes inside
      if (section.element) {
        return (
          <Route key={path} element={section.element}>
            <Route path={path} element={element} />
          </Route>
        );
      }
      // Otherwise, return the route normally (no wrapper)
      return <Route key={path} path={path} element={element} />;
    })
  );
}

function App() {
  return (
    <Routes>
      {renderRoutes(routes)}
      <Route path="/Admin/*" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

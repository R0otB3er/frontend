import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "@/routes";

// Helper to wrap routes inside layout components
function renderRoutes(routes) {
  return routes.flatMap((section) =>
    section.pages.map(({ path, element }) => {
      if (section.element) {
        return (
          <Route key={path} element={section.element}>
            <Route path={path} element={element} />
          </Route>
        );
      }
      return <Route key={path} path={path} element={element} />;
    })
  );
}

function App() {
  return (
    <Routes>
      {renderRoutes(routes)}

      {/* Set admin dashboard as default view */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;


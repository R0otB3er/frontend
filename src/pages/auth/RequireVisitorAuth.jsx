import { useUserStore } from "@/user_managment/user_store";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireVisitorAuth({ children }) {
  const { loggedIn, user_type, id } = useUserStore();
  const location = useLocation();

  const isVisitor = loggedIn && user_type === "visitor" && id > 1;

  if (!isVisitor) {
    alert("Please sign in as a visitor to access this page.");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

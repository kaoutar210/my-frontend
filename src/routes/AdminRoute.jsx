import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  // not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // logged in but NOT admin
  if (user.role !== "admin") {
    return <Navigate to="/student/courses" replace />;
  }

  // admin allowed
  return <Outlet />;
}
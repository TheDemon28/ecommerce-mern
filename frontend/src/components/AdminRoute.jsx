import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Logged in but not admin
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

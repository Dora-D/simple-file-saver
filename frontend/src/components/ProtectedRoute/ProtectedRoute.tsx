import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxAppHooks";

const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(({ auth }) => auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

const Drive = () => {
  const { logout } = useAuth();
  return (
    <div>
      At Drive
      <button onClick={logout}>logout</button>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    index: true,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/drive",
        element: <Drive />,
      },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

export default router;

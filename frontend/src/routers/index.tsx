import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Login/Login";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Drive from "../components/Drive/Drive";
import FilePage from "../components/FilePage/FilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/drive",
        element: <Drive />,
      },
      {
        path: "/drive/folder/:folderId",
        element: <Drive />,
      },
      {
        path: "/drive/available-to-me",
        element: <Drive />,
      },
      {
        path: "/drive/available-to-me/folder/:folderId",
        element: <Drive />,
      },
      {
        path: "/drive/available-to-me/file/:fileId",
        element: <FilePage />,
      },
    ],
  },
  {
    path: "*",
    element: <p>404 Error - Nothing here...</p>,
  },
]);

export default router;

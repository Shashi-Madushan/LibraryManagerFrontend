import { createBrowserRouter } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogIn from "./pages/LogIn";
import Layout from "./pages/Layout";
import AdminLayout from "./pages/admin/Layout";
import AdminLogin from "./pages/admin/Login";
import AdminRoute from "./components/AdminRoute";
import UserManagement from "./components/admin/UserManagement";

const router = createBrowserRouter([
    {
        path: "/signup",
        element: <SignUpPage />,
    },
    {
        path: "/login",
        element: <LogIn />,
    },
    {
        path: "/dashboard",
        element: <Layout/>,
    },
    {
        path: "/admin",
        children: [
            {
                path: "login",
                element: <AdminLogin />,
            },
            {
                path: "",
                element: (
                    <AdminRoute>
                        <AdminLayout />
                     </AdminRoute>
                ),
                children: [
                    {
                        path: "",
                        element: <div>Admin Dashboard</div>,
                    },
                    {
                        path: "books",
                        element: <div>Books Management</div>,
                    },
                    {
                        path: "users",
                        element: <UserManagement/>,
                    },
                    {
                        path: "settings",
                        element: <div>Settings</div>,
                    },
                ],
            },
        ],
    }
])

export default router;
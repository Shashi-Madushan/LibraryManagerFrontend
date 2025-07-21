import { createBrowserRouter, Navigate } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogIn from "./pages/LogIn";
import Layout from "./pages/Layout";
import AdminLayout from "./pages/admin/Layout";
import AdminLogin from "./pages/admin/Login";
import AdminRoute from "./components/AdminRoute";
import UserRoute from "./components/UserRoute";
import UserManagement from "./components/admin/UserManagement";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" />,
    },
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
        element: (
            <UserRoute>
                <Layout/>
            </UserRoute>
        ),
        children: [
            {
                path: "",
                element: <div>User Dashboard</div>,
            },
            {
                path: "profile",
                element: <div>User Profile</div>,
            },
            {
                path: "settings",
                element: <div>User Settings</div>,
            },
        ]
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
]);

export default router;
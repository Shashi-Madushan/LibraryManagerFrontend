import { createBrowserRouter } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogIn from "./pages/LogIn";
import Layout from "./pages/Layout";
import AdminLayout from "./pages/admin/Layout";
import AdminLogin from "./pages/admin/Login";
import AdminRoute from "./components/admin/AdminRoute";
import UserManagement from "./pages/admin/UserManagement";
import BookManagement from "./pages/admin/BookManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import  DashboardPage from "./pages/admin/DashboardPage";
import  LendingManagement  from "./pages/admin/LendingManagement";

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
                        element: <DashboardPage />,
                    },
                    {
                        path: "books",
                        element: <BookManagement/>,
                    },
                    {
                        path: "users",
                        element: <UserManagement/>,
                    },
                    {
                        path: "lendings",
                        element: <LendingManagement/>,
                    },
                    {
                        path: "lendings/by-book",
                        element: <div>By Book</div>,
                    },
                    {
                        path: "lendings/by-user",
                        element: <div>By User</div>,
                    },
                    {
                        path: "lendings/overdue",
                        element: <div>Overdue Lendings</div>,
                    },
                    {
                        path: "settings",
                        element: <div>Settings</div>,
                    },
                    {
                        path: "audit-logs",
                        element: <AuditLogs />,
                    },
                ],
            },
        ],
    }
])

export default router;
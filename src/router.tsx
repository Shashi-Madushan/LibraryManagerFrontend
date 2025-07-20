import { createBrowserRouter } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LogIn from "./pages/LogIn";


const router = createBrowserRouter([
    {
        path: "/signup",
        element: <SignUpPage />,
    },
    {
        path: "/login",
        element: <LogIn />,
    }

])

export default router;
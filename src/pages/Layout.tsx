import { Outlet } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
const Layout = () => {
    const {isAuthenticating} = useAuth();
    if(isAuthenticating) {
        return <div>Loading...</div>;
    }
    return(
        <main >
            <Outlet/>
            <div>dashboard</div>
        </main>
    )
}

export default Layout;
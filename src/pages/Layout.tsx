import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/UseAuth";
import UserSidebar from "../components/UserSidebar";
import UserTopBar from '../components/UserTopBar';
const Layout = () => {
    const { isAuthenticating } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const sidebarWidth = isSidebarExpanded ? 288 : 80;

    if(isAuthenticating) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside
                className={`z-30 transition-transform duration-300 ease-in-out`}
                style={{
                    width: isDesktop ? `${sidebarWidth}px` : '0px',
                    position: isDesktop ? 'fixed' : 'fixed',
                    left: 0,
                    top: 0,
                    height: '100vh',
                    transform: isDesktop
                        ? 'translateX(0)'
                        : isSidebarOpen
                            ? 'translateX(0)'
                            : 'translateX(-100%)',
                }}
            >
                <UserSidebar
                    isOpen={isDesktop ? true : isSidebarOpen}
                    onClose={closeSidebar}
                    onExpandChange={setIsSidebarExpanded}
                />
            </aside>

            {!isDesktop && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-20"
                    onClick={closeSidebar}
                />
            )}

            <div
                className="flex-1"
                style={{
                    marginLeft: isDesktop ? `${sidebarWidth}px` : 0,
                    transition: 'margin-left 0.3s',
                }}
            >
                <UserTopBar
                    toggleSidebar={toggleSidebar}
                    className="fixed top-0 right-0 left-0 z-20"
                />
                <main className="mt-16 transition-all duration-300 ease-in-out">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../components/admin/TopBar';
import SideBar from '../../components/admin/SideBar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
    const [searchTerm, setSearchTerm] = useState('');
    const [useServerSearch, setUseServerSearch] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const newIsDesktop = window.innerWidth >= 1024;
            setIsDesktop(newIsDesktop);
            if (newIsDesktop) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const sidebarWidth = isSidebarExpanded ? 288 : 80; // px

    return (
        <div className="min-h-screen bg-gray-50 flex relative">
            {/* Overlay for mobile */}
            {!isDesktop && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-10 backdrop-blur-sm"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <SideBar
                    isOpen={true}
                    onClose={closeSidebar}
                    onExpandChange={setIsSidebarExpanded}
                />
            </aside>
            {/* Main Content Area */}
            <div
                className="flex-1 min-w-0"
                style={{
                    marginLeft: isDesktop ? `${sidebarWidth}px` : 0,
                    transition: 'margin-left 0.3s',
                }}
            >
                <TopBar
                    toggleSidebar={toggleSidebar}
                    className={`fixed z-20 right-0 ${isDesktop ? 'left-[80px]' : 'left-0'} ${
                        isSidebarExpanded ? 'lg:left-[288px]' : ''
                    }`}
                    isExpanded={isSidebarExpanded}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    useServerSearch={useServerSearch}
                    setUseServerSearch={setUseServerSearch}
                />
                <main className="pt-20 px-4 pb-8 transition-all duration-300 ease-in-out">
                    <Outlet context={{ searchTerm, useServerSearch }} />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

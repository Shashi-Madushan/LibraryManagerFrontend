import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopBar from '../../components/admin/TopBar';
import SideBar from '../../components/admin/SideBar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SideBar isOpen={isSidebarOpen} onClose={closeSidebar} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <TopBar toggleSidebar={toggleSidebar} />
                
                {/* Content Area */}
                <main className="flex-1 p-4 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

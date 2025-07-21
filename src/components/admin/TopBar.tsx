import { FaBars, FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../context/UseAuth';

interface TopBarProps {
    toggleSidebar: () => void;
    className?: string;
    isExpanded: boolean;
}

const TopBar = ({ toggleSidebar, className }: TopBarProps) => {
    const {logout} = useAuth();
    const [showUserPopup, setShowUserPopup] = useState(false);
    const adminData = {
        name: "John Doe",
        email: "john.doe@admin.com",
        role: "Super Admin",
        lastLogin: "2024-01-20 09:30 AM"
    };

    return (
        <div className={`bg-white/70 backdrop-blur-xl mx-4 mt-4 h-14 flex items-center justify-between px-4 rounded-xl shadow-sm ${className || ''}`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl hover:bg-gray-100/80 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <FaBars className="h-5 w-5 text-gray-600" />
                </button>
                
                {/* Search Bar - Full width on mobile */}
                <div className="relative flex-1 lg:w-64">
                    <div className="flex items-center bg-gray-50/50 rounded-xl px-3 py-2 w-full">
                        <FaSearch className="text-gray-400 w-4 h-4 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Search..."
                            className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button 
                    className="p-2 rounded-xl hover:bg-gray-100/80 relative"
                    aria-label="Notifications"
                >
                    <FaBell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                </button>
                
                <div className="relative">
                    <div 
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 cursor-pointer"
                        onClick={() => setShowUserPopup(!showUserPopup)}
                    >
                        <FaUserCircle className="h-6 w-6 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">{adminData.name}</span>
                    </div>

                    {showUserPopup && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-800">{adminData.name}</p>
                                <p className="text-sm text-gray-600">{adminData.email}</p>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-sm text-gray-600">Role: {adminData.role}</p>
                                <p className="text-sm text-gray-600">Last Login: {adminData.lastLogin}</p>
                            </div>
                            <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                                <button 
                                    onClick={() => {
                                        logout();
                                        setShowUserPopup(false);
                                    }}
                                    className="text-sm text-red-600 hover:text-red-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;

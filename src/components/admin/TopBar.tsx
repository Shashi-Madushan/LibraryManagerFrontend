import { FaBars, FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';

interface TopBarProps {
    toggleSidebar: () => void;
    className?: string;
    isExpanded: boolean;
}

const TopBar = ({ toggleSidebar, className, isExpanded }: TopBarProps) => {
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
                
                <div className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100/80 cursor-pointer">
                    <FaUserCircle className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
                </div>
            </div>
        </div>
    );
};

export default TopBar;

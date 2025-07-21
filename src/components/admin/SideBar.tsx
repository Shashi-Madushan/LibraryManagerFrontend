import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaUsers, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
}

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const location = useLocation();

    const menuItems = [
        { icon: <FaChartBar />, label: 'Dashboard', path: '/admin' },
        { icon: <FaBook />, label: 'Books', path: '/admin/books' },
        { icon: <FaUsers />, label: 'Users', path: '/admin/users' },
        { icon: <FaCog />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity lg:hidden ${
                    isOpen ? 'opacity-100 z-40' : 'opacity-0 -z-10'
                }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div 
                className={`
                    fixed top-4 left-4 h-[calc(100vh-2rem)] bg-white/70 backdrop-blur-xl rounded-2xl
                    transform transition-all duration-300 ease-in-out z-50
                    lg:relative lg:left-0 lg:top-0 lg:h-screen lg:rounded-none lg:rounded-r-2xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    ${isExpanded ? 'w-72' : 'lg:w-20'}
                    hover:lg:w-72
                `}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Logo */}
                <div className={`h-16 flex items-center justify-center transition-all duration-300
                    ${isExpanded ? 'px-4' : 'px-2'}`}>
                    <h1 className={`font-semibold text-gray-800 whitespace-nowrap overflow-hidden transition-all
                        ${isExpanded ? 'text-xl opacity-100' : 'lg:text-[0px] lg:opacity-0'}`}>
                        Admin Panel
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-grow">
                    <ul className="space-y-1.5 px-3">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200
                                        hover:bg-gray-100/80 hover:text-blue-600 group
                                        ${location.pathname === item.path ? 'bg-blue-50/80 text-blue-600 font-medium' : 'text-gray-600'}
                                    `}
                                    onClick={() => {
                                        if (window.innerWidth < 1024) onClose();
                                    }}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className={`whitespace-nowrap transition-all ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-8 w-full px-3">
                    <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 
                        hover:bg-red-50/80 hover:text-red-600 rounded-xl transition-all duration-200`}>
                        <span className="text-lg"><FaSignOutAlt /></span>
                        <span className={`whitespace-nowrap transition-all ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default SideBar;

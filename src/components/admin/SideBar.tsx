import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaExchangeAlt, FaHistory, FaChevronDown, FaChevronRight, FaTasks, FaSearch, FaUser, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../context/UseAuth';
interface SideBarProps {
    isOpen: boolean;
    onClose: () => void;
    onExpandChange?: (expanded: boolean) => void; // new prop
}

const SideBar = ({  onClose, onExpandChange }: SideBarProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [lendingsExpanded, setLendingsExpanded] = useState(false); // state for lendings submenu
    const location = useLocation();
    const { logout } = useAuth();   

    // Notify parent when expanded/collapsed
    useEffect(() => {
        if (onExpandChange) onExpandChange(isExpanded);
    }, [isExpanded, onExpandChange]);

    // Only allow expand/collapse on desktop
    const handleMouseEnter = () => {
        if (window.innerWidth >= 1024) setIsExpanded(true);
    };
    const handleMouseLeave = () => {
        if (window.innerWidth >= 1024) setIsExpanded(false);
    };

    const handleLogout = async () => {
        try {
            await logout();
            
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLendingsClick = () => {
        setLendingsExpanded((prev) => !prev);
    };

    const menuItems = [
        { icon: <FaChartBar />, label: 'Dashboard', path: '/admin' },
        { icon: <FaBook />, label: 'Books', path: '/admin/books' },
        { icon: <FaUsers />, label: 'Users', path: '/admin/users' },
        { 
            icon: <FaExchangeAlt />, 
            label: 'Lendings', 
            path: '/admin/lendings',
            subLinks: [
                { icon: <FaTasks />, label: 'All Lendings', path: '/admin/lendings' },
                { icon: <FaSearch />, label: 'Find By Book', path: '/admin/lendings/by-book' },
                { icon: <FaUser />, label: 'Find By User', path: '/admin/lendings/by-user' },
                { icon: <FaExclamationCircle />, label: 'Overdue Lendings', path: '/admin/lendings/overdue' },
            ]
        },
        { icon: <FaHistory />, label: 'Audit Logs', path: '/admin/audit-logs' },
        { icon: <FaCog />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <>
            {/* Sidebar */}
            <div 
                className={`
                    h-full bg-white shadow-lg
                    transform transition-all duration-300 ease-in-out
                    ${isExpanded ? 'w-72' : 'w-20'}
                    ${window.innerWidth >= 1024 ? 'hover:w-72' : 'w-72 lg:w-20'}
                `}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
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
                                {item.label === 'Lendings' ? (
                                    <>
                                        <button
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full transition-all duration-200
                                                hover:bg-gray-100/80 hover:text-blue-600 group
                                                ${location.pathname.startsWith('/admin/lendings') ? 'bg-blue-50/80 text-blue-600 font-medium' : 'text-gray-600'}
                                            `}
                                            onClick={() => {
                                                // Only allow expanding/collapsing sublinks if sidebar is expanded
                                                if (isExpanded) handleLendingsClick();
                                                if (window.innerWidth < 1024) onClose();
                                            }}
                                            type="button"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className={`whitespace-nowrap transition-all ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0'}`}>
                                                {item.label}
                                            </span>
                                            <span className="ml-auto">
                                                {/* Only show chevron if sidebar is expanded */}
                                                {isExpanded ? (lendingsExpanded ? <FaChevronDown /> : <FaChevronRight />) : null}
                                            </span>
                                        </button>
                                        {/* Sub-links: only show if sidebar is expanded and lendingsExpanded is true */}
                                        <ul
                                            className={`pl-10 mt-1 space-y-1 transition-all duration-200
                                                ${isExpanded && lendingsExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}
                                            `}
                                        >
                                            {item.subLinks?.map((sub, subIdx) => (
                                                <li key={subIdx}>
                                                    <Link
                                                        to={sub.path}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-150
                                                            hover:bg-blue-100 hover:text-blue-700
                                                            ${location.pathname === sub.path ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-600'}
                                                        `}
                                                        onClick={() => {
                                                            if (window.innerWidth < 1024) onClose();
                                                        }}
                                                    >
                                                        <span className="text-base">{sub.icon}</span>
                                                        <span className={`whitespace-nowrap transition-all ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0'}`}>
                                                            {sub.label}
                                                        </span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
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
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-8 w-full px-3">
                    <button 
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 
                        hover:bg-red-50/80 hover:text-red-600 rounded-xl transition-all duration-200`}
                    >
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

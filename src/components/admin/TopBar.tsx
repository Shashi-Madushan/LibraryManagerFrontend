import { FaBars, FaBell, FaUserCircle, FaSearch } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '../../context/UseAuth';
import { getStoredUser } from '../../util/authStorage';

interface TopBarProps {
    toggleSidebar: () => void;
    className?: string;
    isExpanded: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    useServerSearch: boolean;
    setUseServerSearch: (val: boolean) => void;
}

const TopBar = ({
    toggleSidebar,
    className,
    searchTerm,
    setSearchTerm,
    useServerSearch,
    setUseServerSearch,
}: TopBarProps) => {
    const {logout} = useAuth();
    const [showUserPopup, setShowUserPopup] = useState(false);
    const userData = getStoredUser();
    const fullName = userData ? `${userData.firstName} ${userData.lastName}` : '';

    return (
        <div className={`bg-white/70 backdrop-blur-xl mx-4 mt-4 h-14 flex items-center justify-between px-4 rounded-xl shadow-sm ${className || ''}`}>
            {/* Left: Sidebar toggle */}
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-xl hover:bg-gray-100/80 lg:hidden"
                    aria-label="Toggle sidebar"
                >
                    <FaBars className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-lg">
                    <div className="flex items-center bg-white/60 rounded-xl px-4 py-2 w-full"
                        style={{
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <FaSearch className="text-gray-400 w-5 h-5 flex-shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Filter & search Books, Users and Lendings"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none focus:outline-none ml-3 w-full text-base text-gray-700 font-medium placeholder:text-gray-400"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-2 text-gray-400 hover:text-gray-500"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                        <div className="flex items-center gap-2 ml-4">
                            <input
                                type="checkbox"
                                id="serverSearch"
                                checked={useServerSearch}
                                onChange={e => setUseServerSearch(e.target.checked)}
                                className="h-4 w-4 text-indigo-500 border-gray-300 rounded cursor-pointer transition-colors"
                            />
                            <label htmlFor="serverSearch" className="text-xs text-gray-600 cursor-pointer select-none whitespace-nowrap">
                                Database search
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Notifications & User */}
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
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">{fullName}</span>
                    </div>

                    {showUserPopup && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-100">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="font-medium text-gray-800">{fullName}</p>
                                <p className="text-sm text-gray-600">@{userData?.username}</p>
                                <p className="text-sm text-gray-600">{userData?.email}</p>
                            </div>
                            <div className="px-4 py-2">
                                <p className="text-sm text-gray-600">Role: {userData?.role}</p>
                                <p className="text-sm text-gray-600">Status: {userData?.isActive ? 'Active' : 'Inactive'}</p>
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


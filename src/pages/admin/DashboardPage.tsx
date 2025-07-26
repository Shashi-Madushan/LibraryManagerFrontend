import { useState } from 'react';
import { FaPlus, FaSearch, FaArrowRight } from 'react-icons/fa';
import { getUserByEmail } from '../../services/admin/UserManagementService';
import { getBookByName } from '../../services/admin/BookManagementService';
import { lendBook } from '../../services/admin/LendingManagementService';
import type { User } from '../../types/User';
import type { Book } from '../../types/Book';


const DashboardPage = () => {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isBookModalOpen, setIsBookModalOpen] = useState(false);

    const [searchUserTerm, setSearchUserTerm] = useState('');
    const [userResults, setUserResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [searchBookTerm, setSearchBookTerm] = useState('');
    const [bookResults, setBookResults] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [lendingDays, setLendingDays] = useState('');

    const [loadingUser, setLoadingUser] = useState(false);
    const [loadingBook, setLoadingBook] = useState(false);

    // Open user search modal
    const handleAddButtonClick = () => {
        setIsUserModalOpen(true);
        setSearchUserTerm('');
        setUserResults([]);
        setSelectedUser(null);
        setIsBookModalOpen(false);
        setSearchBookTerm('');
        setBookResults([]);
        setSelectedBook(null);
        setLendingDays('');
    };

    // User search using imported function
    const handleSearchUser = async () => {
        setLoadingUser(true);
        try {
            const term = searchUserTerm.trim();
            const result = await getUserByEmail(term);
            if (result) {
                setUserResults([result]);
            } else {
                setUserResults([]);
            }
        } catch (err) {
            alert('Error searching users.');
            setUserResults([]);
        } finally {
            setLoadingUser(false);
        }
    };
    // Select user and open book search modal
    const handleSelectUser = (user: User) => {
        setSelectedUser(user);
        setIsUserModalOpen(false);
        setIsBookModalOpen(true);
    };

    // Book search using imported function
    const handleSearchBook = async () => {
        setLoadingBook(true);
        try {
            const results = await getBookByName(searchBookTerm);
            if (!results || results.length === 0) {
                setBookResults([]);
            } else {
                setBookResults(results);
            }
        } catch (err) {
            alert('Error searching books.');
            setBookResults([]);
        } finally {
            setLoadingBook(false);
        }
    };

    // Select book
    const handleSelectBook = (book: Book) => {
        setSelectedBook(book);
    };

    // Lend book
    const handleLendBook = async () => {
        if (!selectedUser || !selectedBook || !lendingDays) return;
        try {
            const data = {
                userId: selectedUser._id,
                bookId: selectedBook._id,
                lendigTime: lendingDays,
            };
            await lendBook(data);
            alert(`Successfully lent "${selectedBook.title}" to ${selectedUser.email} for ${lendingDays} days.`);
        } catch (error) {
            alert('Failed to lend book. Please try again.');
        }
        setIsBookModalOpen(false);
        setSelectedUser(null);
        setSelectedBook(null);
        setLendingDays('');
    };

    return (
        <div className="p-6 max-h-screen bg-gray-50 relative">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Floating Add Button */}
            <button
                onClick={handleAddButtonClick}
                className="fixed right-8 bottom-8 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 flex items-center justify-center z-10 hover:scale-105 transition-transform"
                title="Add"
            >
                <FaPlus className="w-5 h-5 mr-2" />
                Lend A Book
            </button>

            {/* User Search Modal */}
            {isUserModalOpen && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setIsUserModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                            title="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Find User</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Search User</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchUserTerm}
                                    onChange={e => setSearchUserTerm(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleSearchUser();
                                    }}
                                    className="border rounded-lg px-3 py-2 w-full focus:outline-indigo-500"
                                    placeholder="Enter name or email"
                                />
                                <button
                                    onClick={handleSearchUser}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    disabled={loadingUser}
                                >
                                    <FaSearch className="mr-2" />
                                    Search
                                </button>
                            </div>
                        </div>
                        {loadingUser && (
                            <div className="flex justify-center items-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                                <span className="ml-2 text-indigo-600 text-sm">Searching...</span>
                            </div>
                        )}
                        {!loadingUser && userResults.length > 0 && (
                            <div className="mb-4">
                                <div className="text-sm mb-2 text-gray-600">Select a user:</div>
                                <ul className="max-h-40 overflow-y-auto pr-2">
                                    {userResults.map(user => (
                                        <li
                                            key={user._id}
                                            className="p-2 rounded-lg hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition"
                                            onClick={() => handleSelectUser(user)}
                                        >
                                            <span>
                                                <span className="font-semibold">{user.firstName} {user.lastName}</span>
                                                <span className="text-xs text-gray-500 ml-2">({user.email})</span>
                                            </span>
                                            <FaArrowRight className="ml-2 text-indigo-500" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!loadingUser && userResults.length === 0 && searchUserTerm.trim() && (
                            <div className="text-sm text-red-500 text-center py-2">No user found.</div>
                        )}
                    </div>
                </div>
            )}

            {/* Book Search & Lend Modal */}
            {isBookModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-10">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full relative">
                        <button
                            onClick={() => setIsBookModalOpen(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
                            title="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                            Lend Book to <span className="text-indigo-600">{selectedUser.email}</span>
                        </h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Search Book</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchBookTerm}
                                    onChange={e => setSearchBookTerm(e.target.value)}
                                    className="border rounded-lg px-3 py-2 w-full focus:outline-indigo-500"
                                    placeholder="Enter book title"
                                />
                                <button
                                    onClick={handleSearchBook}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                                    disabled={loadingBook}
                                >
                                    <FaSearch className="mr-2" />
                                    Search
                                </button>
                            </div>
                        </div>
                        {loadingBook && (
                            <div className="flex justify-center items-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
                                <span className="ml-2 text-indigo-600 text-sm">Searching...</span>
                            </div>
                        )}
                        {!loadingBook && bookResults.length > 0 && (
                            <div className="mb-4">
                                <div className="text-sm mb-2 text-gray-600">Select a book:</div>
                                <ul className="max-h-60 overflow-y-auto pr-2">
                                    {bookResults.map(book => (
                                        <li
                                            key={book._id}
                                            className={`p-2 rounded-lg hover:bg-indigo-50 cursor-pointer flex justify-between items-center transition ${selectedBook?._id === book._id ? 'bg-indigo-100' : ''}`}
                                            onClick={() => handleSelectBook(book)}
                                        >
                                            <div className="flex flex-col">
                                                <span className="font-semibold">{book.title}</span>
                                                <span className="text-xs text-gray-500">ISBN: {book.isbn}</span>
                                                <span className={`text-xs ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                                                    {book.available ? 'Available' : 'Not Available'}
                                                </span>
                                            </div>
                                            {selectedBook?._id === book._id && (
                                                <span className="text-xs text-green-600 ml-2">Selected</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!loadingBook && bookResults.length === 0 && searchBookTerm.trim() && (
                            <div className="text-sm text-red-500 text-center py-2">No book found.</div>
                        )}
                        {selectedBook && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium mb-1">Lending Days</label>
                                <input
                                    type="number"
                                    min={1}
                                    value={lendingDays}
                                    onChange={e => setLendingDays(e.target.value)}
                                    className="border rounded-lg px-3 py-2 w-full mb-4 focus:outline-indigo-500"
                                    placeholder="Enter number of days"
                                />
                                <button
                                    onClick={handleLendBook}
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    disabled={!lendingDays}
                                >
                                    Lend Book
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
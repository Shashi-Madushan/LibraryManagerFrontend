import React, { useEffect, useState } from 'react';
import { getAllBooks, addBook, updateBook, deleteBook } from '../../services/admin/BookManagementService';
import BookCard from '../../components/BookCard';
import BookListView from '../../components/BookListView';
import AddBookModal from '../../components/admin/AddBookModal';
import EditBookModal from '../../components/admin/EditBookModal';
import type { Book } from '../../types/Book';
import { FaBookOpen, FaPlus, FaThLarge, FaList, FaSearch } from 'react-icons/fa';

const BookManagement: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [useServerSearch, setUseServerSearch] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data);
                setFilteredBooks(data);
            } catch (err) {
                setError('Failed to fetch books');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Search and filter books
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredBooks(books);
            return;
        }

        const searchTermLower = searchTerm.toLowerCase();
        const filtered = books.filter((book) =>
            book.title.toLowerCase().includes(searchTermLower)
        );
        setFilteredBooks(filtered);
    }, [searchTerm, books]);

    const handleAddBook = async (formData: FormData) => {
        try {
            const newBook = await addBook(formData);
            setBooks(prevBooks => [...prevBooks, newBook]);
        } catch (err) {
            setError('Failed to add book');
            console.error(err);
        }
    };

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (id: string, formData: FormData) => {
        try {
            const updatedBook = await updateBook(id, formData);
            setBooks(prevBooks => 
                prevBooks.map(book => 
                    book._id === id ? updatedBook : book
                )
            );
        } catch (err) {
            setError('Failed to update book');
            console.error(err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        
        try {
            await deleteBook(id);
            setBooks(prevBooks => prevBooks.filter(book => book._id !== id));
        } catch (err) {
            setError('Failed to delete book');
            console.error(err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Book Management</h1>
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
                            aria-label="List view"
                        >
                            <FaList />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}
                            aria-label="Grid view"
                        >
                            <FaThLarge />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Search Section */}
            <div className="max-w-2xl mx-auto mb-6">
                <div className="bg-gray-50/80 rounded-2xl shadow-sm p-3">
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full max-w-xl">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search books..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl
                                leading-5 bg-white/80 placeholder-gray-400 focus:outline-none focus:border-blue-300 
                                focus:ring-0 text-sm transition-colors"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 rounded-xl border border-gray-200">
                            <input
                                type="checkbox"
                                id="serverSearch"
                                checked={useServerSearch}
                                onChange={(e) => setUseServerSearch(e.target.checked)}
                                className="h-4 w-4 text-blue-500 border-gray-300 
                                rounded cursor-pointer transition-colors"
                            />
                            <label htmlFor="serverSearch" className="text-xs text-gray-600 cursor-pointer select-none whitespace-nowrap">
                                Database search
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <FaBookOpen className="text-6xl text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No books to show</p>
                </div>
            ) : filteredBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <FaSearch className="text-6xl text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No matching books found</p>
                </div>
            ) : viewMode === 'list' ? (
                <BookListView 
                    books={filteredBooks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book._id}
                            book={book}
                            isAdmin={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
            
            <AddBookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddBook}
            />

            <EditBookModal
                book={selectedBook}
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedBook(null);
                }}
                onSubmit={handleUpdate}
            />

            {/* Add the floating action button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed right-8 bottom-8 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600  flex items-center justify-center z-50 hover:scale-110 transform transition-transform"
                title="Add New Book"
            >
                <FaPlus className="w-6 h-6" />
            </button>
        </div>
    );
};

export default BookManagement;


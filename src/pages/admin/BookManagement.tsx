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
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-grow sm:flex-grow-0 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors"
                    >
                        <FaPlus /> Add Book
                    </button>
                </div>
            </div>
            
            {/* Search Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg shadow">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by book name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="checkbox"
                            id="serverSearch"
                            checked={useServerSearch}
                            onChange={(e) => setUseServerSearch(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="serverSearch" className="text-sm text-gray-700">
                            Search from database
                        </label>
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
        </div>
    );
};

export default BookManagement;


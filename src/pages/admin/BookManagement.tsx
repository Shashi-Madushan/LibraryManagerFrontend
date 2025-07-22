import React, { useEffect, useState } from 'react';
import { getAllBooks, addBook, updateBook, deleteBook } from '../../services/admin/BookManagementService';
import BookCard from '../../components/BookCard';
import BookListView from '../../components/BookListView';
import AddBookModal from '../../components/admin/AddBookModal';
import EditBookModal from '../../components/admin/EditBookModal';
import type { Book } from '../../types/Book';
import { FaBookOpen, FaPlus, FaThLarge, FaList } from 'react-icons/fa';

const BookManagement: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await getAllBooks();
                setBooks(data);
            } catch (err) {
                setError('Failed to fetch books');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

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
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
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

            {books.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <FaBookOpen className="text-6xl text-gray-400 mb-4" />
                    <p className="text-xl text-gray-500">No books to show</p>
                </div>
            ) : viewMode === 'list' ? (
                <BookListView 
                    books={books}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {books.map((book) => (
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


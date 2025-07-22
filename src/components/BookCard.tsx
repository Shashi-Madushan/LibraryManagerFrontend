import React from 'react';
import type { Book } from '../types/Book';

interface BookCardProps {
    book: Book;
    onEdit?: (book: Book) => void;
    onDelete?: (isbn: string) => void;
    isAdmin?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, isAdmin = false }) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden">
            {book.imageUrl && (
                <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                   
                />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-1">Author: {book.author}</p>
                <p className="text-gray-600 mb-1">Category: {book.category}</p>
                <p className="text-gray-600 mb-1">
                    Status: {book.available ? (
                        <span className="text-green-600">Available</span>
                    ) : (
                        <span className="text-red-600">Not Available</span>
                    )}
                </p>
                <p className="text-gray-600 mb-2">Total Copies: {book.totalCopies}</p>
                
                {isAdmin && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => onEdit && onEdit(book)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete && onDelete(book._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
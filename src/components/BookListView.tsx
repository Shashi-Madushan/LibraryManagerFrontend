import React from 'react';
import type { Book } from '../types/Book';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface BookListViewProps {
    books: Book[];
    onEdit?: (book: Book) => void;
    onDelete?: (id: string) => void;
}

const BookListView: React.FC<BookListViewProps> = ({ books, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Copies</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {books.map((book) => (
                        <tr key={book._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-col">
                                    <span className="font-medium">{book.title}</span>
                                    <span className="text-xs text-gray-500">{book.isbn}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{book.author}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{book.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                    {book.available ? 'Available' : 'Not Available'}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{book.totalCopies}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit?.(book)}
                                        className="text-yellow-500 hover:text-yellow-600"
                                    >
                                        <FaEdit size={18} />
                                    </button>
                                    <button
                                        onClick={() => onDelete?.(book._id)}
                                        className="text-red-500 hover:text-red-600"
                                    >
                                        <FaTrash size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookListView;

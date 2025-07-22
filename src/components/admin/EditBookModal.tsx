import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import type { Book } from '../../types/Book';

interface EditBookModalProps {
    book: Book | null;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (id: string, formData: FormData) => Promise<void>;
}

const EditBookModal: React.FC<EditBookModalProps> = ({ book, isOpen, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (book?.imageUrl) {
            setImagePreview(book.imageUrl);
        }
    }, [book]);

    if (!isOpen || !book) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.currentTarget);
        try {
            await onSubmit(book._id, formData);
            onClose();
        } catch (error) {
            console.error('Error updating book:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-lg p-6 w-full max-w-md z-10 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <IoClose size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">Edit Book</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            defaultValue={book.title}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            defaultValue={book.author}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            defaultValue={book.category}
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Total Copies</label>
                        <input
                            type="number"
                            name="totalCopies"
                            defaultValue={book.totalCopies}
                            required
                            min="1"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Book Cover</label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 w-32 h-32 object-cover rounded"
                            />
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-yellow-300"
                    >
                        {loading ? 'Updating...' : 'Update Book'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditBookModal;

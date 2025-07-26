import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface AddBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        const formData = new FormData(e.currentTarget);
        try {
            await onSubmit(formData);
            onClose();
            e.currentTarget.reset();
            setImagePreview(null);
        } catch (error) {
            console.error('Error adding book:', error);
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-10 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <IoClose size={24} />
                </button>
                
                <h2 className="text-2xl font-bold mb-6">Add New Book</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Author</label>
                        <input
                            type="text"
                            name="author"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">ISBN</label>
                        <input
                            type="text"
                            name="isbn"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <input
                            type="text"
                            name="category"
                            required
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Total Copies</label>
                        <input
                            type="number"
                            name="totalCopies"
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
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors disabled:bg-blue-300"
                    >
                        {loading ? 'Adding...' : 'Add Book'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;

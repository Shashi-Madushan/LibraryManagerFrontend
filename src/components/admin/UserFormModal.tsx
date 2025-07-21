import { useState, useEffect } from 'react';
import type { User } from '../../types/User';
import { FaTimes } from 'react-icons/fa';


export type UserWithPassword = User & {
    password: string;
}

interface UserFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (userData: Partial<UserWithPassword>) => Promise<void>;
    user?: UserWithPassword;
    mode: 'add' | 'edit';
}

const UserFormModal = ({ isOpen, onClose, onSubmit, user, mode }: UserFormModalProps) => {
    const [formData, setFormData] = useState<Partial<UserWithPassword>>({
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        role: 'user',
        isActive: true,
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && mode === 'edit') {
            setFormData({
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                isActive: user.isActive,
                password: user.password
            });
        } else {
            // Reset form for new user
            setFormData({
                email: '',
                username: '',
                firstName: '',
                lastName: '',
                role: 'user',
                isActive: true,
                password: '' // Reset password for new user
            });
        }
    }, [user, mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Remove password field if empty or in edit mode
            const submissionData = {...formData};
            if (mode === 'edit' || !submissionData.password) {
                delete submissionData.password;
            }
            await onSubmit(submissionData);
            onClose();
        } catch (err) {
            setError('Failed to save user data');
            console.error('Error saving user:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md p-8 relative shadow-xl transform transition-all">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {mode === 'add' ? 'Add New User' : 'Edit User'}
                </h2>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={mode === 'edit'}
                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 text-sm h-11 px-4"
                            required
                        />
                    </div>

                    {mode === 'edit' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4"
                            required
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">Active</label>
                    </div>

                    {mode === 'add' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-11 px-4"
                                required={mode === 'add'}
                                minLength={6}
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                        >
                            {loading ? 'Saving...' : mode === 'add' ? 'Add User' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserFormModal;

import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaBookOpen, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BiLoader } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/AuthService';

interface LoginForm {
    email: string;
    password: string;
}

const LoginSVG = () => (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-h-80">
        {/* Simple login/secure illustration */}
        <rect x="50" y="100" width="300" height="200" rx="30" fill="#6366f1" />
        <circle cx="200" cy="180" r="40" fill="#fff" />
        <rect x="150" y="230" width="100" height="20" rx="10" fill="#fff" />
        <rect x="180" y="260" width="40" height="20" rx="10" fill="#fff" />
        <circle cx="200" cy="180" r="18" fill="#6366f1" />
        <rect x="120" y="70" width="160" height="30" rx="15" fill="#a5b4fc" />
    </svg>
);

const LogIn: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<LoginForm>({
        email: '',
        password: ''
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Partial<LoginForm>>({});

    const validateForm = (): boolean => {
        const errors: Partial<LoginForm> = {};
        
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.password) errors.password = 'Password is required';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (fieldErrors[name as keyof LoginForm]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
                {/* SVG/Text Side */}
                <div className="hidden md:flex flex-col justify-center items-center bg-indigo-50 w-1/2 p-8">
                    <h2 className="text-4xl font-extrabold text-indigo-800 tracking-tight mb-2 font-serif">Welcome Back!</h2>
                    <p className="text-lg text-indigo-600 mb-8 text-center font-medium">Access your library and continue your reading journey.</p>
                    <LoginSVG />
                </div>
                {/* Form Side */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
                    {/* Header */}
                    <div className="text-center mb-8 md:hidden">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
                            <FaBookOpen className="text-white text-2xl" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-indigo-800 tracking-tight mb-2 font-serif">Welcome Back</h1>
                        <p className="text-lg text-indigo-600 mb-8 font-medium">Log in to access your library account</p>
                        <LoginSVG />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                                        fieldErrors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                                        fieldErrors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <BiLoader className="animate-spin text-xl" />
                                    Logging in...
                                </>
                            ) : (
                                'Log In'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;


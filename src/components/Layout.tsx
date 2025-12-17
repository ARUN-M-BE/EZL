import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, User, LayoutDashboard, Menu, X, Users } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useBooking(); // Using global auth state (extended BookingContext)

    // Helper to handle logout
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const links = [
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Learners', path: '/learners', icon: User },
        { name: 'Instructors', path: '/instructors', icon: Users },
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-brand-600 text-white p-1.5 rounded-lg mr-2">
                            <MapPin size={24} />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">EzLicence Explorer</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        {links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center text-sm font-medium transition-colors hover:text-brand-600 ${location.pathname === link.path ? 'text-brand-600' : 'text-gray-500'}`}
                            >
                                <link.icon size={16} className="mr-1.5" />
                                {link.name}
                            </Link>
                        ))}

                        {/* Auth Buttons */}
                        {user ? (
                            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                                {user.role === 'admin' && (
                                    <Link to="/admin" className="text-sm font-bold text-purple-600 hover:text-purple-700">Admin</Link>
                                )}
                                <span className="text-sm font-bold text-gray-700">Hi, {user.name.split(' ')[0]}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                                <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-brand-600">Login</Link>
                                <Link to="/register" className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-700">
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {links.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
                            >
                                <div className="flex items-center">
                                    <link.icon size={18} className="mr-3" />
                                    {link.name}
                                </div>
                            </Link>
                        ))}
                        <div className="border-t border-gray-100 mt-2 pt-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm font-bold text-gray-900">Signed in as {user.name}</div>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="block w-full text-left px-3 py-2 text-red-600 font-medium hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-gray-700 font-medium">Login</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-brand-600 font-bold">Register Now</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                    <h4 className="text-white font-bold mb-4">Discover</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/search" className="hover:text-white">Find Instructor</Link></li>
                        <li><Link to="/test-centres" className="hover:text-white">Test Centres</Link></li>
                        <li><Link to="/vouchers" className="hover:text-white">Vouchers</Link></li>
                        <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/faqs" className="hover:text-white">FAQs</Link></li>
                        <li><Link to="/safety" className="hover:text-white">Safety Info</Link></li>
                        <li><Link to="/gov-info" className="hover:text-white">Gov & Keys2Drive</Link></li>
                        <li><Link to="/reviews" className="hover:text-white">Reviews</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                        <li><Link to="/instructors" className="hover:text-white">Join Team</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-4">EzLicence</h4>
                    <p className="text-sm text-gray-500">
                        Making learning to drive simple, safe, and stress-free.
                    </p>
                </div>
            </div>
        </footer>
    )
}

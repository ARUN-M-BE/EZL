import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Search, DollarSign, User, CheckCircle, Clock } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { ReviewModal } from '../components/ReviewModal';
import { ProfileEditor } from '../components/ProfileEditor';
import { Review, Booking } from '../../types';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user: contextUser } = useBooking();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [progress, setProgress] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('overview'); // overview, history, profile

    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            let userId = contextUser?.id;

            if (!userId) {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) {
                    navigate('/login');
                    return;
                }
                userId = JSON.parse(storedUser).id;
            }

            try {
                // Fetch full user profile
                const userRes = await fetch(`http://localhost:3001/api/users/${userId}`);
                const userData = await userRes.json();
                setUser(userData);

                // Fetch Bookings (learner or instructor)
                let bookingData = [];
                if (userData.role === 'learner') {
                    const bookingRes = await fetch(`http://localhost:3001/api/bookings/user/${userId}`);
                    bookingData = await bookingRes.json();
                } else if (userData.role === 'instructor') {
                    const bookingRes = await fetch(`http://localhost:3001/api/bookings/instructor/${userId}`);
                    bookingData = await bookingRes.json();
                }
                setBookings(bookingData);

                // Fetch Progress (only for learners)
                if (userData.role === 'learner') {
                    const progressRes = await fetch(`http://localhost:3001/api/progress/${userId}`);
                    const progressData = await progressRes.json();
                    setProgress(progressData);
                }

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            }
        };

        fetchUserData();
    }, [navigate, contextUser]);

    const handleUpdateProfile = async (updates: any) => {
        try {
            await fetch(`http://localhost:3001/api/users/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            setUser({ ...user, ...updates });
            alert('Profile updated successfully!');
        } catch (err) {
            alert('Failed to update profile');
        }
    };

    const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
        try {
            await fetch(`http://localhost:3001/api/bookings/${bookingId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            // Refresh bookings
            const bookingRes = await fetch(`http://localhost:3001/api/bookings/instructor/${user.id}`);
            const bookingData = await bookingRes.json();
            setBookings(bookingData);

            if (status === 'completed') {
                alert('Lesson marked as complete!');
            }
        } catch (err) {
            console.error('Failed to update booking status', err);
            alert('Failed to update booking status');
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        try {
            await fetch(`http://localhost:3001/api/bookings/${bookingId}/accept`, {
                method: 'PUT'
            });
            // Refresh bookings
            const bookingRes = await fetch(`http://localhost:3001/api/bookings/instructor/${user.id}`);
            const bookingData = await bookingRes.json();
            setBookings(bookingData);
            alert('Booking accepted! Learner will be notified.');
        } catch (err) {
            console.error('Failed to accept booking', err);
            alert('Failed to accept booking');
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to reject this booking?')) return;

        try {
            await fetch(`http://localhost:3001/api/bookings/${bookingId}/reject`, {
                method: 'PUT'
            });
            // Refresh bookings
            const bookingRes = await fetch(`http://localhost:3001/api/bookings/instructor/${user.id}`);
            const bookingData = await bookingRes.json();
            setBookings(bookingData);
            alert('Booking rejected.');
        } catch (err) {
            console.error('Failed to reject booking', err);
            alert('Failed to reject booking');
        }
    };

    const handleCompleteLesson = (booking: any) => {
        setSelectedBooking(booking);
        setIsReviewOpen(true);
    };

    const submitReview = async (rating: number, comment: string) => {
        if (!selectedBooking) return;
        try {
            await fetch('http://localhost:3001/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: selectedBooking.id,
                    instructor_id: selectedBooking.instructor_id,
                    learner_id: user.id,
                    rating,
                    comment
                })
            });
            setIsReviewOpen(false);
            alert('Review submitted! Thank you.');
            // Update booking status to completed
            await handleUpdateBookingStatus(selectedBooking.id, 'completed');
        } catch (err) {
            console.error("Review failed", err);
        }
    };

    if (!user) return <div className="p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
                    <div className="bg-brand-100 text-brand-800 px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wide inline-block mt-2">
                        {user.role} Dashboard
                    </div>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    {['Overview', 'History', 'Profile'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.toLowerCase() ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'profile' ? (
                <ProfileEditor user={user} onSave={handleUpdateProfile} />
            ) : activeTab === 'history' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="font-bold text-xl">Booking History</h2>
                    </div>
                    {bookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Instructor</th>
                                        <th className="p-4">Vehicle</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map(b => (
                                        <tr key={b.id}>
                                            <td className="p-4">{new Date(b.date).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium">{b.instructor_name}</td>
                                            <td className="p-4 text-gray-500">{b.vehicle || 'N/A'}</td>
                                            <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs uppercase font-bold">{b.status}</span></td>
                                            <td className="p-4">
                                                {b.status !== 'completed' && (
                                                    <button onClick={() => handleCompleteLesson(b)} className="text-brand-600 hover:underline text-sm font-bold">
                                                        End Session
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">No history found.</div>
                    )}
                </div>
            ) : (
                // Overview Tab
                <div className="grid lg:grid-cols-3 gap-8">
                    {user.role === 'learner' ? (
                        <>
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="text-brand-600" /> Upcoming Lessons</h2>
                                    {bookings.filter(b => b.status === 'confirmed' && b.accepted === 1).length > 0 ? (
                                        <div className="space-y-4">
                                            {bookings.filter(b => b.status === 'confirmed' && b.accepted === 1).slice(0, 3).map(b => (
                                                <div key={b.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                    <div>
                                                        <div className="font-bold text-lg">{new Date(b.date).toLocaleDateString()}</div>
                                                        <div className="text-gray-500">with {b.instructor_name}</div>
                                                        <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                            CONFIRMED
                                                        </span>
                                                    </div>
                                                    <button onClick={() => handleCompleteLesson(b)} className="bg-white border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-50 font-medium">
                                                        Start / End
                                                    </button>
                                                </div>
                                            ))}
                                            {bookings.filter(b => b.accepted === 0).length > 0 && (
                                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                    <p className="text-sm font-bold text-yellow-900">
                                                        🕐 {bookings.filter(b => b.accepted === 0).length} booking(s) pending instructor approval
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                            <p>No upcoming lessons booked.</p>
                                            <Link to="/search" className="text-brand-600 font-bold hover:underline mt-2 inline-block">Book your next lesson</Link>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
                                    <div className="space-y-4">
                                        {progress.length > 0 ? progress.map((p, idx) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-sm mb-1"><span>{p.skill}</span><span className="font-bold">{p.percentage}%</span></div>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand-500 transition-all duration-1000" style={{ width: `${p.percentage}%` }}></div></div>
                                            </div>
                                        )) : <p className="text-gray-500">No progress tracked yet.</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
                                    <div className="space-y-2">
                                        <Link to="/search" className="block w-full text-center py-2 bg-brand-600 text-white rounded hover:bg-brand-700">Book Lesson</Link>
                                        <button onClick={() => setActiveTab('history')} className="block w-full text-center py-2 border border-gray-300 rounded hover:bg-gray-50">View History</button>
                                        <button onClick={() => setActiveTab('profile')} className="block w-full text-center py-2 border border-gray-300 rounded hover:bg-gray-50">Edit Profile</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        // Instructor Overview
                        <div className="lg:col-span-3 space-y-6">
                            {/* Pending Bookings Section */}
                            {bookings.filter(b => b.accepted === 0).length > 0 && (
                                <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl shadow-sm">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                            {bookings.filter(b => b.accepted === 0).length} Pending
                                        </span>
                                        <h2 className="text-xl font-bold text-orange-900">New Booking Requests</h2>
                                    </div>

                                    <div className="space-y-3">
                                        {bookings.filter(b => b.accepted === 0).map(booking => (
                                            <div key={booking.id} className="bg-white border border-orange-300 rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-lg">{booking.learner_name}</p>
                                                        <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} - {new Date(booking.date).toLocaleTimeString()}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptBooking(booking.id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 font-bold"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectBooking(booking.id)}
                                                            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 font-bold"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Accepted Bookings Section */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">My Lessons</h2>
                                    <button onClick={() => setActiveTab('profile')} className="text-sm bg-brand-600 text-white px-4 py-2 rounded hover:bg-brand-700">Edit Profile</button>
                                </div>

                                {bookings.filter(b => b.accepted === 1).length > 0 ? (
                                    <div className="space-y-3">
                                        {bookings.filter(b => b.accepted === 1).map(booking => (
                                            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-brand-300 transition">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-lg">{booking.learner_name}</p>
                                                        <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} - {new Date(booking.date).toLocaleTimeString()}</p>
                                                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                            booking.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                                                                booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {booking.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {booking.status === 'confirmed' && (
                                                            <button
                                                                onClick={() => handleUpdateBookingStatus(booking.id, 'in-progress')}
                                                                className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                                                            >
                                                                Start
                                                            </button>
                                                        )}
                                                        {booking.status === 'in-progress' && (
                                                            <button
                                                                onClick={() => handleUpdateBookingStatus(booking.id, 'completed')}
                                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                                                            >
                                                                Complete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                        <p>No lessons scheduled yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ReviewModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
                onSubmit={submitReview}
                instructorName={selectedBooking?.instructor_name || 'Instructor'}
            />
        </div>
    );
};

export default Dashboard;

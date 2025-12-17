import React, { useEffect, useState } from 'react';
import { Calendar, User, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';

const AdminBookings = () => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/bookings/all');
            const data = await res.json();
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string, learnerName: string) => {
        if (!confirm(`Delete booking for ${learnerName}?`)) return;

        try {
            // Note: Delete endpoint would need to be added to backend
            const res = await fetch(`http://localhost:3001/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Booking deleted successfully');
                fetchBookings();
            } else {
                alert('Failed to delete booking');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete booking');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: any = {
            'confirmed': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'CONFIRMED' },
            'in-progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'IN PROGRESS' },
            'completed': { bg: 'bg-green-100', text: 'text-green-700', label: 'COMPLETED' },
            'cancelled': { bg: 'bg-red-100', text: 'text-red-700', label: 'CANCELLED' }
        };
        const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status.toUpperCase() };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
                {style.label}
            </span>
        );
    };

    const getAcceptanceBadge = (accepted: number) => {
        if (accepted === 1) {
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">ACCEPTED</span>;
        } else if (accepted === -1) {
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">REJECTED</span>;
        } else {
            return <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">PENDING</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-indigo-600 text-white p-3 rounded-lg">
                        <Calendar size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
                        <p className="text-gray-500">View and manage all platform bookings</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-bold text-xl">All Bookings ({bookings.length})</h2>
                        <div className="text-sm text-gray-500">
                            Pending: {bookings.filter(b => b.accepted === 0).length} |
                            Accepted: {bookings.filter(b => b.accepted === 1).length}
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-gray-500">Loading bookings...</div>
                    ) : bookings.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No bookings found</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-sm">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Learner</th>
                                        <th className="p-4">Instructor</th>
                                        <th className="p-4">Vehicle</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Acceptance</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {bookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    {new Date(booking.date).toLocaleDateString()}
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(booking.date).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-gray-400" />
                                                    {booking.learner_name}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <Users size={16} className="text-gray-400" />
                                                    {booking.instructor_name}
                                                </div>
                                            </td>
                                            <td className="p-4 text-gray-600">{booking.vehicle || '-'}</td>
                                            <td className="p-4">{getStatusBadge(booking.status)}</td>
                                            <td className="p-4">{getAcceptanceBadge(booking.accepted)}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDeleteBooking(booking.id, booking.learner_name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Delete booking"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;

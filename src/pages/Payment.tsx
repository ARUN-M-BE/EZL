import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

const Payment = () => {
    const { booking, user } = useBooking();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handlePayment = async () => {
        if (!user) {
            alert("Please login to complete booking");
            navigate('/login');
            return;
        }

        if (!booking.instructor || !booking.package) {
            alert("No booking details found");
            navigate('/search');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    learner_id: user.id,
                    instructor_id: booking.instructor.id,
                    date: booking.date || new Date().toISOString(), // Fallback date if not set
                    package_id: booking.package.id
                })
            });

            if (res.ok) {
                // Booking successful
                navigate('/dashboard');
            } else {
                alert("Booking failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Secure Payment</h2>
                <p className="text-gray-500 mb-8">This is a demo application. Click below to simulate payment.</p>
                <div className="space-y-4">
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Pay with Apple Pay"}
                    </button>
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full border border-gray-300 py-3 rounded-lg font-bold text-gray-700 disabled:opacity-50"
                    >
                        Pay with Credit Card
                    </button>
                </div>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="block w-full mt-6 text-brand-600 text-sm hover:underline"
                >
                    Cancel / Skip
                </button>
            </div>
        </div>
    )
}

export default Payment;

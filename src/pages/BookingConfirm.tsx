import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';

const BookingConfirm = () => {
    const { booking } = useBooking();
    const navigate = useNavigate();

    if (!booking.instructor || !booking.package) {
        return <div className="p-12 text-center">Please select an instructor and package first. <Link to="/search" className="text-brand-600 underline">Search</Link></div>
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Confirm Booking</h1>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="font-bold text-lg">Booking Summary</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex gap-4 items-center">
                        <img src={booking.instructor.image} className="w-16 h-16 rounded-full" />
                        <div>
                            <p className="text-sm text-gray-500">Instructor</p>
                            <p className="font-bold text-lg">{booking.instructor.name}</p>
                            <p className="text-sm text-gray-600">{booking.instructor.vehicle}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Package</p>
                            <p className="font-bold">{booking.package.name}</p>
                            <p className="text-sm">{booking.package.lessons} Lessons</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Cost</p>
                            <p className="font-bold text-xl text-brand-600">${booking.package.price}</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50">
                    <button
                        onClick={() => navigate('/payment')}
                        className="w-full bg-brand-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-700 transition shadow-lg"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookingConfirm;

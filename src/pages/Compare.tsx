import React from 'react';
import { X } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { PerformanceRadar } from '../components/Charts';

const Compare = () => {
    const { comparisonList, removeFromCompare } = useBooking();

    if (comparisonList.length === 0) {
        return <div className="p-8 text-center text-gray-500">No instructors selected for comparison.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Compare Instructors</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {comparisonList.map(instructor => (
                    <div key={instructor.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
                        <button
                            onClick={() => removeFromCompare(instructor.id)}
                            className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-red-100 text-gray-500 hover:text-red-600"
                        >
                            <X size={16} />
                        </button>
                        <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
                            <img src={instructor.image} className="w-16 h-16 rounded-full" />
                            <div>
                                <h3 className="font-bold">{instructor.name}</h3>
                                <p className="text-sm text-gray-500">{instructor.location}</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-gray-500">Price</div>
                                <div className="font-bold">${instructor.price}/hr</div>
                                <div className="text-gray-500">Vehicle</div>
                                <div>{instructor.vehicle}</div>
                                <div className="text-gray-500">Rating</div>
                                <div className="text-yellow-600 font-bold">{instructor.rating} ★</div>
                            </div>
                            <div className="h-48 border-t border-gray-100 pt-4">
                                <p className="text-xs text-center text-gray-400 mb-2">Performance Profile</p>
                                <PerformanceRadar data={instructor.performance} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Compare;

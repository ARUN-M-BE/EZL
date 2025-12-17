import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { MOCK_PACKAGES, Package } from '../../types';
import { useBooking } from '../context/BookingContext';
import { PricingBarChart } from '../components/Charts';

const Pricing = () => {
    const { setBooking, booking } = useBooking();
    const navigate = useNavigate();

    const handleSelect = (pkg: Package) => {
        setBooking(prev => ({ ...prev, package: pkg }));
        navigate('/booking-confirm');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-center mb-4">Choose Your Package</h1>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
                Save up to 10% when you bundle lessons. Packages are valid for 3 years.
            </p>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BarChart3 /> Price Efficiency Calculator</h3>
                        <PricingBarChart packages={MOCK_PACKAGES} />
                        <p className="text-xs text-gray-400 mt-2 text-center">Based on standard hourly rate of $75/hr</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {MOCK_PACKAGES.map(pkg => (
                        <div
                            key={pkg.id}
                            onClick={() => handleSelect(pkg)}
                            className={`bg-white border p-6 rounded-xl cursor-pointer transition-all hover:border-brand-500 hover:shadow-md flex justify-between items-center ${booking.package?.id === pkg.id ? 'border-brand-500 ring-2 ring-brand-100' : 'border-gray-200'}`}
                        >
                            <div>
                                <h3 className="font-bold text-lg">{pkg.name}</h3>
                                <p className="text-sm text-gray-500">{pkg.lessons} Lesson{pkg.lessons > 1 ? 's' : ''}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">${pkg.price}</div>
                                {pkg.discount > 0 && <div className="text-xs text-green-600 font-medium">Save {pkg.discount}%</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Pricing;

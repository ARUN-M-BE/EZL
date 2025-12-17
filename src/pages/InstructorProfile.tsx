import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Star, Shield, Award, Languages, Globe } from 'lucide-react';
import { Instructor } from '../../types';
import { useBooking } from '../context/BookingContext';
import { PerformanceRadar } from '../components/Charts';

const InstructorProfile = () => {
    const { id } = useParams();
    const [instructor, setInstructor] = useState<any>(null); // Use any to support new fields
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { setBooking } = useBooking();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            Promise.all([
                fetch(`http://localhost:3001/api/instructors/${id}`).then(res => res.json()),
                fetch(`http://localhost:3001/api/instructors/${id}/reviews`).then(res => res.json())
            ])
                .then(([instData, reviewData]) => {
                    setInstructor(instData);
                    setReviews(reviewData);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch instructor data", err);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleBook = () => {
        if (instructor) {
            setBooking(prev => ({ ...prev, instructor }));
            navigate('/pricing');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading instructor profile...</div>;
    if (!instructor) return <div className="p-8 text-center">Instructor not found.</div>;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <img src={instructor.image} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" alt={instructor.name} />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold mb-2">{instructor.name}</h1>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                <span className="flex items-center gap-1"><MapPin size={16} /> {instructor.location}</span>
                                <span className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> {instructor.rating} ({instructor.reviews} reviews)</span>
                                <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-medium">{instructor.vehicle}</span>
                            </div>

                            {/* New Chips for Extended Profile */}
                            <div className="flex gap-2 mb-4">
                                {instructor.languages && (
                                    <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"><Languages size={14} /> {instructor.languages}</span>
                                )}
                                {instructor.experience && (
                                    <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded"><Award size={14} /> {instructor.experience} Years Exp.</span>
                                )}
                            </div>

                            <p className="max-w-2xl text-gray-700">{instructor.bio}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center min-w-[200px]">
                            <p className="text-gray-500 text-sm mb-1">Hourly Rate</p>
                            <p className="text-3xl font-bold text-gray-900 mb-4">${instructor.price}</p>
                            <button onClick={handleBook} className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md transform transition hover:-translate-y-0.5">
                                Book Lesson
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Instructor Performance</h2>
                        <PerformanceRadar data={instructor.performance} />
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h2 className="text-xl font-bold mb-6">Student Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map(review => (
                                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold">{review.author_name || 'Student'}</span>
                                            <span className="text-gray-400 text-sm">{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex text-yellow-400 text-xs mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-300"} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-8">No reviews yet.</div>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-4">Certifications</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2"><Shield size={16} className="text-green-600" /> Working with Children Check</li>
                            <li className="flex items-center gap-2"><Shield size={16} className="text-green-600" /> Dual Control Certified</li>
                            <li className="flex items-center gap-2"><Shield size={16} className="text-green-600" /> Certificate IV in Transport</li>
                            {instructor.licence_number && (
                                <li className="pt-2 border-t mt-2 text-xs text-gray-400">Licence No: {instructor.licence_number}</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorProfile;


import React, { useState, useEffect } from 'react';
import { MapPin, User } from 'lucide-react';
import { Learner } from '../../types';

const Learners = () => {
    const [learners, setLearners] = useState<Learner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/learners')
            .then(res => res.json())
            .then(data => {
                setLearners(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch learners", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Community Learners</h1>
                        <p className="text-gray-500">Meet {learners.length} other learners on their journey</p>
                    </div>
                </div>

                {loading ? <div className="p-8 text-center text-gray-500">Loading learners...</div> : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {learners.map(learner => (
                            <div key={learner.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                            {learner.image ? (
                                                <img src={learner.image} alt={learner.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">{learner.name}</h3>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <MapPin size={14} className="mr-1" />
                                                <span>{learner.location || 'Unknown Location'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {learner.transmission_preference && (
                                        <div className="mb-4">
                                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                                                {learner.transmission_preference} Learner
                                            </span>
                                        </div>
                                    )}

                                    <p className="text-gray-600 text-sm line-clamp-3">
                                        {learner.bio || 'No bio available yet.'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Learners;

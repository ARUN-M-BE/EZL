import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Filter, Menu, Map as MapIcon, Star, MapPin, BarChart3 } from 'lucide-react';
import { Instructor, TEST_CENTRES } from '../../types';
import { useBooking } from '../context/BookingContext';
import { CoverageMap } from '../components/Charts';

const Search = () => {
    const [filters, setFilters] = useState({ vehicle: 'All', sort: 'Rating' });
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const { addToCompare, comparisonList } = useBooking();
    const navigate = useNavigate();

    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/api/instructors')
            .then(res => res.json())
            .then(data => {
                setInstructors(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch instructors", err);
                setLoading(false);
            });
    }, []);

    const filteredInstructors = instructors.filter(i =>
        filters.vehicle === 'All' || i.vehicle === filters.vehicle
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Find an Instructor</h1>
                        <p className="text-gray-500">Showing {filteredInstructors.length} results near Sydney</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-brand-100 text-brand-700' : 'bg-white text-gray-500'}`}
                        >
                            <Menu size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded ${viewMode === 'map' ? 'bg-brand-100 text-brand-700' : 'bg-white text-gray-500'}`}
                        >
                            <MapIcon size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Filters */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm h-fit">
                        <div className="flex items-center gap-2 mb-6 font-bold text-lg">
                            <Filter size={20} /> Filters
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                            <select
                                value={filters.vehicle}
                                onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border"
                            >
                                <option value="All">All Types</option>
                                <option value="Auto">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                            <select className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2 border">
                                <option>Highest Rated</option>
                                <option>Price: Low to High</option>
                                <option>Most Reviews</option>
                            </select>
                        </div>

                        {comparisonList.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h3 className="font-bold mb-3">Compare ({comparisonList.length})</h3>
                                <button
                                    onClick={() => navigate('/compare')}
                                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700"
                                >
                                    View Comparison
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3">
                        {loading ? <div className="p-8 text-center text-gray-500">Loading instructors...</div> :
                            viewMode === 'map' ? (
                                <div className="bg-white p-4 rounded-xl shadow-sm">
                                    <h3 className="font-bold mb-4">Coverage & Test Centres</h3>
                                    <CoverageMap instructors={filteredInstructors} testCentres={TEST_CENTRES} />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {filteredInstructors.map(instructor => (
                                        <div key={instructor.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                                            <div className="flex p-4 gap-4">
                                                <img src={instructor.image} alt={instructor.name} className="w-20 h-20 rounded-full object-cover" />
                                                <div>
                                                    <h3 className="font-bold text-lg">{instructor.name}</h3>
                                                    <div className="flex items-center text-yellow-500 text-sm mb-1">
                                                        <Star size={14} fill="currentColor" />
                                                        <span className="ml-1 text-gray-700 font-semibold">{instructor.rating}</span>
                                                        <span className="text-gray-400 mx-1">•</span>
                                                        <span className="text-gray-500">{instructor.reviews} reviews</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                                        <MapPin size={14} /> {instructor.location}
                                                    </p>
                                                    <span className={`inline-block mt-2 text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium`}>
                                                        {instructor.vehicle}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="px-4 pb-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{instructor.bio}</p>
                                                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                                                    <div className="font-bold text-xl">${instructor.price}<span className="text-sm text-gray-500 font-normal">/hr</span></div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => addToCompare(instructor)}
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                            title="Add to Compare"
                                                        >
                                                            <BarChart3 size={20} />
                                                        </button>
                                                        <Link to={`/instructor/${instructor.id}`} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                                            View Profile
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;

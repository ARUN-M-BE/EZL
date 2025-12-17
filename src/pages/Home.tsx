import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, User, Calendar, Shield, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { TEST_CENTRES } from '../../types';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            {/* Hero */}
            <section className="bg-gradient-to-br from-brand-600 to-brand-900 text-white py-20 lg:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=5')] opacity-10 bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        Master the Road with Confidence
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-100 mb-10 max-w-3xl mx-auto">
                        Find the perfect driving instructor in your area. Compare ratings, check real-time availability, and book instantly.
                    </p>

                    <div className="flex justify-center gap-4 mb-8">
                        <Link to="/search" className="bg-white text-brand-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                            Find Instructor
                        </Link>
                        <Link to="/register" className="bg-brand-500 border border-brand-400 text-white px-8 py-3 rounded-full font-bold hover:bg-brand-400 transition shadow-lg">
                            Sign Up Now
                        </Link>
                    </div>
                </div>
            </section>

            {/* Safety & Traffic Rules Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-brand-600 font-bold tracking-wide uppercase text-sm">Road Safety First</span>
                        <h2 className="text-3xl font-bold mt-2">How to Drive Safe & Follow Traffic Rules</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Learning to drive isn't just about passing the test. It's about keeping yourself and others safe on the road. Here are the core principles we teach.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Rule 1 */}
                        <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Defensive Driving</h3>
                            <p className="text-gray-600 mb-4">Always anticipate potential hazards. Keep a safe following distance (3-second rule) and scan your surroundings constantly.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Scan mirrors every 8-10 secs</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Leave usage space for errors</li>
                            </ul>
                        </div>

                        {/* Rule 2 */}
                        <div className="bg-red-50 p-8 rounded-2xl border border-red-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Speed & Distractions</h3>
                            <p className="text-gray-600 mb-4">Speeding and mobile phone use are the top causes of accidents. Always drive for the conditions, not just the limit.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Zero phone tolerance</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Slow down in wet weather</li>
                            </ul>
                        </div>

                        {/* Rule 3 */}
                        <div className="bg-green-50 p-8 rounded-2xl border border-green-100 hover:shadow-md transition">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                                <Info size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Right of Way</h3>
                            <p className="text-gray-600 mb-4">Understanding who goes first prevents confusion. Give way to the right at roundabouts and unmarked intersections.</p>
                            <ul className="text-sm text-gray-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Give way to pedestrians</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Stop completely at Stop signs</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/safety" className="text-brand-600 font-bold hover:underline">Read our full Safety Guide &rarr;</Link>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose EzLicence?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: User, title: 'Verified Instructors', desc: 'All instructors are fully vetted, licensed, and hold Working with Children checks.' },
                            { icon: Calendar, title: 'Real-time Booking', desc: 'See availability instantly and book lessons that fit your schedule 24/7.' },
                            { icon: Shield, title: 'Secure Payments', desc: 'Your money is safe. We hold payments until the lesson is successfully completed.' }
                        ].map((feature, i) => (
                            <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-brand-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600">
                                    <feature.icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your engine?</h2>
                    <div className="flex justify-center gap-4">
                        <Link to="/search" className="bg-brand-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-700 transition">Find an Instructor</Link>
                        <Link to="/learners" className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg font-bold hover:bg-gray-50 transition">Learn More</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

import React, { useState, useEffect } from 'react';
import { User, Save, MapPin, Car, DollarSign, Globe, Award, Settings } from 'lucide-react';

interface ProfileEditorProps {
    user: any;
    onSave: (updates: any) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onSave }) => {
    const [formData, setFormData] = useState(user || {});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData(user || {});
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate waiting for API
        await new Promise(resolve => setTimeout(resolve, 500));
        onSave(formData);
        setLoading(false);
    };

    const autofillFromGoogle = () => {
        const dummyData = {
            bio: "Certified Instructor with 10+ years experience. Specializing in nervous drivers and international license conversions. I focus on safe driving habits and defensive techniques.",
            location: "Sydney, NSW",
            vehicle: "2023 Toyota Corolla Hybrid",
            price: 75,
            languages: "English, Mandarin",
            transmission: "Auto",
            experience: 10,
            licence_number: "DI-998877",
            rating: 4.9, // This typically wouldn't be editable directly but filled for demo
        };
        setFormData({ ...formData, ...dummyData });
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Settings size={20} /> Edit Profile</h2>
                {user.role === 'instructor' && (
                    <button
                        type="button"
                        onClick={autofillFromGoogle}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                        <Globe size={12} /> Auto-fill from Google
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                    {user.role === 'learner' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Transmission Preference</label>
                            <select name="transmission_preference" value={formData.transmission_preference || 'Auto'} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none">
                                <option value="Auto">Automatic</option>
                                <option value="Manual">Manual</option>
                            </select>
                        </div>
                    )}
                    {user.role === 'instructor' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
                                <input name="price" type="number" value={formData.price || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Years Experience</label>
                                <input name="experience" type="number" value={formData.experience || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                            </div>
                        </>
                    )}
                </div>

                {user.role === 'instructor' && (
                    <>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                                <input name="vehicle" value={formData.vehicle || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. 2022 Toyota Yaris" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Languages Spoken</label>
                                <input name="languages" value={formData.languages || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. English, Hindi" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Licence Number</label>
                            <input name="licence_number" value={formData.licence_number || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea name="bio" rows={4} value={formData.bio || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                    </>
                )}

                {user.role === 'learner' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address / Pickup Location</label>
                        <input name="address" value={formData.address || ''} onChange={handleChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Your suburb or address" />
                    </div>
                )}

                <div className="pt-4 flex justify-end">
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 flex items-center gap-2">
                        <Save size={18} /> {loading ? 'Saving...' : 'Save Profile'}
                    </button>
                </div>
            </form>
        </div>
    );
};

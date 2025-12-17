import React, { useState } from 'react';
import { Star, X } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    instructorName: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onSubmit, instructorName }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-center">Rate your lesson</h2>
                <p className="text-center text-gray-500 mb-6">How was your session with {instructorName}?</p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-1 transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                        >
                            <Star size={32} fill="currentColor" />
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none h-32"
                    placeholder="Write a brief review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    onClick={() => onSubmit(rating, comment)}
                    className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md transform transition hover:-translate-y-0.5"
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
};

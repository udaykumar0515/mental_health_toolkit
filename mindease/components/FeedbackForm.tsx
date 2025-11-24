import React, { useState } from 'react';
import { apiClient } from '../services/apiClient';
import { User, Page } from '../types';
import { Send, Star, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface FeedbackFormProps {
    user: User | null;
    onNavigate: (page: Page) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ user, onNavigate }) => {
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState('general');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        if (rating === 0) {
            setErrorMessage('Please provide a rating.');
            setStatus('error');
            return;
        }

        setIsSubmitting(true);
        setStatus('idle');
        setErrorMessage('');

        try {
            await apiClient.submitFeedback(content, rating, category, user ? {
                name: user.name,
                email: user.email,
                // user_id is handled by the backend if we send the token, but here we can send explicit details if needed
                // The backend route I wrote expects user_id in body if available, or it defaults to anonymous.
                // Since the apiClient sends the token, we could potentially extract user_id from the token on the backend,
                // but for now let's just send what we have.
            } : undefined);

            setStatus('success');
            setContent('');
            setRating(0);
            setCategory('general');
            setTimeout(() => {
                onNavigate('dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            setStatus('error');
            setErrorMessage('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">We Value Your Feedback</h2>
                        <p className="text-gray-600 dark:text-gray-400">Help us improve your experience</p>
                    </div>
                </div>

                {status === 'success' ? (
                    <div className="text-center py-12 animate-fade-in">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Thank You!</h3>
                        <p className="text-gray-600 dark:text-gray-400">Your feedback has been submitted successfully.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                How would you rate your experience?
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`p-2 rounded-lg transition-colors ${rating >= star
                                            ? 'text-yellow-400 hover:text-yellow-500'
                                            : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'
                                            }`}
                                    >
                                        <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            >
                                <option value="general">General Feedback</option>
                                <option value="bug">Report a Bug</option>
                                <option value="feature">Feature Request</option>
                                <option value="content">Content Suggestion</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Your Comments
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tell us what you think..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                                required
                            />
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl">
                                <AlertCircle className="w-5 h-5" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => onNavigate('dashboard')}
                                className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackForm;

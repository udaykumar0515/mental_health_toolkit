import React, { useState, useRef, useEffect } from 'react';
import { Mood, MoodLog, Page } from '../types';
import { Smile, Meh, Frown, Zap, Heart, ArrowLeft } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface MoodTrackerProps {
  onSave: (log: Omit<MoodLog, 'id' | 'date'>) => void;
  onNavigate: (page: Page) => void;
}

const moodOptions: { mood: Mood, label: string, icon: React.FC<{ size?: number }>, color: string }[] = [
  { mood: 'happy', label: 'Happy', icon: Smile, color: 'text-green-500' },
  { mood: 'calm', label: 'Calm', icon: Heart, color: 'text-blue-500' },
  { mood: 'anxious', label: 'Anxious', icon: Zap, color: 'text-orange-500' },
  { mood: 'sad', label: 'Sad', icon: Frown, color: 'text-indigo-500' },
  { mood: 'irritable', label: 'Irritable', icon: Meh, color: 'text-red-500' },
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ onSave, onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [savedMoodId, setSavedMoodId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSaveAndNavigate = async () => {
    if (!selectedMood) return;

    setIsSaving(true);
    setError(null);
    setIsAnimating(true);

    try {
      // Optimistic UI: show animation immediately
      const moodData = { mood: selectedMood, note, intensity };
      onSave(moodData);

      // Background save to backend
      const savedMood = await apiClient.createMoodLog(selectedMood, intensity, note);
      setSavedMoodId(savedMood.id);

      // Show undo button for 8 seconds
      setShowUndo(true);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      undoTimeoutRef.current = setTimeout(() => {
        setShowUndo(false);
      }, 8000);

      // Wait for animation to complete, then navigate
      setTimeout(() => {
        onNavigate('dashboard');
      }, 500);
    } catch (err) {
      console.error('Error saving mood:', err);
      setError('Couldn\'t save mood — Retry or go back');
      setIsSaving(false);
      setIsAnimating(false);
    }
  };

  const handleUndo = async () => {
    if (!savedMoodId) return;

    try {
      await apiClient.deleteMoodLog(savedMoodId.toString());
      setSavedMoodId(null);
      setShowUndo(false);
      setSelectedMood(null);
      setNote('');
      setIntensity(5);
      setError(null);
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    } catch (err) {
      console.error('Error undoing mood:', err);
      setError('Couldn\'t undo — please try again');
    }
  };

  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    };
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-slate-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">How are you feeling right now?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Select a mood that best describes your current state.</p>

        <div className="flex justify-center gap-4 sm:gap-6 mb-8">
          {moodOptions.map(({ mood, label, icon: Icon, color }) => (
            <div key={mood} className="flex flex-col items-center">
              <button
                onClick={() => setSelectedMood(mood)}
                disabled={isSaving}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed ${selectedMood === mood ? 'bg-blue-500 text-white scale-110 shadow-lg' : `bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 ${color}`}`}
              >
                <Icon size={40} />
              </button>
              <span className={`mt-2 text-sm font-medium ${selectedMood === mood ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          </div>
        )}

        {selectedMood && (
          <div className="animate-fade-in text-left">
            <label htmlFor="intensity-slider" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
              Intensity Level: {intensity}/10
            </label>
            <input
              id="intensity-slider"
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              disabled={isSaving}
              className="w-full mb-4 cursor-pointer disabled:opacity-50"
            />
            <label htmlFor="mood-note" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
              Add a note (optional)
            </label>
            <textarea
              id="mood-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isSaving}
              placeholder={`What's making you feel ${selectedMood}?`}
              className="w-full p-3 border border-slate-300 dark:border-gray-600 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-200 disabled:opacity-50"
            />
            <div className="mt-6 text-center">
              <button
                onClick={handleSaveAndNavigate}
                disabled={isSaving}
                className={`bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
              >
                {isSaving ? 'Saving...' : 'Save Mood'}
              </button>
            </div>
          </div>
        )}

        {showUndo && (
          <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-lg flex items-center justify-between gap-4">
            <p className="text-blue-700 dark:text-blue-300 text-sm font-medium">Mood saved! Redirecting to dashboard...</p>
            <button
              onClick={handleUndo}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all whitespace-nowrap"
            >
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
import React, { useState } from 'react';
import { Mood, MoodLog, Page } from '../types';
import MoodHappyIcon from './icons/MoodHappyIcon';
import MoodCalmIcon from './icons/MoodCalmIcon';
import MoodAnxiousIcon from './icons/MoodAnxiousIcon';
import MoodSadIcon from './icons/MoodSadIcon';
import MoodIrritableIcon from './icons/MoodIrritableIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface MoodTrackerProps {
  onSave: (log: Omit<MoodLog, 'id' | 'date'>) => void;
  onNavigate: (page: Page) => void;
}

const moodOptions: { mood: Mood, label: string, icon: React.FC<{className?: string}>, color: string }[] = [
    { mood: 'happy', label: 'Happy', icon: MoodHappyIcon, color: 'text-green-500' },
    { mood: 'calm', label: 'Calm', icon: MoodCalmIcon, color: 'text-blue-500' },
    { mood: 'anxious', label: 'Anxious', icon: MoodAnxiousIcon, color: 'text-orange-500' },
    { mood: 'sad', label: 'Sad', icon: MoodSadIcon, color: 'text-indigo-500' },
    { mood: 'irritable', label: 'Irritable', icon: MoodIrritableIcon, color: 'text-red-500' },
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ onSave, onNavigate }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [intensity, setIntensity] = useState(5);

  const handleSave = () => {
    if (selectedMood) {
      onSave({ mood: selectedMood, note, intensity });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
            <ArrowLeftIcon />
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
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 transform ${selectedMood === mood ? 'bg-blue-500 text-white scale-110 shadow-lg' : `bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 ${color}`}`}
                    >
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </button>
                    <span className={`mt-2 text-sm font-medium ${selectedMood === mood ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>{label}</span>
                </div>
            ))}
        </div>

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
                className="w-full mb-4 cursor-pointer"
              />
                <label htmlFor="mood-note" className="block text-md font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Add a note (optional)
                </label>
                <textarea
                    id="mood-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={`What's making you feel ${selectedMood}?`}
                    className="w-full p-3 border border-slate-300 dark:border-gray-600 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-slate-800 dark:text-slate-200"
                />
                <div className="mt-6 text-center">
                    <button
                        onClick={handleSave}
                        className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-all"
                    >
                        Save Mood
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
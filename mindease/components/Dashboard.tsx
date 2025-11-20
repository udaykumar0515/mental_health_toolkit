import React, { useState } from 'react';
import { Page, User, MoodLog } from '../types';
import BrainIcon from './icons/BrainIcon';
import LungsIcon from './icons/LungsIcon';
import ChartIcon from './icons/ChartIcon';
import QuoteIcon from './icons/QuoteIcon';
import JournalIcon from './icons/JournalIcon';
import MusicIcon from './icons/MusicIcon';
import FireIcon from './icons/FireIcon';
import MoodHappyIcon from './icons/MoodHappyIcon';
import MoodCard from './MoodCard';
import { generateMotivationalQuote } from '../services/geminiService';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  quote: { quote: string; author: string } | null;
  streak: number;
  user: User | null;
  todayMood: MoodLog | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, quote: initialQuote, streak, user, todayMood }) => {
  const [quote, setQuote] = useState(initialQuote);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  const fetchNextQuote = async () => {
    setIsLoadingQuote(true);
    try {
      const newQuote = await generateMotivationalQuote();
      setQuote(newQuote);
    } catch (error) {
      console.error("Error fetching quote:", error);
    } finally {
      setIsLoadingQuote(false);
    }
  };
  const handleNavigate = (page: Page) => {
    onNavigate(page);
  };

  return (
    <div className="min-h-screen py-12 bg-gradient-to-b from-indigo-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-white mb-1 leading-snug">Hello, {user?.name}</h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">Ready to nurture your mind today?</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm mt-3 sm:mt-0 px-3 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
            <FireIcon />
            <div className="text-center">
              <p className="font-bold text-xl text-orange-500">{streak}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5">Day Streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {todayMood ? (
            <MoodCard
              mood={todayMood.mood}
              intensity={todayMood.intensity || 5}
              onChangeMood={() => handleNavigate('mood-tracker')}
              animated={true}
            />
          ) : (
            <button
              onClick={() => handleNavigate('mood-tracker')}
              className="w-full text-left group bg-gradient-to-br from-blue-600 to-teal-500 p-8 rounded-3xl shadow-2xl text-white flex flex-col justify-between h-56 md:h-64 hover:shadow-[0_20px_40px_rgba(15,23,42,0.15)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <div>
                <h2 className="text-3xl font-bold mb-2">How are you feeling?</h2>
                <p className="opacity-80">Take a moment to check in with yourself.</p>
              </div>
              <div className="flex items-center justify-end font-semibold group-hover:underline">
                Log Today's Mood
                <MoodHappyIcon className="ml-2 h-8 w-8" />
              </div>
            </button>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              title="Breathing Exercise"
              description="A guided session to find your calm."
              icon={<LungsIcon />}
              onClick={() => onNavigate('breathing')}
              color="green"
            />
            <FeatureCard
              title="Thought Reframer"
              description="Challenge negative perspectives."
              icon={<BrainIcon />}
              onClick={() => onNavigate('reframer')}
              color="purple"
            />
            <FeatureCard
              title="Journal"
              description="Record your thoughts and feelings."
              icon={<JournalIcon />}
              onClick={() => onNavigate('journal')}
              color="yellow"
            />
             <FeatureCard
              title="Music Player"
              description="Listen to calming sounds to relax."
              icon={<MusicIcon />}
              onClick={() => onNavigate('music')}
              color="sky"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-28">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Quick Check-In</h3>
             <button 
                onClick={() => onNavigate('assessment')}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-base dark:bg-blue-500 dark:hover:bg-blue-600">
                Start Stress Assessment
            </button>
          </div>
          {quote && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-indigo-600 dark:text-indigo-300 mt-1">
                      <QuoteIcon />
                  </div>
                  <div className="flex-grow">
                    <p className="text-md italic text-slate-700 dark:text-slate-200 leading-relaxed">"{quote.quote}"</p>
                    <p className="text-right mt-3 text-slate-600 dark:text-slate-400 font-medium text-sm">- {quote.author}</p>
                  </div>
                </div>
                <button
                  onClick={fetchNextQuote}
                  disabled={isLoadingQuote}
                  className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingQuote ? 'Loading...' : 'Next Quote'}
                </button>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    color: 'green' | 'purple' | 'yellow' | 'sky' | 'slate' | 'rose';
}

const colorClasses = {
    green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-300'},
    purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-300'},
    yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-600 dark:text-yellow-300'},
    sky: { bg: 'bg-sky-100 dark:bg-sky-900/50', text: 'text-sky-600 dark:text-sky-300'},
    slate: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-300'},
    rose: { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-600 dark:text-rose-300'},
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick, color }) => (
    <button 
        onClick={onClick}
        className="w-full text-left bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-gray-700 flex space-x-4 items-center"
    >
        <div className={`rounded-full p-3 ${colorClasses[color].bg} ${colorClasses[color].text} flex-shrink-0`}>
            {icon}
        </div>
        <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </button>
);

export default Dashboard;
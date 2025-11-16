import React from 'react';
import { Page, User } from '../types';
import BrainIcon from './icons/BrainIcon';
import LungsIcon from './icons/LungsIcon';
import BotIcon from './icons/BotIcon';
import ChartIcon from './icons/ChartIcon';
import QuoteIcon from './icons/QuoteIcon';
import JournalIcon from './icons/JournalIcon';
import MusicIcon from './icons/MusicIcon';
import FireIcon from './icons/FireIcon';
import MoodHappyIcon from './icons/MoodHappyIcon';

interface DashboardProps {
  onNavigate: (page: Page) => void;
  quote: { quote: string; author: string } | null;
  streak: number;
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, quote, streak, user }) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-2">Hello, {user?.name}</h1>
          <p className="text-md text-slate-500 dark:text-slate-400">Ready to nurture your mind today?</p>
        </div>
        {streak > 0 && (
          <div className="flex items-center space-x-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm mt-4 sm:mt-0 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
            <FireIcon />
            <div className="text-center">
              <p className="font-bold text-2xl text-orange-500">{streak}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Day Streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <div
            onClick={() => onNavigate('mood-tracker')}
            className="cursor-pointer group bg-gradient-to-br from-blue-500 to-teal-400 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-between h-64 hover:shadow-xl transition-shadow duration-300"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">How are you feeling?</h2>
              <p className="opacity-80">Take a moment to check in with yourself.</p>
            </div>
            <div className="flex items-center justify-end font-semibold group-hover:underline">
              Log Today's Mood
              <MoodHappyIcon className="ml-2 h-8 w-8" />
            </div>
          </div>
          
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
        <div className="space-y-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-4">Quick Check-In</h3>
             <button 
                onClick={() => onNavigate('assessment')}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out text-base dark:bg-blue-500 dark:hover:bg-blue-600">
                Start Stress Assessment
            </button>
          </div>
          {quote && (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-blue-500 dark:text-blue-400 mt-1">
                      <QuoteIcon />
                  </div>
                  <div>
                    <p className="text-md italic text-slate-600 dark:text-slate-300">"{quote.quote}"</p>
                    <p className="text-right mt-3 text-slate-500 dark:text-slate-400 font-medium text-sm">- {quote.author}</p>
                  </div>
                </div>
            </div>
          )}
           <FeatureCard
              title="CalmBot"
              description="Talk through your feelings with an AI."
              icon={<BotIcon />}
              onClick={() => onNavigate('chatbot')}
              color="slate"
            />
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
    <div 
        onClick={onClick}
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-slate-200 dark:border-gray-700 flex space-x-4 items-center"
    >
        <div className={`rounded-full p-3 ${colorClasses[color].bg} ${colorClasses[color].text}`}>
            {icon}
        </div>
        <div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

export default Dashboard;
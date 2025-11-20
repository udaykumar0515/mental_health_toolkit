import React from 'react';
import { Mood } from '../types';
import { Smile, Meh, Frown, Zap, Heart } from 'lucide-react';

interface MoodCardProps {
  mood: Mood;
  intensity: number;
  onChangeMood: () => void;
  animated?: boolean;
}

const moodConfig: Record<Mood, {
  label: string;
  icon: React.FC<{ size?: number }>;
  supportiveText: string;
  suggestedAction: string;
  bgGradient: string;
  iconBg: string;
  iconColor: string;
}> = {
  happy: {
    label: 'Happy',
    icon: Smile,
    supportiveText: 'Feeling upbeat today! Keep the flow going.',
    suggestedAction: 'Try a 2-minute breathing exercise',
    bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    iconColor: 'text-green-600 dark:text-green-300',
  },
  calm: {
    label: 'Calm',
    icon: Heart,
    supportiveText: "You're in a peaceful state. Maintain this moment.",
    suggestedAction: 'Listen to calming music or meditate',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-300',
  },
  anxious: {
    label: 'Anxious',
    icon: Zap,
    supportiveText: 'Take a breath. You\'re doing okay.',
    suggestedAction: 'Start a 60-second breathing exercise',
    bgGradient: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-300',
  },
  sad: {
    label: 'Sad',
    icon: Frown,
    supportiveText: 'Be gentle with yourself today.',
    suggestedAction: 'Write a quick journal entry',
    bgGradient: 'from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/50',
    iconColor: 'text-indigo-600 dark:text-indigo-300',
  },
  irritable: {
    label: 'Irritable',
    icon: Meh,
    supportiveText: 'Let\'s reset for a minute.',
    suggestedAction: 'Try box breathing (4-4-4-4)',
    bgGradient: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    iconColor: 'text-red-600 dark:text-red-300',
  },
  chill: {
    label: 'Chill',
    icon: Heart,
    supportiveText: 'You\'re in a relaxed vibe. Enjoy the moment.',
    suggestedAction: 'Listen to your favorite chill playlist',
    bgGradient: 'from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
    iconBg: 'bg-teal-100 dark:bg-teal-900/50',
    iconColor: 'text-teal-600 dark:text-teal-300',
  },
};

const MoodCard: React.FC<MoodCardProps> = ({ mood, intensity, onChangeMood, animated = false }) => {
  const config = moodConfig[mood];
  const Icon = config.icon;
  const animationClass = animated ? 'mood-fly-in' : '';

  return (
    <div
      className={`bg-gradient-to-br ${config.bgGradient} p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 ${animationClass}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-4 ${config.iconBg}`}>
            <Icon size={32} className={config.iconColor} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
              {config.label}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Intensity: {intensity}/10
            </p>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <p className="text-base text-slate-700 dark:text-slate-200 mb-3">
          {config.supportiveText}
        </p>
        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
          <span className="text-lg">🠚</span>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {config.suggestedAction}
          </p>
        </div>
      </div>

      <button
        onClick={onChangeMood}
        className="w-full bg-white/70 dark:bg-gray-700/70 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-all border border-slate-300 dark:border-gray-600"
      >
        Change Mood
      </button>
    </div>
  );
};

export default MoodCard;

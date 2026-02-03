import React, { useState } from 'react';
import { AssessmentResult, Page } from '../types';
import { Wind } from 'lucide-react';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onNavigate: (page: Page) => void;
}

interface ExpandedRecommendation {
  [key: number]: boolean;
}

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Low':
      return {
        badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700/50',
        bg: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
        emoji: '🙂',
        progressColor: 'bg-green-500',
        bottomBorder: 'border-b-4 border-green-400',
      };
    case 'Mild':
      return {
        badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50',
        bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
        emoji: '😊',
        progressColor: 'bg-yellow-500',
        bottomBorder: 'border-b-4 border-yellow-400',
      };
    case 'Moderate':
      return {
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/50',
        bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        emoji: '😐',
        progressColor: 'bg-orange-500',
        bottomBorder: 'border-b-4 border-orange-400',
      };
    case 'High':
      return {
        badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50',
        bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
        emoji: '😣',
        progressColor: 'bg-red-500',
        bottomBorder: 'border-b-4 border-red-400',
      };
    default:
      return {
        badge: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        bg: 'from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-800',
        emoji: '😶',
        progressColor: 'bg-slate-500',
        bottomBorder: 'border-b-4 border-slate-400',
      };
  }
};

// Helper function to extract first sentence from description
const getFirstSentence = (text: string): string => {
  const sentences = text.split(/[.!?]+/);
  return sentences[0].trim() + '.';
};

// Helper function to render progress bar
const ProgressBar: React.FC<{ score: number; max: number; color: string }> = ({ score, max, color }) => {
  const percentage = (score / max) * 100;
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex-grow h-2 bg-slate-300 dark:bg-slate-600 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {score}/{max}
      </span>
    </div>
  );
};

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, onNavigate }) => {
  const [expanded, setExpanded] = useState<ExpandedRecommendation>({});
  const scoreOut10 = Math.round((result.score / 48) * 10) || 1;
  const colors = getLevelColor(result.level);

  const toggleExpanded = (index: number) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Only show first 3 recommendations
  const displayedRecommendations = result.recommendations.slice(0, 3);

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-indigo-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Main Result Card */}
        <div className={`bg-gradient-to-br ${colors.bg} p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-gray-700 ${colors.bottomBorder} mb-8 overflow-hidden`}>
          <div className="text-center mb-6">
            <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold border ${colors.badge} mb-4`}>
              <span className="mr-2">{colors.emoji}</span>
              {result.level} Stress
            </div>
            
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-1">
              Score: {scoreOut10}/10
            </h2>
          </div>

          {/* Progress Bar */}
          <ProgressBar score={scoreOut10} max={10} color={colors.progressColor} />

          {/* Summary Section - Cleaner */}
          <div className="text-center mt-6">
            <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed max-w-lg mx-auto">
              {result.summary}
            </p>
          </div>
        </div>

        {/* Recommendation Section Header */}
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Recommended for You
        </h3>

        {/* Flashcard-Style Recommendations */}
        <div className="space-y-4 mb-8">
          {displayedRecommendations.map((rec, index) => {
            // Use separate description and details fields from API
            // Fallback to old behavior if details not present
            const summaryText = rec.description;
            const detailsText = (rec as any).details || '';
            
            return (
              <div
                key={index}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border-2 border-slate-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer ${
                  expanded[index] ? 'shadow-lg' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                      {index + 1}. {rec.title}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {summaryText}
                    </p>

                    {/* Expandable Details with Animation */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        expanded[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {detailsText && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700 animate-fadeIn">
                          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            {detailsText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* More Button - only show if there are details */}
                  {detailsText && (
                    <button
                      className="px-3 py-1 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 whitespace-nowrap flex-shrink-0"
                      onClick={e => {
                        e.stopPropagation();
                        toggleExpanded(index);
                      }}
                    >
                      {expanded[index] ? 'Less' : 'More'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => onNavigate('breathing')}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <Wind size={20} />
            Start Breathing Exercise
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-slate-800 dark:text-white font-bold py-4 px-8 rounded-full shadow-md transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
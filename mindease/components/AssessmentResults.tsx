import React, { useState } from 'react';
import { AssessmentResult, Page } from '../types';
import LungsIcon from './icons/LungsIcon';

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
      };
    case 'Mild':
      return {
        badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700/50',
        bg: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      };
    case 'Moderate':
      return {
        badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700/50',
        bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      };
    case 'High':
      return {
        badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700/50',
        bg: 'from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
      };
    default:
      return {
        badge: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        bg: 'from-slate-50 to-slate-50 dark:from-slate-800 dark:to-slate-800',
      };
  }
};

// Helper function to extract first sentence from description
const getFirstSentence = (text: string): string => {
  const sentences = text.split(/[.!?]+/);
  return sentences[0].trim() + '.';
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
        <div className={`bg-gradient-to-br ${colors.bg} p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-gray-700 mb-8`}>
          <div className="text-center mb-6">
            <div className={`inline-block px-6 py-2 rounded-full text-sm font-bold border ${colors.badge} mb-4`}>
              {result.level} Stress
            </div>
            
            <h2 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Score: {scoreOut10}/10
            </h2>
          </div>

          {/* Summary Section */}
          <div className="text-center">
            <h3 className="text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2 font-semibold">
              Summary
            </h3>
            <p className="text-lg text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{result.summary}"
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
            const fullText = rec.description;
            const summaryText = getFirstSentence(fullText);
            // Extract rest of text after first sentence to avoid duplication
            const restOfText = fullText.substring(summaryText.length).trim();
            
            return (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
                      {index + 1}. {rec.title}
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm">
                      {summaryText}
                    </p>

                    {/* Expandable Details */}
                    {expanded[index] && restOfText && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-gray-700 animate-fadeIn">
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                          {restOfText}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* More Button */}
                  <button
                    className="px-3 py-1 font-semibold text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-300 whitespace-nowrap"
                    onClick={e => {
                      e.stopPropagation();
                      toggleExpanded(index);
                    }}
                  >
                    [{expanded[index] ? 'Less' : 'More'}]
                  </button>
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
            <LungsIcon className="w-5 h-5" />
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
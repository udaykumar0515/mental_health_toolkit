import React from 'react';
import { AssessmentResult, Page } from '../types';

interface AssessmentResultsProps {
  result: AssessmentResult;
  onNavigate: (page: Page) => void;
}

const getLevelColor = (level: string, isDark: boolean) => {
    switch (level) {
        case 'Low': return isDark ? 'text-green-300 bg-green-900/50 border-green-700/50' : 'text-green-700 bg-green-100 border-green-200';
        case 'Mild': return isDark ? 'text-yellow-300 bg-yellow-900/50 border-yellow-700/50' : 'text-yellow-700 bg-yellow-100 border-yellow-200';
        case 'Moderate': return isDark ? 'text-orange-300 bg-orange-900/50 border-orange-700/50' : 'text-orange-700 bg-orange-100 border-orange-200';
        case 'High': return isDark ? 'text-red-300 bg-red-900/50 border-red-700/50' : 'text-red-700 bg-red-100 border-red-200';
        default: return isDark ? 'text-slate-300 bg-gray-700 border-gray-600' : 'text-slate-600 bg-slate-100 border-slate-200';
    }
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ result, onNavigate }) => {
  const isDark = document.documentElement.classList.contains('dark');
  // Convert score from 0-48 to 1-10 scale
  const scoreOut10 = Math.round((result.score / 48) * 10) || 1;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 mb-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Assessment Results</h2>
          <div className={`inline-block px-6 py-2 rounded-full text-2xl font-bold border ${getLevelColor(result.level, isDark)}`}>
            {result.level} Stress
          </div>
          <div className="flex justify-center items-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Your Score</p>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">{scoreOut10}/10</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">Status</p>
              <p className="text-lg font-semibold text-slate-800 dark:text-white mt-1">{result.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3 uppercase tracking-wide">Overview</h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{result.summary}</p>
      </div>

      {/* Recommendations Section */}
      <div className="bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700 mb-8">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-5 uppercase tracking-wide">Recommended Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-1">{rec.title}</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;
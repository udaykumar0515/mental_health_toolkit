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
  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Your Results</h2>
        <div className={`inline-block px-4 py-1.5 rounded-full text-lg font-semibold border ${getLevelColor(result.level, isDark)}`}>
          Stress Level: {result.level}
        </div>
        <p className="text-slate-500 dark:text-slate-400 mt-2">(Score: {result.score} / 48)</p>
      </div>

      <div className="bg-slate-50 dark:bg-gray-700/50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">Summary</h3>
        <p className="text-slate-600 dark:text-slate-300">{result.summary}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Personalized Recommendations</h3>
        <div className="space-y-4">
          {result.recommendations.map((rec, index) => (
            <div key={index} className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-bold text-blue-800 dark:text-blue-300">{rec.title}</h4>
              <p className="text-slate-700 dark:text-slate-300">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('dashboard')}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AssessmentResults;
import React, { useState } from 'react';
import { reframeThought } from '../services/geminiService';
import SparklesIcon from './icons/SparklesIcon';
import BrainIcon from './icons/BrainIcon';
import { Page } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

interface ThoughtReframerProps {
    onNavigate: (page: Page) => void;
}

const ThoughtReframer: React.FC<ThoughtReframerProps> = ({ onNavigate }) => {
  const [thought, setThought] = useState('');
  const [result, setResult] = useState<{ reframe: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!thought.trim()) {
      setError("Please enter a thought to reframe.");
      return;
    }
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const reframeResult = await reframeThought(thought);
      setResult(reframeResult);
    } catch (err) {
      console.error("Error reframing thought:", err);
      setError("Sorry, an error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
            <ArrowLeftIcon />
            Back to Dashboard
      </button>
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center border border-slate-200 dark:border-gray-700">
        <div className="inline-flex justify-center items-center gap-2 mb-4 text-gray-800 dark:text-white">
            <BrainIcon />
            <h2 className="text-3xl font-bold">Thought Reframer</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Shift your perspective. Turn negative thoughts into empowering ones.</p>
        
        <textarea
          value={thought}
          onChange={(e) => setThought(e.target.value)}
          placeholder="Write down a negative thought you're having..."
          className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          disabled={isLoading}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 flex items-center justify-center mx-auto gap-2"
        >
          {isLoading ? 'Reframing...' : <> <SparklesIcon /> Reframe My Thought </>}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {result && (
        <div className="mt-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg animate-fade-in border border-slate-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 text-center">A New Perspective</h3>
          <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg border border-green-200 dark:border-green-800 mb-6">
            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">A More Balanced Thought:</h4>
            <p className="text-gray-700 dark:text-gray-300 italic">"{result.reframe}"</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
             <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">An Encouraging Word:</h4>
            <p className="text-gray-700 dark:text-gray-300">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThoughtReframer;
import React, { useState, useEffect } from 'react';
import { LIKERT_SCALE_OPTIONS, ASSESSMENT_QUESTIONS } from '../constants';
import { analyzeStressAssessment } from '../services/geminiService';
import { AssessmentResult } from '../types';
import { apiClient } from '../services/apiClient';

interface Question {
  id: string;
  text: string;
  options?: string[];
}

interface StressAssessmentProps {
  onComplete: (result: AssessmentResult, answers: number[]) => void;
}

const StressAssessment: React.FC<StressAssessmentProps> = ({ onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Fetch questions from API on mount, with fallback to constants
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const apiQuestions = await apiClient.getQuestions();
        setQuestions(apiQuestions);
      } catch (err) {
        console.error('Error fetching questions from API, using fallback:', err);
        // Fallback to constants if API fails
        const fallbackQuestions = ASSESSMENT_QUESTIONS.map(q => ({
          id: q.id.toString(),
          text: q.text,
        }));
        setQuestions(fallbackQuestions);
      }
      setIsLoadingQuestions(false);
    };

    fetchQuestions();
  }, []);

  const handleAnswerChange = (questionIndex: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const formattedAnswers = questions.map((q, index) => ({
      question: q.text,
      answer: LIKERT_SCALE_OPTIONS.find(opt => opt.value === answers[index])?.label || '',
      value: answers[index],
    }));

    try {
      const result = await analyzeStressAssessment(formattedAnswers);
      const answerValues = questions.map((_, index) => answers[index]);
      onComplete(result, answerValues);
    } catch (err) {
      console.error("Error analyzing assessment:", err);
      setError("Sorry, we couldn't analyze your results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  if (isLoadingQuestions) {
    return (
      <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-red-500">Could not load assessment questions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-2">Mental Wellness Check-in</h2>
      <p className="text-center text-slate-500 dark:text-slate-400 mb-8">Answer based on your feelings over the last month.</p>
      
      <div className="w-full bg-slate-200 dark:bg-gray-700 rounded-full h-2.5 mb-8">
          <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => (
          <div key={question.id} className="border-b border-slate-200 dark:border-gray-700 pb-6 last:border-b-0">
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4">{`${index + 1}. ${question.text}`}</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {LIKERT_SCALE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerChange(index, option.value)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                    answers[index] === option.value
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-700 hover:bg-blue-100 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      
      <div className="mt-8 text-center">
        <button
          onClick={handleSubmit}
          disabled={isLoading || Object.keys(answers).length !== questions.length}
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'See My Results'}
        </button>
      </div>
    </div>
  );
};

export default StressAssessment;
import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { apiClient } from '../services/apiClient';
import { ArrowLeft } from 'lucide-react';

interface BreathingExerciseProps {
    onNavigate: (page: Page) => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onNavigate }) => {
  const [phase, setPhase] = useState('get ready');
  const [timer, setTimer] = useState(3);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const cycle = [
    { name: 'breathe in', duration: 4 },
    { name: 'hold', duration: 7 },
    { name: 'breathe out', duration: 8 },
  ];

  const startExercise = () => {
    setIsRunning(true);
    setPhase('get ready');
    setTimer(3);
    setStartTime(Date.now());
  };
  
  const stopExercise = async () => {
    // compute duration and cycles
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const endTime = Date.now();
    const durationSeconds = startTime ? Math.max(1, Math.round((endTime - startTime) / 1000)) : 0;
    const cycleDuration = cycle.reduce((s, c) => s + c.duration, 0); // 19s
    const cyclesCompleted = Math.floor(durationSeconds / cycleDuration);

    setPhase('get ready');
    setTimer(3);

    try {
      await apiClient.createBreathingSession(durationSeconds, cyclesCompleted);
      await apiClient.incrementStreak();
    } catch (err) {
      console.error('Failed to save breathing session or increment streak', err);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    let localIntervalId: number;

    if (phase === 'get ready' && timer > 0) {
      localIntervalId = window.setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      intervalRef.current = localIntervalId;
    } else if (phase === 'get ready' && timer === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      runCycle(0);
    }
    
    return () => {
        clearInterval(localIntervalId);
    }
  }, [isRunning, phase, timer]);

  // clear timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const runCycle = (cycleIndex: number) => {
    const currentPhase = cycle[cycleIndex];
    setPhase(currentPhase.name);
    setTimer(currentPhase.duration);

    const localIntervalId = window.setInterval(() => {
        setTimer(prev => prev - 1);
    }, 1000);
    intervalRef.current = localIntervalId;

    const localTimeoutId = window.setTimeout(() => {
      clearInterval(localIntervalId);
      runCycle((cycleIndex + 1) % cycle.length);
    }, currentPhase.duration * 1000);
    timeoutRef.current = localTimeoutId;
  };

  const getAnimationClass = () => {
    if (!isRunning) return 'scale-100';
    switch (phase) {
      case 'breathe in': return 'scale-150';
      case 'breathe out': return 'scale-50';
      default: return 'scale-100';
    }
  };

  return (
    <div className="max-w-md mx-auto">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-4 transition-colors">
            <ArrowLeft size={20} />
            Back to Dashboard
        </button>
        <div className="flex flex-col items-center justify-center p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 dark:border-gray-700">
          <div className="w-full text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Guided Breathing</h2>
            <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-200 dark:bg-blue-900/50 rounded-full animate-pulse-slow"></div>
              <div 
                className={`relative w-48 h-48 bg-blue-400 dark:bg-blue-600 rounded-full transition-transform duration-[4000ms] ease-in-out ${getAnimationClass()}`}
              ></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-white capitalize">{phase}</p>
                {isRunning && <p className="text-5xl font-bold text-white mt-2">{timer}</p>}
              </div>
            </div>

            {!isRunning ? (
                <button
                    onClick={startExercise}
                    className="bg-blue-600 dark:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
                >
                    Begin
                </button>
            ) : (
                <button
                    onClick={stopExercise}
                    className="bg-red-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-600 transition-all"
                >
                    Stop
                </button>
            )}
          </div>
        </div>
    </div>
  );
};

export default BreathingExercise;
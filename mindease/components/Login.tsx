import React, { useState } from 'react';
import { Page } from '../types';

interface LoginProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onNavigate: (page: Page) => void;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Welcome Back!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Sign in to continue your journey.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('signup')} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline" disabled={isLoading}>
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
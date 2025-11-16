import React, { useState } from 'react';
import { Page, Gender } from '../types';

interface SignupProps {
  onSignup: (profile: { email: string, pass: string, name: string, age: number, gender: Gender }) => Promise<void>;
  onNavigate: (page: Page) => void;
  error: string | null;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onNavigate, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('prefer-not-to-say');
  
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!name.trim()) {
        setFormError("Please enter your name.");
        return;
    }
    if (age === '' || age < 1) {
        setFormError("Please enter a valid age.");
        return;
    }

    setIsLoading(true);
    try {
      await onSignup({ email, pass: password, name, age, gender });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Your Account</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Start your path to a calmer mind today.</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
           <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          <div className="flex gap-4">
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                placeholder="Age"
                className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                required
                disabled={isLoading}
            />
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                required
                disabled={isLoading}
            >
                <option value="prefer-not-to-say">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={isLoading}
          />
          {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm text-center">
          Already have an account?{' '}
          <button onClick={() => onNavigate('login')} className="font-semibold text-blue-600 dark:text-blue-400 hover:underline" disabled={isLoading}>
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
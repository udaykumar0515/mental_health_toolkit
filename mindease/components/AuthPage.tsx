import React, { useState } from 'react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword,
  resendVerificationEmail 
} from '../firebase';
import { apiClient } from '../services/apiClient';
import { Gender } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: (user: { email: string; name: string; age: number; gender: string }) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'verify-email';

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<Gender>('prefer-not-to-say');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const firebaseUser = await signInWithGoogle();
      
      // Sync with backend
      try {
        const user = await apiClient.syncUser();
        onAuthSuccess({
          email: user.email,
          name: user.full_name,
          age: user.age || 0,
          gender: user.gender || 'prefer-not-to-say'
        });
      } catch (syncError) {
        console.error('Backend sync error:', syncError);
        // Still allow login even if sync fails - user data from Firebase
        onAuthSuccess({
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          age: 0,
          gender: 'prefer-not-to-say'
        });
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (age === '' || age < 1) {
          setError('Please enter a valid age');
          setLoading(false);
          return;
        }

        // Create user in Firebase Auth via backend
        try {
          await apiClient.signup(email, password, name, age as number, gender);
          setMode('verify-email');
          setSuccess('Account created! Please check your email to verify your account.');
        } catch (signupError: any) {
          // If backend signup fails, fall back to Firebase SDK
          console.log('Backend signup failed, using Firebase SDK:', signupError);
          await signUpWithEmail(email, password);
          setMode('verify-email');
          setSuccess('Account created! Please check your email to verify your account.');
        }
      } else if (mode === 'login') {
        const firebaseUser = await signInWithEmail(email, password);
        
        // Sync with backend
        try {
          const user = await apiClient.syncUser();
          onAuthSuccess({
            email: user.email,
            name: user.full_name,
            age: user.age || 0,
            gender: user.gender || 'prefer-not-to-say'
          });
        } catch (syncError) {
          console.error('Backend sync error:', syncError);
          // Still allow login even if sync fails
          onAuthSuccess({
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            age: 0,
            gender: 'prefer-not-to-say'
          });
        }
      } else if (mode === 'forgot-password') {
        if (!email.trim()) {
          setError('Please enter your email address');
          setLoading(false);
          return;
        }
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox (and spam folder).');
        setTimeout(() => setMode('login'), 3000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.message === 'EMAIL_NOT_VERIFIED') {
        setMode('verify-email');
        setError('Please verify your email before logging in.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else if (err.code === 'auth/missing-email') {
        setError('Please enter your email address');
      } else {
        setError(err.message || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    setError('');
    try {
      await resendVerificationEmail();
      setSuccess('Verification email sent! Check your inbox.');
    } catch (err: any) {
      setError('Failed to send verification email. Please try logging in first.');
    } finally {
      setLoading(false);
    }
  };

  // Verify Email Screen
  if (mode === 'verify-email') {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We've sent a verification link to <strong className="text-gray-800 dark:text-white">{email}</strong>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            Click the link in your email to verify your account, then come back and log in.
          </p>
          
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3 px-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50 mb-4"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Forgot Password Screen
  if (mode === 'forgot-password') {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your email to receive a reset link.</p>
          
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm">
            <button 
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }} 
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (mode === 'login') {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-white/20 dark:border-gray-700/30">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-2">MindEase</h1>
            <p className="text-xl font-bold text-slate-800 dark:text-white mt-6">Welcome back</p>
            <p className="text-slate-600 dark:text-slate-300 mt-1">Let's check in on how you're feeling today.</p>
          </div>
          
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">or</span>
            </div>
          </div>
          
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              disabled={loading}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              disabled={loading}
            />
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setMode('forgot-password'); setError(''); setSuccess(''); }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} 
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Signup Screen
  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center border border-white/20 dark:border-gray-700/30">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 mb-2">MindEase</h1>
          <p className="text-xl font-bold text-slate-800 dark:text-white mt-6">Begin Your Journey</p>
          <p className="text-slate-600 dark:text-slate-300 mt-1">I'm excited to start this journey with you.</p>
        </div>
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        {/* Google Sign Up */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500">or</span>
          </div>
        </div>
        
        <form onSubmit={handleEmailAuth} className="space-y-4 text-left">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={loading}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={loading}
          />
          <div className="flex gap-4">
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              placeholder="Age"
              className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              required
              disabled={loading}
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-1/2 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              disabled={loading}
            >
              <option value="prefer-not-to-say">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
            </select>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={loading}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-gray-600 dark:text-gray-400 mt-6 text-sm text-center">
          Already have an account?{' '}
          <button 
            onClick={() => { setMode('login'); setError(''); setSuccess(''); }} 
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

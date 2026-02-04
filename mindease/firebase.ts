/**
 * Firebase Client SDK Configuration
 * 
 * This file initializes Firebase for the frontend application.
 * Includes Auth, Firestore, and Analytics.
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCu63wmdaEpnQvzhkSxfL61iIn812s3o2w",
  authDomain: "mindease-mental-health-toolkit.firebaseapp.com",
  projectId: "mindease-mental-health-toolkit",
  storageBucket: "mindease-mental-health-toolkit.firebasestorage.app",
  messagingSenderId: "708842991578",
  appId: "1:708842991578:web:8ddcac53f3bffd99bc1ae3",
  measurementId: "G-XYZW1R9Z1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<User> => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  
  // Check if email is verified
  if (!result.user.emailVerified) {
    throw new Error('EMAIL_NOT_VERIFIED');
  }
  
  return result.user;
};

/**
 * Sign up with email and password
 * Automatically sends verification email
 */
export const signUpWithEmail = async (email: string, password: string): Promise<User> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Send verification email
  await sendEmailVerification(result.user);
  
  return result.user;
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
};

/**
 * Sign out
 */
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

/**
 * Get current user's ID token for API calls
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  return null;
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;

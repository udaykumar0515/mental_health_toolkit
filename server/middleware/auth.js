/**
 * Firebase Authentication Middleware
 * 
 * Verifies Firebase ID tokens from the Authorization header.
 * Attaches decoded user info to req.user
 */

import { auth } from '../firebase.js';

/**
 * Middleware to verify Firebase ID token
 * Expects: Authorization: Bearer <firebase-id-token>
 */
export const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
      picture: decodedToken.picture,
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Middleware to require email verification
 * Use after verifyFirebaseToken for routes that need verified emails
 */
export const requireEmailVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Google Sign-in users are always verified
  // Email/Password users need to verify their email
  if (!req.user.emailVerified) {
    return res.status(403).json({ 
      error: 'Email not verified',
      message: 'Please verify your email before accessing this resource'
    });
  }

  next();
};

export default verifyFirebaseToken;

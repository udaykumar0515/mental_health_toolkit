/**
 * Firebase Admin SDK Initialization
 * 
 * This module initializes Firebase Admin SDK for:
 * - Verifying Firebase Auth tokens
 * - Accessing Firestore database
 */

import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account
const serviceAccountPath = join(__dirname, 'firebase-service-account.json');
let serviceAccount;

try {
  // Option 1: Load from Environment Variable (Best for Production/Render/Heroku)
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    console.log('✅ Loaded Firebase credentials from environment variable');
  } 
  // Option 2: Load from Individual Environment Variables (Easier for some platforms)
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    serviceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Handle newlines
    };
    console.log('✅ Loaded Firebase credentials from individual env vars');
  }
  // Option 3: Load from local file (Best for Local Development)
  else {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    console.log('✅ Loaded Firebase credentials from local file');
  }
} catch (error) {
  console.error('❌ Failed to load Firebase credentials:', error.message);
  console.error('   Ensure FIREBASE_SERVICE_ACCOUNT env var is set OR individual vars (FIREBASE_PROJECT_ID, etc) OR firebase-service-account.json exists.');
  process.exit(1);
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
  console.log('🔥 Firebase Admin SDK initialized');
}

// Export Firestore and Auth
export const db = admin.firestore();
export const auth = admin.auth();

export default admin;

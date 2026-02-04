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
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
} catch (error) {
  console.error('❌ Failed to load Firebase service account:', error.message);
  console.error('   Make sure firebase-service-account.json exists in the server folder');
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

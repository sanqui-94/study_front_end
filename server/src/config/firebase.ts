import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  // In production, you would use a service account key
  // For development, we'll use the Firebase Admin SDK's default credentials
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const auth = admin.auth();
export default admin;
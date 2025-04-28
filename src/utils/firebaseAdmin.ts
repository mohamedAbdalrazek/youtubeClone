// utils/firebaseAdmin.js (This file should ONLY be used on the server-side)
import admin from 'firebase-admin';

// Check if Firebase Admin SDK is already initialized
if (!admin.apps.length) {
    try {
        // Initialize Firebase Admin SDK using service account credentials
        const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS || ""
        if (!credentials) {
            console.error('Credentials are not valid');
        }
        const serviceAccount = JSON.parse(credentials);

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            // databaseURL: 'YOUR_FIREBASE_DATABASE_URL', // Optional: If you use Realtime Database
        });

        console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase Admin SDK:', error);
    }
}

// Export the initialized admin instance and the auth and firestore services
export const authAdmin = admin.auth();
export const firestoreAdmin = admin.firestore();
// If you use Realtime Database, export that too:
// export const databaseAdmin = admin.database();
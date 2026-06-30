import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Firebase client configuration, sourced from environment variables.
 * See .env.example for where to get these values.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Initialize Firebase once and reuse the same instance everywhere.
 *
 * Next.js can re-evaluate modules in dev (hot reload) and this file is
 * imported from both Server Components (for SSR data fetching) and Client
 * Components (admin dashboard, login, forms). Without the getApps() guard,
 * Firebase would throw a "duplicate app" error.
 */
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * Firestore database instance — used by lib/jobService.ts for all
 * job-related CRUD operations (read on public pages, write from admin).
 */
export const db: Firestore = getFirestore(app);

/**
 * Firebase Authentication instance — used for admin login/logout and to
 * protect the /admin/dashboard routes.
 */
export const auth: Auth = getAuth(app);

export default app;
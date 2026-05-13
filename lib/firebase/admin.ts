import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  // Initialize with project ID (uses Application Default Credentials in production,
  // or service account key via GOOGLE_APPLICATION_CREDENTIALS env var)
  adminApp = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'uat-help',
  });

  return adminApp;
}

/**
 * Firebase Admin Auth instance for server-side token verification
 */
export const adminAuth: Auth = getAuth(getAdminApp());

/**
 * Firebase Admin Firestore instance for server-side database access
 */
export const adminDb: Firestore = getFirestore(getAdminApp());

/**
 * Verify a Firebase ID token from request headers.
 * Returns decoded token with uid, email, etc. or null if invalid.
 */
export async function verifyFirebaseToken(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return null;
  }
}

/**
 * Profile type for Firestore profile documents
 */
export type FirestoreProfile = {
  id: string;
  email?: string;
  displayName?: string;
  role?: string;
  isVerified?: boolean;
  isBlocked?: boolean;
  is_blocked?: boolean;
  photoURL?: string | null;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

/**
 * Get user profile from Firestore by UID (server-side)
 */
export async function getProfileFromAdmin(uid: string): Promise<FirestoreProfile | null> {
  try {
    const profileDoc = await adminDb.collection('profiles').doc(uid).get();
    if (!profileDoc.exists) return null;
    return { id: profileDoc.id, ...profileDoc.data() } as FirestoreProfile;
  } catch (error) {
    console.error('Error fetching profile from admin:', error);
    return null;
  }
}

/**
 * Check if a user has admin or moderator role (server-side)
 */
export async function checkAdminRoleFromAdmin(uid: string): Promise<boolean> {
  const profile = await getProfileFromAdmin(uid);
  return profile?.role === 'admin' || profile?.role === 'moderator' || profile?.role === 'super_admin';
}

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './config';

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Set persistence to LOCAL by default
setPersistence(auth, browserLocalPersistence);

/**
 * Sign up with email and password
 */
export const signUp = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with email and password
 */
export const signIn = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Sign in with Google (Popup)
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Sign in with Google (Redirect)
 * Use this for mobile or when popup is blocked
 */
export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error: any) {
    console.error('Google redirect sign-in error:', error);
    throw error;
  }
};

/**
 * Handle redirect result after Google sign-in redirect
 */
export const handleRedirectResult = async (): Promise<UserCredential | null> => {
  try {
    const result = await getRedirectResult(auth);
    return result;
  } catch (error: any) {
    console.error('Error handling redirect result:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const logOut = async (): Promise<void> => {
  return signOut(auth);
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Get the ID token for the current user
 */
export const getIdToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/**
 * Listen to authentication state changes
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return auth.onAuthStateChanged(callback);
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const { updateProfile } = await import('firebase/auth');
  return updateProfile(user, {
    displayName: displayName ?? user.displayName ?? undefined,
    photoURL: photoURL ?? user.photoURL ?? undefined,
  });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  const { sendPasswordResetEmail: firebaseSendPasswordResetEmail } = await import(
    'firebase/auth'
  );
  return firebaseSendPasswordResetEmail(auth, email);
};

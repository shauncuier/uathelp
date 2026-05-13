import { auth } from './config';
import { getDocument } from './database';

/**
 * Get the current user from the request headers
 * Extract JWT token from Authorization header and decode it
 */
export async function getCurrentUserFromRequest(request: Request): Promise<{ id: string; email: string; token: string } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify token using Firebase Admin SDK (on server side)
    // For now, return null - this needs firebase-admin setup
    // In production, use: const decodedToken = await admin.auth().verifyIdToken(token);
    
    return null;
  } catch (error) {
    console.error('Error getting current user from request:', error);
    return null;
  }
}

/**
 * Check if user has admin or moderator role
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    return profile?.role === 'admin' || profile?.role === 'moderator';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * Check if user has specific role
 */
export async function checkUserRole(userId: string, requiredRole: string): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    return profile?.role === requiredRole;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

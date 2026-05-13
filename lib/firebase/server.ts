import { verifyFirebaseToken, getProfileFromAdmin, checkAdminRoleFromAdmin } from './admin';

/**
 * Get the current user from the request headers.
 * Verifies the Firebase ID token from the Authorization header.
 */
export async function getCurrentUserFromRequest(request: Request): Promise<{ id: string; email: string; token: string } | null> {
  try {
    const decodedToken = await verifyFirebaseToken(request);
    if (!decodedToken) return null;

    return {
      id: decodedToken.uid,
      email: decodedToken.email || '',
      token: decodedToken.uid, // Use UID as reference
    };
  } catch (error) {
    console.error('Error getting current user from request:', error);
    return null;
  }
}

/**
 * Check if user has admin or moderator role
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  return checkAdminRoleFromAdmin(userId);
}

/**
 * Check if user has specific role
 */
export async function checkUserRole(userId: string, requiredRole: string): Promise<boolean> {
  try {
    const profile = await getProfileFromAdmin(userId);
    return profile?.role === requiredRole;
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
}

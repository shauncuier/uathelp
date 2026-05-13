import { getDocument, addDocument } from '@/lib/firebase/database';
import { verifyFirebaseToken, getProfileFromAdmin } from '@/lib/firebase/admin';

export type UserRole = 'student' | 'moderator' | 'admin' | 'super_admin';

export const roleHierarchy: Record<UserRole, number> = {
  student: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
};

/**
 * Hardcoded permission map by role.
 * Replace with a Firestore `rolePermissions` collection if dynamic permissions are needed.
 */
const permissionsByRole: Record<string, Record<string, boolean>> = {
  student: {
    can_create_post: false,
    can_edit_post: false,
    can_delete_post: false,
    can_moderate_comments: false,
    can_manage_users: false,
    can_manage_universities: false,
    can_access_analytics: false,
  },
  moderator: {
    can_create_post: true,
    can_edit_post: true,
    can_delete_post: false,
    can_moderate_comments: true,
    can_manage_users: false,
    can_manage_universities: true,
    can_access_analytics: true,
  },
  admin: {
    can_create_post: true,
    can_edit_post: true,
    can_delete_post: true,
    can_moderate_comments: true,
    can_manage_users: true,
    can_manage_universities: true,
    can_access_analytics: true,
  },
  super_admin: {
    can_create_post: true,
    can_edit_post: true,
    can_delete_post: true,
    can_moderate_comments: true,
    can_manage_users: true,
    can_manage_universities: true,
    can_access_analytics: true,
  },
};

/**
 * Daily chat query limits by role
 */
const queryLimitsByRole: Record<string, number> = {
  student: 20,
  moderator: 100,
  admin: 500,
  super_admin: 1000,
};

/**
 * Get the current user's profile including role (from a request)
 */
export async function getCurrentUserProfile(request?: Request) {
  if (!request) return null;

  const decodedToken = await verifyFirebaseToken(request);
  if (!decodedToken) return null;

  return getProfileFromAdmin(decodedToken.uid);
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  const profile = await getDocument('profiles', userId);
  return profile?.isBlocked || profile?.is_blocked || false;
}

/**
 * Check if user has a specific role or higher
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user has permission for an action
 */
export async function checkPermission(
  userId: string,
  permission: 'create_post' | 'edit_post' | 'delete_post' | 'moderate_comments' | 'manage_users' | 'manage_universities' | 'access_analytics'
): Promise<boolean> {
  const profile = await getDocument('profiles', userId);
  if (!profile) return false;

  const role = profile.role as string;
  const permissionKey = `can_${permission}`;
  const rolePerms = permissionsByRole[role];

  if (!rolePerms) return false;
  return Boolean(rolePerms[permissionKey]);
}

/**
 * Get user's daily chat query limit
 */
export async function getDailyQueryLimit(userId: string): Promise<number> {
  const profile = await getDocument('profiles', userId);
  if (!profile) return 0;

  return queryLimitsByRole[profile.role as string] || 0;
}

/**
 * Create audit log entry
 */
export async function logAuditAction(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  payload?: Record<string, any>
) {
  try {
    await addDocument('adminAuditLogs', {
      actorId: userId,
      action,
      entityType,
      entityId: entityId || null,
      payload: payload || {},
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

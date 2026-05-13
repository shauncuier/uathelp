import { getDocument, queryDocuments, getDocumentsByField } from '@/lib/firebase/database';
import { where } from 'firebase/firestore';
import { createAuthorizationError, createAuthenticationError, createInternalError } from '@/lib/errors';

/**
 * Hardcoded permission map by role (mirrors roles.ts)
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
 * Verify user owns a resource
 */
export async function verifyOwnership(
  userId: string,
  resourceType: 'blog_post' | 'conversation' | 'university',
  resourceId: string
): Promise<boolean> {
  try {
    const collectionMap: Record<string, string> = {
      blog_post: 'blogPosts',
      conversation: 'conversations',
      university: 'universities',
    };

    const collectionName = collectionMap[resourceType];
    const doc = await getDocument(collectionName, resourceId);

    if (!doc) return false;

    if (resourceType === 'blog_post' || resourceType === 'conversation') {
      return doc.authorId === userId || doc.author_id === userId;
    }

    return true;
  } catch (error) {
    console.error('Ownership verification error:', error);
    return false;
  }
}

/**
 * Verify user has permission for action
 */
export async function verifyPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    if (!profile) return false;

    const role = profile.role as string;
    const rolePerms = permissionsByRole[role];
    if (!rolePerms) return false;

    return Boolean(rolePerms[permission]);
  } catch (error) {
    console.error('Permission verification error:', error);
    return false;
  }
}

/**
 * Check if user is admin
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    return profile?.role === 'admin' || profile?.role === 'super_admin';
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}

/**
 * Check if user is moderator or admin
 */
export async function isModerator(userId: string): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    const role = profile?.role;
    return role === 'moderator' || role === 'admin' || role === 'super_admin';
  } catch (error) {
    console.error('Moderator check error:', error);
    return false;
  }
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  try {
    const profile = await getDocument('profiles', userId);
    return profile?.isBlocked || profile?.is_blocked || false;
  } catch (error) {
    console.error('Block status check error:', error);
    return false;
  }
}

/**
 * Get user's daily chat query count
 */
export async function getDailyQueryCount(userId: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const startOfDay = `${today}T00:00:00.000Z`;

    // Query conversations for this user today
    const conversations = await queryDocuments('conversations', [
      where('userId', '==', userId),
      where('createdAt', '>=', startOfDay),
    ]);

    return conversations.length;
  } catch (error) {
    console.error('Daily query count error:', error);
    return 0;
  }
}

/**
 * Get user's daily query limit
 */
export async function getDailyQueryLimit(userId: string): Promise<number> {
  try {
    const profile = await getDocument('profiles', userId);
    if (!profile) return 0;

    return queryLimitsByRole[profile.role as string] || 0;
  } catch (error) {
    console.error('Query limit error:', error);
    return 0;
  }
}

/**
 * Check if user can query chat
 */
export async function canQueryChat(userId: string): Promise<{ allowed: boolean; remaining: number }> {
  try {
    const [count, limit] = await Promise.all([
      getDailyQueryCount(userId),
      getDailyQueryLimit(userId),
    ]);

    const allowed = count < limit;
    const remaining = Math.max(0, limit - count);

    return { allowed, remaining };
  } catch (error) {
    console.error('Chat query check error:', error);
    return { allowed: false, remaining: 0 };
  }
}

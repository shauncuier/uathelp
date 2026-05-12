import { createClient } from '@/lib/supabase/server';
import { createAuthorizationError, createAuthenticationError, createInternalError } from '@/lib/errors';

/**
 * Verify user owns a resource
 */
export async function verifyOwnership(
  userId: string,
  resourceType: 'blog_post' | 'conversation' | 'university',
  resourceId: string
): Promise<boolean> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from(`${resourceType}s`)
      .select('id')
      .eq('id', resourceId);

    if (resourceType === 'blog_post' || resourceType === 'conversation') {
      query = query.eq('author_id', userId);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return false;
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
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) {
      return false;
    }

    const { data: rolePerms } = await supabase
      .from('role_permissions')
      .select(permission)
      .eq('role', profile.role)
      .single();

    if (!rolePerms) {
      return false;
    }

    return Boolean((rolePerms as any)[permission]);
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
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

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
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

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
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_blocked')
      .eq('id', userId)
      .single();

    return profile?.is_blocked || false;
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
    const supabase = await createClient();
    const today = new Date().toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('conversations')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lt('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.error('Query count error:', error);
      return 0;
    }

    return count || 0;
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
    const supabase = await createClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile) {
      return 0;
    }

    const { data: rolePerms } = await supabase
      .from('role_permissions')
      .select('max_daily_chat_queries')
      .eq('role', profile.role)
      .single();

    return rolePerms?.max_daily_chat_queries || 0;
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

import { createClient as createSupabaseClient } from '@/lib/supabase/server';

export type UserRole = 'student' | 'moderator' | 'admin' | 'super_admin';

export const roleHierarchy: Record<UserRole, number> = {
  student: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
};

/**
 * Get the current user's profile including role
 */
export async function getCurrentUserProfile() {
  const supabase = await createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

/**
 * Check if user is blocked
 */
export async function isUserBlocked(userId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_blocked')
    .eq('id', userId)
    .single();

  return profile?.is_blocked || false;
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
  const supabase = await createSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  const permissionMap: Record<string, string> = {
    create_post: 'can_create_post',
    edit_post: 'can_edit_post',
    delete_post: 'can_delete_post',
    moderate_comments: 'can_moderate_comments',
    manage_users: 'can_manage_users',
    manage_universities: 'can_manage_universities',
    access_analytics: 'can_access_analytics',
  };

  const { data: rolePerms } = await supabase
    .from('role_permissions')
    .select(permissionMap[permission])
    .eq('role', profile.role)
    .single();

  if (!rolePerms) return false;
  const key = permissionMap[permission] as keyof typeof rolePerms;
  const result = rolePerms[key];
  return Boolean(result);
}

/**
 * Get user's daily chat query limit
 */
export async function getDailyQueryLimit(userId: string): Promise<number> {
  const supabase = await createSupabaseClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!profile) return 0;

  const { data: rolePerms } = await supabase
    .from('role_permissions')
    .select('max_daily_chat_queries')
    .eq('role', profile.role)
    .single();

  return rolePerms?.max_daily_chat_queries || 0;
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
  const supabase = await createSupabaseClient();

  await supabase.from('admin_audit_logs').insert({
    actor_id: userId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    payload: payload || {},
  });
}

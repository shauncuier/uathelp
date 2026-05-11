import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';

export type RouteProtection = {
  requireAuth?: boolean;
  requireRole?: 'student' | 'moderator' | 'admin' | 'super_admin';
  redirectTo?: string;
};

/**
 * Higher-order function to protect routes with auth and role checks
 */
export function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  protection: RouteProtection = { requireAuth: true }
) {
  return async (req: NextRequest, context: any) => {
    const response = NextResponse.next({ request: req });
    const supabase = createMiddlewareClient(req, response);

    const { data: { user } } = await supabase.auth.getUser();

    // Check authentication
    if (protection.requireAuth && !user) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in' },
        { status: 401 }
      );
    }

    // Check role if required
    if (protection.requireRole && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_blocked')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }

      if (profile.is_blocked) {
        return NextResponse.json(
          { error: 'Account has been blocked' },
          { status: 403 }
        );
      }

      const roleHierarchy: Record<string, number> = {
        student: 1,
        moderator: 2,
        admin: 3,
        super_admin: 4,
      };

      const userLevel = roleHierarchy[profile.role as string] || 0;
      const requiredLevel = roleHierarchy[protection.requireRole] || 0;

      if (userLevel < requiredLevel) {
        return NextResponse.json(
          { error: `Forbidden: Requires ${protection.requireRole} role or higher` },
          { status: 403 }
        );
      }
    }

    return handler(req, context);
  };
}

/**
 * Middleware to check auth on page routes
 */
export async function checkRouteAuth(
  request: NextRequest,
  response: NextResponse,
  requiredRole?: string
): Promise<{ authorized: boolean; user?: any; profile?: any }> {
  const supabase = createMiddlewareClient(request, response);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { authorized: false };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return { authorized: false };
  }

  if (profile.is_blocked) {
    return { authorized: false };
  }

  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      student: 1,
      moderator: 2,
      admin: 3,
      super_admin: 4,
    };

    const userLevel = roleHierarchy[profile.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return { authorized: false };
    }
  }

  return { authorized: true, user, profile };
}

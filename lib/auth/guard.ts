import { NextResponse, type NextRequest } from 'next/server';
import { verifyFirebaseToken, getProfileFromAdmin } from '@/lib/firebase/admin';

export type RouteProtection = {
  requireAuth?: boolean;
  requireRole?: 'student' | 'moderator' | 'admin' | 'super_admin';
  redirectTo?: string;
};

/**
 * Higher-order function to protect routes with auth and role checks.
 * Uses Firebase Admin SDK to verify ID tokens from Authorization header.
 */
export function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  protection: RouteProtection = { requireAuth: true }
) {
  return async (req: NextRequest, context: any) => {
    const decodedToken = await verifyFirebaseToken(req);

    // Check authentication
    if (protection.requireAuth && !decodedToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in' },
        { status: 401 }
      );
    }

    // Check role if required
    if (protection.requireRole && decodedToken) {
      const profile = await getProfileFromAdmin(decodedToken.uid);

      if (!profile) {
        return NextResponse.json(
          { error: 'User profile not found' },
          { status: 404 }
        );
      }

      if (profile.isBlocked || profile.is_blocked) {
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
 * Check auth on page routes (server-side)
 */
export async function checkRouteAuth(
  request: NextRequest,
  _response: NextResponse,
  requiredRole?: string
): Promise<{ authorized: boolean; user?: any; profile?: any }> {
  const decodedToken = await verifyFirebaseToken(request);

  if (!decodedToken) {
    return { authorized: false };
  }

  const profile = await getProfileFromAdmin(decodedToken.uid);

  if (!profile) {
    return { authorized: false };
  }

  if (profile.isBlocked || profile.is_blocked) {
    return { authorized: false };
  }

  if (requiredRole) {
    const roleHierarchy: Record<string, number> = {
      student: 1,
      moderator: 2,
      admin: 3,
      super_admin: 4,
    };

    const userLevel = roleHierarchy[profile.role as string] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    if (userLevel < requiredLevel) {
      return { authorized: false };
    }
  }

  return { authorized: true, user: decodedToken, profile };
}

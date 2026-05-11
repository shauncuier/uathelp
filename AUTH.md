# Authentication & Role Management System

## Overview

UAT Help implements a comprehensive role-based access control (RBAC) system with four user roles:

- **Student** (Level 1): Default role for new users. Can use AI chat, browse universities, read blog articles, and save favorites.
- **Moderator** (Level 2): Can create/edit content, moderate comments, access analytics, higher chat query limits.
- **Admin** (Level 3): Full platform management, user management, content moderation, all moderator permissions.
- **Super Admin** (Level 4): System administration, highest permissions, unlimited resources.

## Database Schema

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role (student|moderator|admin|super_admin),
  is_verified BOOLEAN,
  is_blocked BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  email_notifications BOOLEAN,
  deadline_reminders BOOLEAN,
  product_updates BOOLEAN,
  weekly_digest BOOLEAN,
  theme_preference TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Role Permissions Table
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY,
  role user_role UNIQUE,
  can_create_post BOOLEAN,
  can_edit_post BOOLEAN,
  can_delete_post BOOLEAN,
  can_moderate_comments BOOLEAN,
  can_manage_users BOOLEAN,
  can_manage_universities BOOLEAN,
  can_access_analytics BOOLEAN,
  max_daily_chat_queries INTEGER
);
```

## Auth Flow

### 1. Signup
- User signs up with email/password or OAuth (Google)
- Profile created automatically with `role: 'student'`, `is_verified: false`, `is_blocked: false`
- User is logged in immediately

### 2. Login
- User signs in with credentials
- Middleware checks session and refreshes token if needed
- Profile is fetched to check permissions

### 3. Protected Routes
- `/dashboard/*` - Requires authentication (student+)
- `/chat` - Requires authentication (student+)
- `/admin/*` - Requires `admin` or `super_admin` role
- Public routes - No authentication required

### 4. User Settings
- `/dashboard/settings` - Profile, notification, and theme preferences
- Settings are stored in `profiles` and `user_preferences`
- Session security remains handled by Supabase cookies

### 5. Blocked Accounts
- If `is_blocked = true`, user is redirected to `/blocked` page
- Admin can block/unblock users in user management

## Authorization Helpers

### `lib/auth/roles.ts`
```typescript
// Check if user has required role
hasRole(userRole, requiredRole) -> boolean

// Get current user profile
getCurrentUserProfile() -> Profile | null

// Check if user is blocked
isUserBlocked(userId) -> boolean

// Check specific permission
checkPermission(userId, permission) -> boolean

// Get daily chat query limit
getDailyQueryLimit(userId) -> number

// Log admin actions
logAuditAction(userId, action, entityType, entityId, payload) -> void
```

### `lib/auth/guard.ts`
```typescript
// Protect API routes with auth and role checks
withAuth(handler, protection) -> Handler

// Check auth on middleware/routes
checkRouteAuth(request, response, requiredRole) -> { authorized, user, profile }
```

## Role Hierarchy

Roles follow a hierarchy system where higher roles inherit permissions from lower roles:

```
Super Admin (4)
    ↓
Admin (3)
    ↓
Moderator (2)
    ↓
Student (1)
```

## Permissions by Role

| Permission | Student | Moderator | Admin | Super Admin |
|-----------|---------|-----------|-------|-----------|
| Create Posts | ❌ | ✅ | ✅ | ✅ |
| Edit Posts | ❌ | ✅ | ✅ | ✅ |
| Delete Posts | ❌ | ❌ | ✅ | ✅ |
| Moderate Comments | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ✅ | ✅ |
| Manage Universities | ❌ | ❌ | ✅ | ✅ |
| Access Analytics | ❌ | ✅ | ✅ | ✅ |
| Daily Chat Queries | 50 | 200 | 500 | 1000 |

## Middleware Implementation

### `proxy.ts`
The middleware:
1. Updates session for all requests
2. Checks authentication for protected routes
3. Creates profile on first login
4. Checks if user is blocked
5. Validates admin role for admin routes

## Security Features

1. **Row-Level Security (RLS)**
   - All tables have RLS enabled
   - Users can only access their own data
   - Admin users can access all data

2. **Role-Based Access Control**
   - Routes are protected by role hierarchy
   - Permissions are checked server-side
   - Admin actions are logged

3. **Account Protection**
   - Accounts can be blocked by admin
   - Session management via Supabase
   - OAuth support for social login

4. **Audit Logging**
   - All admin actions are logged
   - Tracks who made changes and when
   - Useful for compliance and debugging

## Admin Panel

### User Management (`/admin/users`)
- View all users with their roles
- Change user roles
- Block/unblock accounts
- View verification status

### Other Admin Features
- `/admin/blog` - Manage blog posts
- `/admin/circulars` - Manage admission circulars
- `/admin/universities` - Manage university data
- `/admin/analytics` - View platform analytics

## Setting Up Initial Admin

To create an admin user in Supabase SQL Editor:

```sql
-- Update an existing user to admin
UPDATE profiles 
SET role = 'admin', is_verified = true 
WHERE email = 'admin@uathelp.com';
```

## Common Tasks

### Promote User to Moderator
```typescript
const { error } = await supabase
  .from('profiles')
  .update({ role: 'moderator' })
  .eq('id', userId);
```

### Block a User
```typescript
const { error } = await supabase
  .from('profiles')
  .update({ is_blocked: true })
  .eq('id', userId);
```

### Check User Permissions
```typescript
const canCreatePost = await checkPermission(userId, 'create_post');
```

### Log Admin Action
```typescript
await logAuditAction(
  adminUserId,
  'user_promoted',
  'user',
  targetUserId,
  { from_role: 'student', to_role: 'moderator' }
);
```

## Testing Auth Flow

1. **Sign Up** - Create new student account
2. **Access Dashboard** - Should succeed (student has access)
3. **Access Admin** - Should redirect to dashboard (no admin role)
4. **Login as Admin** - Update role in DB, refresh, should have access
5. **Block User** - Set `is_blocked = true`, logout, try login - should see blocked page

## Troubleshooting

### "Unauthorized: Please sign in"
- Session expired
- Not authenticated
- Solution: Clear cookies and login again

### "Forbidden: Requires admin role"
- User doesn't have required role
- Solution: Admin needs to promote user or use different account

### Session not persisting
- Middleware not properly configured
- Cookies blocked
- Solution: Check browser cookie settings, verify Supabase config

### Role changes not taking effect
- Client cached old profile data
- Solution: Refresh page or clear browser cache

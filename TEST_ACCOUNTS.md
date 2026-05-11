/**
 * Test Credentials Helper
 * 
 * Use these test emails to work around Supabase rate limits during development
 * Supabase allows 4 emails per hour per address, so rotate between test accounts
 */

export const TEST_ACCOUNTS = [
  {
    email: "test+student1@uathelp.dev",
    password: "SecureTestPass123!",
    name: "Test Student 1",
    role: "student",
  },
  {
    email: "test+student2@uathelp.dev",
    password: "SecureTestPass123!",
    name: "Test Student 2",
    role: "student",
  },
  {
    email: "test+moderator@uathelp.dev",
    password: "SecureTestPass123!",
    name: "Test Moderator",
    role: "moderator",
  },
  {
    email: "test+admin@uathelp.dev",
    password: "SecureTestPass123!",
    name: "Test Admin",
    role: "admin",
  },
];

/**
 * Setup instructions for testing:
 * 
 * 1. Sign up with different test accounts
 * 2. Promote to different roles in Supabase:
 * 
 *    UPDATE profiles SET role = 'moderator' WHERE email = 'test+moderator@uathelp.dev';
 *    UPDATE profiles SET role = 'admin' WHERE email = 'test+admin@uathelp.dev';
 * 
 * 3. Test the following flows:
 *    - Student access: Login as test+student1 → Access /dashboard
 *    - Admin access: Login as test+admin → Access /admin/users
 *    - Role blocking: Login as student → Try /admin → Should redirect
 *    - Account blocking: Admin blocks student → Student redirected to /blocked
 * 
 * 4. If you hit rate limits:
 *    - Wait 1 hour before using same email
 *    - Use next test account
 *    - Or disable email verification in Supabase settings
 */

/**
 * Manual test scenarios
 */
export const TEST_SCENARIOS = [
  {
    name: "Student Dashboard Access",
    steps: [
      "1. Sign up with test+student1@uathelp.dev",
      "2. Dashboard opens automatically",
      "3. Verify role badge shows 'Student'",
      "4. Try to access /admin → Should redirect to /dashboard",
    ],
  },
  {
    name: "Admin User Management",
    steps: [
      "1. In Supabase, promote test+admin@uathelp.dev to 'admin'",
      "2. Sign in as admin",
      "3. Navigate to /admin/users",
      "4. View all users in table",
      "5. Change test+student1 role to 'moderator'",
      "6. Block test+student2 account",
      "7. Login as test+student2 → Should see /blocked page",
    ],
  },
  {
    name: "Role Hierarchy",
    steps: [
      "1. Sign up as test+student3",
      "2. Promote to moderator in DB",
      "3. Login and go to /admin → Should redirect (moderator can't access admin)",
      "4. Promote same user to admin",
      "5. Login again, /admin should now work",
    ],
  },
  {
    name: "Account Blocking",
    steps: [
      "1. Login as admin",
      "2. Go to /admin/users",
      "3. Find test+student1 and click block button",
      "4. Logout",
      "5. Try to login as test+student1",
      "6. Should see /blocked page",
      "7. Unblock and try again → Should work",
    ],
  },
];

/**
 * Quick verification checklist
 */
export const VERIFICATION_CHECKLIST = [
  "✓ Signup creates profile with role='student'",
  "✓ Dashboard requires authentication",
  "✓ Admin routes require admin role",
  "✓ Role badge displays on dashboard",
  "✓ User management page shows all users",
  "✓ Role can be changed via dropdown",
  "✓ Block/unblock buttons work",
  "✓ Blocked users see /blocked page",
  "✓ Logout works from dashboard",
  "✓ Login with redirectTo works",
];

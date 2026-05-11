# Seeding Test Users

This guide explains how to create test users for UAT Help testing.

## Test Users Available

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| student1@test.uathelp.com | TestPass123!@# | Student | Test student access |
| student2@test.uathelp.com | TestPass123!@# | Student | Test multiple students |
| moderator@test.uathelp.com | TestPass123!@# | Moderator | Test moderator features |
| admin@test.uathelp.com | TestPass123!@# | Admin | Test admin panel |
| superadmin@test.uathelp.com | TestPass123!@# | Super Admin | Test system admin |

## Method 1: Using Node.js Script (Recommended)

This method creates both auth users and profiles automatically.

### Prerequisites
```bash
npm install
```

### Run the script
```bash
NEXT_PUBLIC_SUPABASE_URL=your-url \
SUPABASE_SERVICE_ROLE_KEY=your-key \
npx ts-node scripts/seed-users.ts
```

Or if using `.env.local`:
```bash
npx ts-node scripts/seed-users.ts
```

### Output
The script will:
1. Create auth users in Supabase
2. Create corresponding profiles
3. Display all test credentials
4. Handle duplicates gracefully (update if exists)

## Method 2: Manual via Supabase Dashboard

### Step 1: Create Auth Users
1. Open Supabase Dashboard
2. Go to Authentication → Users
3. Click "Create new user" for each test user:
   - Email: student1@test.uathelp.com
   - Password: TestPass123!@#
   - Mark as confirmed: ✓
4. Repeat for all 5 test users

### Step 2: Create Profiles (SQL)
1. Go to SQL Editor
2. Copy content from `scripts/seed-users.sql`
3. Paste into editor
4. Click "Run"

## Method 3: Only Profiles (If Auth Users Exist)

If you already have auth users, just run the SQL:

1. Supabase Dashboard → SQL Editor
2. Run `scripts/seed-users.sql`
3. Profiles will be created/updated

## Testing Workflow

### Test 1: Student Access
```
1. Visit http://localhost:3000/signup
2. OR login with: student1@test.uathelp.com / TestPass123!@#
3. Access /dashboard → Should work
4. Try /admin → Should redirect to /dashboard
```

### Test 2: Moderator Features
```
1. Login as: moderator@test.uathelp.com / TestPass123!@#
2. Access /dashboard → Should work
3. Try /admin → Should redirect (moderator can't access)
4. Check analytics access (if implemented)
```

### Test 3: Admin Panel
```
1. Login as: admin@test.uathelp.com / TestPass123!@#
2. Access /admin/users → Should work
3. See all 5 test users in table
4. Try changing student1 role to moderator
5. Try blocking student2
6. Verify changes in real-time
```

### Test 4: Account Blocking
```
1. Login as admin
2. Go to /admin/users
3. Find student1 and click block button
4. Logout
5. Try to login as student1
6. Should see /blocked page
7. Block user again and test
```

### Test 5: Role Hierarchy
```
1. Login as student1
2. Try /admin → Redirected to /dashboard
3. Promote student1 to moderator (via admin panel)
4. Logout
5. Login as student1 again
6. Try /admin → Still redirected (moderator can't access)
7. Promote to admin
8. Login and try /admin → Now works!
```

## Cleanup (Optional)

### Delete Test Users (SQL)
```sql
DELETE FROM public.profiles 
WHERE email LIKE '%@test.uathelp.com';

DELETE FROM auth.users 
WHERE email LIKE '%@test.uathelp.com';
```

### Or via Supabase Dashboard
- Authentication → Users
- Select each test user
- Click "Delete user"

## Troubleshooting

### "User already exists"
- This is expected if running seed multiple times
- Script will update existing profiles
- Safe to run repeatedly

### "Cannot find auth users"
- Make sure auth users were created first
- Run Step 1 (Create Auth Users) manually in Dashboard
- Then run SQL to create profiles

### "Email rate limit exceeded"
- Supabase free tier limits 4 emails/hour
- Wait 1 hour before creating new users
- Or disable email confirmation in Supabase settings

### "Access denied" error
- Check SUPABASE_SERVICE_ROLE_KEY is set
- Verify it has admin privileges
- Check `.env.local` file exists and is correct

## Verification

### Check if users were created
```sql
SELECT id, email, full_name, role, is_verified, is_blocked
FROM public.profiles
WHERE email LIKE '%@test.uathelp.com'
ORDER BY created_at DESC;
```

### Check auth users
```sql
SELECT id, email, email_confirmed_at
FROM auth.users
WHERE email LIKE '%@test.uathelp.com';
```

## Tips

1. **Save credentials** - Keep test credentials handy for manual testing
2. **Use different emails** - Avoid rate limiting by using test domain
3. **Reset regularly** - Run cleanup + reseed for fresh test state
4. **Automate in CI/CD** - Add seed script to test pipeline
5. **Separate test/prod** - Never mix test users with production data

## Next Steps

After seeding test users:
1. Test signup/login flow
2. Test dashboard access
3. Test admin panel functionality
4. Test role-based access
5. Test user management features
6. Test account blocking

See `TEST_ACCOUNTS.md` for full testing scenarios.

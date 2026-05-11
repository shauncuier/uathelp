# Email Rate Limit Solutions

## Problem
Supabase has rate limits on authentication emails to prevent abuse. By default:
- 4 emails per hour per email address
- Rate limits apply to signup, password reset, email confirmation resends

## Solutions

### Development Environment

#### Option 1: Use Different Email Addresses
- test1@example.com
- test2@example.com
- test3@example.com
- Wait 1 hour before retrying same email

#### Option 2: Disable Email Verification (Development Only)
In Supabase Dashboard:
1. Go to Authentication → Providers → Email
2. Disable "Confirm email"
3. Users will be immediately verified after signup

#### Option 3: Use Magic Links Only
Configure Supabase to use passwordless magic links instead:
```typescript
// In login page
await supabase.auth.signInWithOtp({ email });
```

### Production Environment

#### Upgrade Supabase Plan
- Free tier: 4 emails/hour
- Pro tier: Higher limits + custom domain emails
- Upgrade at: https://supabase.com/dashboard/project/settings/billing/usage

#### Use Custom Email Provider
Configure SendGrid, Mailgun, or AWS SES in Supabase:
1. Go to Authentication → Email Templates
2. Add custom SMTP settings
3. Unlimited email sending (based on provider)

#### Implement Client-Side Rate Limiting
Prevent multiple signup attempts:
```typescript
const [lastAttempt, setLastAttempt] = useState(0);

const handleSignup = async () => {
  const now = Date.now();
  if (now - lastAttempt < 60000) { // 1 minute delay
    setError("Please wait before trying again");
    return;
  }
  setLastAttempt(now);
  // proceed with signup
};
```

## Current Status

Your Supabase project has:
- Email verification: ENABLED
- Rate limit: 4 emails/hour
- Email provider: Default Supabase

## Recommended Fix for Development

**Temporarily disable email confirmation:**

1. Open Supabase Dashboard
2. Go to: Authentication → Providers → Email
3. Toggle OFF: "Confirm email"
4. Users will be immediately verified
5. Re-enable before production

This allows unlimited signups in development without rate limit issues.

## For Testing

Use test credentials:
- test+dev1@example.com
- test+dev2@example.com
- test+dev3@example.com
- test+dev4@example.com (wait 1 hour, or use new email)

## Database Check

To verify email verification is stored:
```sql
SELECT id, email, email_confirmed_at, confirmed_at 
FROM auth.users 
LIMIT 10;
```

If `email_confirmed_at` is NULL, email verification is pending/disabled.

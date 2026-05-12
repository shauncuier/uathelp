# UAT Help - Implementation Roadmap

## Phase 1: CRITICAL (This Week) - Unblock Production

### 1.1 Create Root Middleware (2 hours) ⚠️ BLOCKING
**Why:** Routes currently not protected, anyone can access /admin

**File to create:** \/middleware.ts\

\\\	ypescript
import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/supabase/middleware';
import { checkRouteAuth } from '@/lib/auth/guard';

const protectedRoutes = ['/dashboard', '/chat', '/admin'];
const adminRoutes = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route needs protection
  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));
  if (!needsAuth) return NextResponse.next();

  // Create Supabase client
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareClient(request, response);

  // Get user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login?redirectTo=' + pathname, request.url));
  }

  // Check if blocked
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_blocked, role')
    .eq('id', user.id)
    .single();

  if (profile?.is_blocked) {
    return NextResponse.redirect(new URL('/blocked', request.url));
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    const adminRoles = ['admin', 'super_admin'];
    if (!adminRoles.includes(profile?.role)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/chat/:path*',
    '/admin/:path*',
  ]
};
\\\

### 1.2 Add Input Validation with Zod (2 hours)
**Why:** Forms currently accept any input

**Install:** \
pm install zod\

**Create:** \lib/schemas/auth.ts\

\\\	ypescript
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be 8+ chars'),
});
\\\

**Update:** \pp/(auth)/login/page.tsx\

\\\	ypescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    setError(result.error.errors[0].message);
    return;
  }
  
  // proceed with login...
};
\\\

### 1.3 Email Verification (2-3 hours)
**Why:** Currently skips email confirmation

**Option A: Use Supabase Email (Free tier limit: 4/hour)**
- Enable "Email Confirmations Required" in Supabase
- Update signup response handling

**Option B: Use SendGrid/Resend (Recommended)**
\\\ash
npm install resend
\\\

**Create:** \pp/api/auth/send-verification/route.ts\

\\\	ypescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, code } = await req.json();
  
  await resend.emails.send({
    from: 'noreply@uathelp.com',
    to: email,
    subject: 'Verify your UAT Help account',
    html: \Click this link to verify: ...\,
  });
  
  return Response.json({ ok: true });
}
\\\

---

## Phase 2: IMPORTANT (Next 2 Weeks) - Complete Features

### 2.1 Admin University CRUD (4 hours)
**Status:** UI exists, missing backend

**Create:** \pp/api/admin/universities/route.ts\

\\\	ypescript
// POST - Create university
export async function POST(req: Request) {
  const { name, slug, type, location, minGpa } = await req.json();
  
  const supabase = await createClient();
  const result = await supabase
    .from('universities')
    .insert([{ name, slug, type, location, min_gpa: minGpa }]);
  
  return Response.json(result);
}

// PUT - Update university
export async function PUT(req: Request) {
  const { id, ...data } = await req.json();
  const supabase = await createClient();
  return supabase.from('universities').update(data).eq('id', id);
}

// DELETE - Delete university
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const supabase = await createClient();
  return supabase.from('universities').delete().eq('id', id);
}
\\\

**Update:** \pp/(admin)/admin/universities/page.tsx\ to use API

### 2.2 Move Hardcoded Data to Database (3 hours)

**Blog posts** - Move from \pp/(marketing)/blog/[slug]/page.tsx\ to Supabase

**Notifications** - Query \dmin_audit_logs\ instead of hardcoding

**Create:** \lib/queries/notifications.ts\

\\\	ypescript
export async function getNotifications(userId: string) {
  const supabase = await createClient();
  return supabase
    .from('admin_audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
}
\\\

### 2.3 Add Pagination (2 hours)

**Create:** \components/ui/pagination.tsx\

**Update** admin tables:

\\\	ypescript
const [page, setPage] = useState(0);
const limit = 50;
const offset = page * limit;

const { data, count } = await supabase
  .from('profiles')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1)
  .order('created_at', { ascending: false });

const totalPages = Math.ceil((count || 0) / limit);
\\\

### 2.4 Refactor Large Components (3-4 hours)

**ChatInterface** - Split into hooks + smaller components

\\\	ypescript
// hooks/useChat.ts
export function useChat() { /* existing logic */ }

// components/ChatMessage.tsx
export function ChatMessage({ message }) { /* render */ }

// components/ChatInput.tsx
export function ChatInput({ onSend }) { /* input */ }

// components/chat-interface.tsx - now just composes above
\\\

### 2.5 Add Rate Limiting (2 hours)

**npm install** \@vercel/kv\

**Create:** \lib/rate-limit.ts\

\\\	ypescript
import { Ratelimit } from '@vercel/kv';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.fixedWindow(5, '60 s'), // 5 per minute
});

export async function checkRateLimit(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
\\\

---

## Phase 3: POLISH (Next Month) - Full Feature Completion

### 3.1 Email Notifications (4 hours)
- Deadline reminders
- Weekly digest
- Product updates

### 3.2 Search Functionality (3 hours)
- Full-text search on universities
- Search on blog posts
- Search on circulars

### 3.3 Save/Bookmark Features (2 hours)
- Implement save university button
- Implement bookmark add/remove
- Real database persistence

### 3.4 Analytics Dashboard (4 hours)
- Real data queries
- Charts (use Chart.js or Recharts)
- Time-series data

### 3.5 Payment System (if needed) (8 hours)
- Stripe integration
- Subscription tiers
- Premium features

---

## Phase 4: QUALITY (2 Months) - Testing & Optimization

### 4.1 Add Test Suite (ongoing)
\\\ash
npm install --save-dev jest @testing-library/react
\\\

Start with critical paths:
- Auth flows
- Chat endpoint
- Admin CRUD endpoints

### 4.2 Performance Optimization
- Image optimization
- Code splitting
- Caching strategy

### 4.3 Monitoring & Analytics
- Sentry for error tracking
- PostHog or Plausible for analytics
- Custom monitoring alerts

---

## ESTIMATED EFFORT

| Phase | Duration | Priority | Effort |
|-------|----------|----------|--------|
| Phase 1 (Critical) | 1 week | 🔴 MUST | 6-8 hours |
| Phase 2 (Important) | 2 weeks | 🟠 SHOULD | 15-20 hours |
| Phase 3 (Complete) | 1 month | 🟡 NICE | 20-25 hours |
| Phase 4 (Quality) | Ongoing | 🟢 LATER | 40+ hours |

**Total for MVP:** 21-28 hours (3-4 weeks)

---

## DATABASE OPERATIONS NEEDED

### Enable in Supabase Admin Panel
- [ ] Email confirmations (for auth.users)
- [ ] Set up SMTP or use Resend
- [ ] Configure rate limit table (if using KV)
- [ ] Enable audit logging

### SQL to Run
\\\sql
-- Create audit log index for faster queries
CREATE INDEX IF NOT EXISTS audit_logs_created_at_idx 
  ON admin_audit_logs(created_at DESC);

-- Create full-text search on universities
CREATE INDEX IF NOT EXISTS universities_search_idx 
  ON universities USING gin(to_tsvector('english', name || ' ' || location));

-- Create full-text search on blog posts  
CREATE INDEX IF NOT EXISTS blog_search_idx 
  ON blog_posts USING gin(to_tsvector('english', title || ' ' || content));
\\\

---

## ENVIRONMENT VARIABLES TO ADD

\\\nv
# Email service
RESEND_API_KEY=re_...
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=SG.xxx

# Rate limiting (if using Vercel KV)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Monitoring
SENTRY_DSN=https://...

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=...
\\\

---

## QUICK WINS (Easy Wins, High Impact)

1. **Add .trim() to inputs** - 5 min
   - Prevents whitespace issues
   
2. **Add required attributes** - 10 min
   - \<input required />\
   
3. **Add error boundaries** - 30 min
   - Catch component crashes
   
4. **Add form disabled states** - 15 min
   - Prevent double submissions
   
5. **Add loading skeletons** - 30 min
   - Better UX during loads

---

## SUCCESS METRICS

Once complete, measure:
- [ ] All protected routes redirect correctly
- [ ] Forms reject invalid input
- [ ] Email verification works
- [ ] Admin can create/edit universities
- [ ] Paginated tables work properly
- [ ] Large components load faster
- [ ] Rate limiting prevents abuse
- [ ] Error tracking shows no console errors
- [ ] User can save/bookmark items
- [ ] Analytics dashboard shows real data

---

## TEAM COORDINATION

### Suggested Sprint Plan

**Sprint 1 (3-4 days):**
- Middleware (dev A)
- Input validation (dev B)
- Email setup (dev C)

**Sprint 2 (1 week):**
- Admin CRUD (dev A)
- Pagination (dev B)
- Data migration (dev C)

**Sprint 3 (1 week):**
- Component refactoring (dev A)
- Rate limiting (dev B)
- Testing (dev C)

---

**Last Updated:** May 13, 2026  
**Status:** Ready for Implementation

# UAT Help

AI-powered university admission platform for Bangladeshi students.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Supabase + PostgreSQL
- Mistral AI

## Features

- 🎨 Premium landing page with animations
- 🤖 AI admission assistant with streaming responses
- 🏫 University database with advanced filters
- 📊 Student dashboard with role-based access
- 👨‍💼 Admin panel with user management
- 🔐 Role-based access control (Student, Moderator, Admin, Super Admin)
- 💬 AI chat with answer caching
- 🔑 Supabase authentication with Google OAuth
- 📱 Mobile-responsive design
- 🌐 SEO optimized (sitemap, robots, metadata)

## Architecture

### User Roles
- **Student** (default) - Browse universities, use AI chat, save favorites
- **Moderator** - Create/edit content, moderate comments, view analytics  
- **Admin** - Full management, user control, platform administration
- **Super Admin** - System-wide administration

### Protected Routes
- `/dashboard/*` - Requires authentication (student+)
- `/chat` - Requires authentication (student+)
- `/admin/*` - Requires admin role (admin+)

### Public Routes
- `/` - Landing page
- `/login`, `/signup` - Authentication
- `/blog`, `/universities` - Public content
- `/blocked` - Blocked account notification

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Setup

Copy `.env.example` to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://...
MISTRAL_API_KEY=your-mistral-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Database Setup

1. Create a new Supabase project
2. Run `scripts/init-db.sql` in the Supabase SQL editor
3. This creates all necessary tables, indexes, and RLS policies

**Tables Created:**
- `profiles` - User profiles with roles
- `role_permissions` - Role-based permissions
- `universities` - University data
- `admission_circulars` - Admission announcements
- `blog_posts` - Blog articles
- `conversations` - AI chat conversations
- `chat_question_cache` - Cached AI responses
- `admin_audit_logs` - Admin action logs

## Authentication Flow

### Signup
```
1. User fills signup form
2. Email verification (if enabled)
3. Profile created with role='student'
4. Redirected to dashboard
```

### Login
```
1. User enters credentials
2. Session created via Supabase
3. Profile fetched with role
4. Redirected to dashboard or requested page
```

### Admin Setup
After database setup, create first admin:

```sql
UPDATE profiles 
SET role = 'admin', is_verified = true 
WHERE email = 'your-email@example.com';
```

## Test Users

### Quick Setup
Create test users for development:

```bash
# Using Node.js script
npx ts-node scripts/seed-users.ts
```

### Test Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Student | student1@test.uathelp.com | TestPass123!@# | `/dashboard`, `/chat` |
| Student | student2@test.uathelp.com | TestPass123!@# | `/dashboard`, `/chat` |
| Moderator | moderator@test.uathelp.com | TestPass123!@# | `/dashboard`, moderate content |
| Admin | admin@test.uathelp.com | TestPass123!@# | `/admin/users`, full platform control |
| Super Admin | superadmin@test.uathelp.com | TestPass123!@# | All admin features |

### Testing Workflows

**Student Access:**
```
1. Login as student1@test.uathelp.com
2. Access /dashboard (should work)
3. Try /admin/users (should redirect to /dashboard)
4. Use AI chat at /chat
```

**Admin Features:**
```
1. Login as admin@test.uathelp.com
2. Navigate to /admin/users
3. View all users in management table
4. Change user roles
5. Block/unblock accounts
```

**Blocked Account:**
```
1. Login as admin
2. Go to /admin/users → Block student2
3. Logout and try to login as student2
4. Should see /blocked page
```

See `SEED_USERS.md` for manual setup and `TEST_ACCOUNTS.md` for detailed testing guide.

## Email Rate Limiting

Supabase has rate limits on authentication emails:
- **Free tier**: 4 emails/hour per address
- **Solution for dev**: Disable email verification in Supabase settings
- **Solution for prod**: Upgrade plan or use custom SMTP

See `EMAIL_RATE_LIMIT.md` for details.

## Testing

### Test Accounts
Use different emails to avoid rate limits:
- test+student1@example.com
- test+student2@example.com
- test+admin@example.com

Promote admin account in database for testing admin features.

### Test Scenarios
See `TEST_ACCOUNTS.md` for complete testing guide.

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
```

## Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database initialization script
- [ ] Create first admin user
- [ ] Test signup/login flow
- [ ] Test dashboard access
- [ ] Test admin panel
- [ ] Configure Supabase OAuth callback URL
- [ ] Set up Mistral API key
- [ ] Enable HTTPS
- [ ] Configure custom domain (if applicable)

## Documentation

- `AUTH_COMPLETE.md` - Authentication system guide
- `AUTH.md` - Auth API reference
- `EMAIL_RATE_LIMIT.md` - Email rate limit solutions
- `TEST_ACCOUNTS.md` - Testing guide

## Security

- ✅ Server-side role validation
- ✅ Row-level security (RLS) on all tables
- ✅ Protected routes with middleware
- ✅ Session management via Supabase
- ✅ Account blocking support
- ✅ Audit logging of admin actions
- ✅ OAuth support for social login

## Performance

- Image optimization via Next.js
- Chat answer caching in Postgres
- Route caching where applicable
- Responsive mobile design
- Lighthouse optimized

## Notes

- Middleware intercepts all requests to enforce auth and role checks
- Chat responses are cached to reduce API calls and costs
- Admin actions are logged for compliance and debugging
- All user data is row-level secured in Postgres
- Public routes are optimized for SEO crawling


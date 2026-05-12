# Quick Start Guide

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your Supabase and Resend API keys

# Run development server
npm run dev
```

## Test Credentials

### Students
- **Email:** student1@test.com | **Password:** TestPass123!
- **Email:** student2@test.com | **Password:** TestPass123!

### Admin
- **Email:** admin@test.com | **Password:** AdminPass123!

## Key Routes

### Public
- `/` - Landing page
- `/universities` - University database
- `/blog` - Blog articles

### Protected (Login required)
- `/dashboard` - Student dashboard
- `/chat` - AI admission assistant
- `/settings` - User settings

### Admin Only
- `/admin` - Admin management dashboard
  - Universities management
  - Blog post editor
  - Admission circulars

## Development

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Production
npm start
```

## Database

Access Supabase dashboard: https://supabase.com/dashboard

Tables:
- `profiles` - User accounts and roles
- `universities` - University database
- `blog_posts` - Blog articles
- `admission_circulars` - Admission announcements
- `conversations` - Chat history
- `bookmarks` - Saved universities

## API Endpoints

### Admin APIs
- `GET/POST /api/admin/universities` - List/Create universities
- `PATCH/DELETE /api/admin/universities/[id]` - Update/Delete university
- `GET/POST /api/admin/blog` - List/Create blog posts
- `PATCH/DELETE /api/admin/blog/[id]` - Update/Delete blog post
- `GET/POST /api/admin/circulars` - List/Create circulars
- `PATCH/DELETE /api/admin/circulars/[id]` - Update/Delete circular

### Public APIs
- `GET /api/chat` - AI chat endpoint
- `POST /api/bookmarks` - Save/bookmark university

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Troubleshooting

**Build errors?**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Type errors?**
```bash
npm run type-check
```

**Database connection issues?**
- Check Supabase credentials in `.env.local`
- Verify database is accessible
- Check connection pool limits

## Support

- **Documentation:** Check README.md for full feature list
- **Issues:** Report at https://github.com/anomalyco/opencode
- **Deployment:** See DEPLOYMENT.md

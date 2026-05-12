# Deployment Configuration

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Core Configuration
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### Supabase Configuration
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Email Service (Resend)
```env
RESEND_API_KEY=your-resend-api-key
```

### Authentication
```env
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://yourdomain.com
```

## Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Environment Setup:**
- Go to Vercel Dashboard → Settings → Environment Variables
- Add all variables from `.env.local`

### Cloudflare Pages
```bash
# Install Wrangler CLI
npm install -g wrangler

# Deploy
wrangler pages deploy dist
```

**Configuration file: `wrangler.toml`**

### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

EXPOSE 3000
CMD ["npm", "start"]
```

## Performance Optimization

### Static Generation
- Landing page is pre-rendered at build time
- Blog posts are statically generated
- University pages are dynamically generated with ISR

### Image Optimization
- Use Next.js Image component
- Automatic AVIF/WebP conversion
- Responsive image sizing

### Caching Strategy
```
/static/*: 1 year
/api/*: 0 seconds
/: 3600 seconds
```

### Database Connection Pool
- Connection pooling enabled in Supabase
- Max connections: 10 per deployment

## Monitoring

### Error Tracking
- Enable Sentry for production: `SENTRY_DSN`

### Analytics
- Vercel Analytics (built-in)
- Supabase Dashboard

### Health Check
```bash
curl https://yourdomain.com/api/health
```

## Security Checklist

- [ ] Enable HTTPS only
- [ ] Set secure CORS headers
- [ ] Enable Rate limiting on API routes
- [ ] Set strong Content Security Policy
- [ ] Enable HSTS header
- [ ] Validate all user inputs with Zod
- [ ] Encrypt sensitive data in transit
- [ ] Regular security audits
- [ ] Keep dependencies updated

## Database Migrations

Run migrations before deploying:
```bash
npm run migrate:prod
```

## Backup Strategy

- Daily database backups with Supabase
- Version control for code and schema changes
- Export sensitive data regularly

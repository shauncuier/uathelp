# 🎓 UAT Help - Bangladesh Student Education Platform

**Bangladesh's Premier Admission & Education Hub** — Centralized access to university notices, admission tips, and educational guidance for students.

> **Status**: 🚀 Active Development | **Current Phase**: Phase 1 - Core Enhancement

A comprehensive full-stack SaaS platform built with **Next.js 16**, **Firebase**, **TypeScript**, and **Tailwind CSS**. Designed specifically for Bangladeshi students to discover admission notices, results, admit cards, preparation tips, educational news, and strategic guidance for all universities.

---

## 📋 Table of Contents

- [✨ Core Features](#-core-features)
- [🗺️ Development Roadmap](#️-development-roadmap)
- [🛠️ Setup Instructions](#️-setup-instructions)
- [📁 Project Structure](#-project-structure)
- [🎨 Design System](#-design-system)
- [📊 Database Schema](#-database-schema)
- [🔐 Security](#-security)
- [🚀 Deployment](#-deployment)
- [📱 Browser Support](#-browser-support)
- [🤝 Contributing](#-contributing)

---

## ✨ Core Features

### 🏠 Public Platform

#### **Admission Notices Hub**
- 📌 Smart notice feed with 3 urgent + 6 latest notices
- 🔍 Advanced search with real-time filtering
- 📂 Filter by category, university type, and urgency status
- 📅 Deadline tracking and approaching alerts
- 📊 View counts and popularity tracking
- 🔗 Direct links to university websites and PDF materials

#### **Educational Tips & News**
- 💡 Subject-wise study guides and strategies
- 📰 University news and updates
- 🎯 Exam preparation tips and routines
- 📚 Course reviews and subject guides
- 🎓 Career guidance content
- ⭐ Featured and pinned tips

#### **University Discovery**
- 🏛️ Browse universities by type (Public, Private, Medical, Engineering, Agriculture, National)
- ⭐ Popular universities with quick access (Dhaka, BUET, Rajshahi, Jahangirnagar)
- 📍 Detailed university profiles with admission info
- 🔗 Links to official and admission websites
- 🏷️ University categorization and tagging

#### **User Experience**
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Lightning-fast performance with ISR
- 🎨 Modern gradient-based UI
- 🔤 SEO-optimized pages
- 🌙 Dark/light mode support
- 💾 Saved notices and preferences

### 👨‍💼 Admin Dashboard

- 🛡️ Secure role-based access control (Admin, Editor, Student)
- 📋 Content management system for notices, tips, universities
- 📊 Analytics and engagement metrics
- 👥 User management and activity tracking
- 🗂️ Bulk import/export operations
- 📝 Scheduled publishing and draft workflows
- 📜 Comprehensive admin activity logging
- ⚙️ Site settings and configuration management

### 💾 Data & Performance

- **10+ Pre-seeded Notices**: Realistic admission content for testing
- **9+ Blog Posts**: Tips and preparation guides
- **Firestore Optimization**: In-memory filtering for instant results
- **Static Generation**: Home page pre-rendered at build time
- **ISR Strategy**: 5-minute revalidation for dynamic updates
- **Multi-filter Search**: Category × University Type × Urgency
- **Search Keywords**: Full-text search capabilities

### 🔒 Security & Quality

- Firebase Authentication with email/password
- Custom claims-based role management
- Protected API routes with token verification
- Zod v4 strict validation (using `issues` API)
- React Hook Form with resolvers
- Firestore Security Rules enforcement
- XSS and CSRF protection

---

## 🗺️ Development Roadmap

### **PHASE 1: Foundation & Core Enhancement** (Weeks 1-2)
**Status**: ⏳ In Progress

#### 1.1 Content Management Expansion
- [ ] Extend Blog/Tips Categories
  - Add: study-tips, exam-prep, university-review, career-guidance, course-review
  - Implement category hierarchy
  - Create category landing pages
  
- [ ] Enhanced Notice Management
  - Deadline reminder system
  - Notice priority levels (urgent, important, normal)
  - Recurring notice templates
  - Notice versioning
  
- [ ] SEO & Discoverability
  - Dynamic XML sitemap generation
  - Rich snippets (JSON-LD) for notices
  - Meta tags optimization
  - Breadcrumb navigation
  - Open Graph images

#### 1.2 User Experience Improvements
- [ ] Smart Search & Filtering
  - Save custom filters
  - Search history for users
  - Advanced date range filters
  - Multi-category search
  
- [ ] Personalization Features
  - User preference center
  - Favorite universities tracking
  - Custom category subscriptions
  - Personalized notice feed
  - Smart recommendations

**Tasks**:
- [ ] Add 6+ new blog categories
- [ ] Implement deadline tracking database schema
- [ ] Create SEO component library
- [ ] Build user preferences system
- [ ] Add saved filters functionality

---

### **PHASE 2: Feature Expansion** (Weeks 3-4)
**Status**: 📅 Planned

#### 2.1 Interactive Content Features
- [ ] Study Resources Hub
  - Subject-wise guides organization
  - Downloadable PDF resources
  - YouTube video integration
  - External resource linking
  - Resource categorization
  
- [ ] Enhanced Tips & News
  - Topic-based organization
  - Featured/pinned content
  - Weekly compilations
  - "News of the Week" section
  - Trending topics
  
- [ ] Community Engagement
  - Comment system on notices/tips
  - Helpfulness ratings (👍/👎)
  - Related content suggestions
  - FAQ section
  - User reviews of tips

#### 2.2 Notification System
- [ ] Email Notifications
  - Deadline reminders (configurable)
  - New notice alerts
  - Personalized digests
  - Weekly summaries
  
- [ ] In-App Notifications
  - Real-time alerts
  - Notification center
  - Notification preferences
  - Notification history

**Tasks**:
- [ ] Design resources schema
- [ ] Build comment system
- [ ] Implement email service integration
- [ ] Create notification preferences UI
- [ ] Add email template system

---

### **PHASE 3: Admin & Analytics** (Weeks 5-6)
**Status**: 📅 Planned

#### 3.1 Advanced Analytics Dashboard
- [ ] Content Performance Metrics
  - Views per notice/post
  - Engagement rates
  - Popular content ranking
  - User behavior analytics
  - Conversion funnels
  
- [ ] User Analytics
  - Active user metrics
  - User journey tracking
  - Retention analysis
  - Demographic insights
  
- [ ] Bulk Operations
  - CSV notice import
  - Bulk publish/archive
  - Batch category updates
  - Data export functionality

#### 3.2 Content Workflow Management
- [ ] Publishing Workflow
  - Scheduled publishing
  - Multi-user collaboration
  - Approval workflows
  - Version history with rollback
  
- [ ] Template Management
  - Notice templates
  - Email templates
  - SMS templates
  - Response templates

**Tasks**:
- [ ] Build analytics dashboard
- [ ] Create CSV importer
- [ ] Implement scheduling system
- [ ] Design template builder
- [ ] Add activity audit trails

---

### **PHASE 4: Performance & DevOps** (Weeks 7-8)
**Status**: 📅 Planned

#### 4.1 Performance Optimization
- [ ] Frontend Optimization
  - Image optimization & WebP format
  - Lazy loading images
  - Code splitting improvements
  - Bundle analysis
  - CSS optimization
  
- [ ] Database Optimization
  - Firestore query optimization
  - Redis caching layer
  - Index strategy refinement
  - Query performance monitoring
  
- [ ] API Performance
  - Response time optimization
  - Pagination improvements
  - Rate limiting
  - Request caching

#### 4.2 DevOps & Deployment
- [ ] CI/CD Pipeline
  - GitHub Actions workflows
  - Automated testing suite
  - Staging environment
  - Blue-green deployment
  
- [ ] Monitoring & Observability
  - Error tracking (Sentry)
  - Performance monitoring
  - Log aggregation
  - Uptime monitoring
  - User analytics (GA4)

**Tasks**:
- [ ] Setup GitHub Actions
- [ ] Configure error tracking
- [ ] Optimize images
- [ ] Implement caching
- [ ] Create monitoring dashboard

---

### **PHASE 5: Future Enhancements** (Post-Launch)
**Status**: 🚀 Future Vision

#### 5.1 Mobile Application
- [ ] Native/Cross-Platform App
  - React Native or Flutter
  - Push notifications
  - Offline reading mode
  - App-specific features

#### 5.2 Advanced Features
- [ ] AI-Powered Intelligence
  - Smart recommendations
  - Content summarization
  - Deadline predictions
  
- [ ] Automation & Integrations
  - Notice scraping automation
  - University portal integration
  - Calendar sync
  - Social media sharing

#### 5.3 Monetization
- [ ] Premium Features
  - Subscription tiers
  - Advanced analytics
  - Priority support
  - Ad-free experience

---

## 🛠️ Setup Instructions

### 1. Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**
- **Firebase Account** (Firestore & Authentication enabled)
- **Git** for version control

### 2. Clone Repository

```bash
git clone https://github.com/yourusername/uathelp.git
cd uathelp
```

### 3. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your Firebase credentials.

**Get Admin SDK credentials**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Project Settings → Service Accounts
3. Click "Generate New Private Key"
4. Copy credentials to `.env.local`

```env
# ─ Firebase Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ─ Firebase Admin SDK (Secret)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
```

### 4. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 5. Create Admin User

```bash
npx tsx scripts/create-admin.ts admin@uathelp.com "SecurePassword123!" "Admin Name"
```

### 6. Seed Database (Optional)

Populate with sample data for testing:

```bash
# Using CommonJS (recommended)
node scripts/seed-simple.js

# Or using TypeScript
npx tsx scripts/seed.ts
```

### 7. Deploy Firebase Rules

```bash
# Build Next.js
npm run build

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### 8. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

**Login with**:
- Email: `admin@uathelp.com`
- Password: `SecurePassword123!`

---

## 📁 Project Structure

```
uathelp/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (public)/                 # Public student-facing pages
│   │   │   ├── layout.tsx            # Public layout wrapper
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── notices/
│   │   │   │   ├── page.tsx          # Notices list with filters
│   │   │   │   └── [slug]/page.tsx   # Single notice detail
│   │   │   ├── tips/
│   │   │   │   ├── page.tsx          # Tips/blog listing
│   │   │   │   └── [slug]/page.tsx   # Single tip detail
│   │   │   ├── universities/
│   │   │   │   ├── page.tsx          # University browse
│   │   │   │   └── [slug]/page.tsx   # University profile
│   │   │   ├── guides/page.tsx       # Study guides
│   │   │   ├── results/page.tsx      # Results hub
│   │   │   ├── admit-card/page.tsx   # Admit cards
│   │   │   ├── about/page.tsx        # About us
│   │   │   └── contact/page.tsx      # Contact page
│   │   │
│   │   ├── admin/                    # Admin dashboard (protected)
│   │   │   ├── layout.tsx            # Admin layout
│   │   │   ├── page.tsx              # Dashboard home
│   │   │   ├── notices/
│   │   │   │   ├── page.tsx          # Notice management
│   │   │   │   ├── new/page.tsx      # Create notice
│   │   │   │   └── [id]/edit/page.tsx # Edit notice
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx          # Post management
│   │   │   │   ├── new/page.tsx      # Create post
│   │   │   │   └── [id]/edit/page.tsx # Edit post
│   │   │   ├── universities/
│   │   │   │   ├── page.tsx          # University management
│   │   │   │   ├── new/page.tsx      # Add university
│   │   │   │   └── [id]/edit/page.tsx # Edit university
│   │   │   ├── users/page.tsx        # User management
│   │   │   ├── logs/page.tsx         # Activity logs
│   │   │   └── settings/page.tsx     # Site settings
│   │   │
│   │   ├── api/                      # Backend REST API
│   │   │   ├── public/
│   │   │   │   ├── notices/route.ts  # Get notices
│   │   │   │   ├── search/route.ts   # Search functionality
│   │   │   │   ├── posts/route.ts    # Get blog posts
│   │   │   │   └── universities/route.ts # Get universities
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── notices/route.ts  # CRUD notices
│   │   │       ├── posts/route.ts    # CRUD posts
│   │   │       ├── universities/route.ts # CRUD universities
│   │   │       └── users/route.ts    # User management
│   │   │
│   │   ├── auth/
│   │   │   └── login/page.tsx        # Login page
│   │   │
│   │   ├── profile/page.tsx          # User profile
│   │   ├── unauthorized/page.tsx     # 403 error
│   │   ├── layout.tsx                # Root layout
│   │   └── not-found.tsx             # 404 page
│   │
│   ├── components/                   # Reusable React components
│   │   ├── notices/
│   │   │   ├── NoticeCard.tsx        # Notice card component
│   │   │   ├── NoticeForm.tsx        # Notice edit form
│   │   │   └── NoticesContent.tsx    # Notices list container
│   │   │
│   │   ├── blog/
│   │   │   ├── BlogCard.tsx          # Blog/tip card
│   │   │   └── PostForm.tsx          # Blog post editor
│   │   │
│   │   ├── universities/
│   │   │   ├── UniversityCard.tsx    # University card
│   │   │   └── UniversityForm.tsx    # University form
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Navigation header
│   │   │   ├── Footer.tsx            # Site footer
│   │   │   ├── PublicLayout.tsx      # Public pages wrapper
│   │   │   ├── AdminSidebar.tsx      # Admin sidebar
│   │   │   └── AdminTopbar.tsx       # Admin top bar
│   │   │
│   │   ├── admin/
│   │   │   ├── StatsCard.tsx         # Stats display
│   │   │   └── PageHeader.tsx        # Page headers
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginContent.tsx      # Login form
│   │   │   └── ProfileContent.tsx    # Profile page
│   │   │
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   └── ... (other UI components)
│   │   │
│   │   └── common/
│   │       ├── EmptyState.tsx        # Empty state UI
│   │       ├── CategoryBadge.tsx     # Category badge
│   │       └── UrgentBadge.tsx       # Urgent indicator
│   │
│   ├── lib/                          # Utility functions
│   │   ├── firebase/
│   │   │   ├── admin.ts              # Firebase Admin SDK
│   │   │   ├── client.ts             # Firebase Client SDK
│   │   │   └── auth.ts               # Auth utilities
│   │   │
│   │   └── server/
│   │       ├── api-response.ts       # API response helpers
│   │       ├── middleware.ts         # Custom middleware
│   │       └── validators.ts         # Validation utilities
│   │
│   ├── types/                        # TypeScript type definitions
│   │   └── index.ts                  # All shared types
│   │
│   ├── context/                      # React Context
│   │   └── AuthContext.tsx           # Auth context
│   │
│   ├── schemas/                      # Zod validation schemas
│   │   ├── notice.ts
│   │   ├── post.ts
│   │   └── university.ts
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useNotices.ts
│   │   └── usePosts.ts
│   │
│   └── proxy.ts                      # Request proxy utilities
│
├── scripts/                          # Utility scripts
│   ├── seed-simple.js               # Seed with sample data
│   ├── seed.ts                      # TypeScript seeder
│   └── create-admin.ts              # Create admin user
│
├── public/                          # Static assets
│   ├── images/
│   ├── icons/
│   └── ...
│
├── .env.local.example               # Environment template
├── .env.local                       # Environment variables (git-ignored)
├── firebase.json                    # Firebase config
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore indexes
├── next.config.ts                   # Next.js configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.ts               # Tailwind CSS config
├── package.json                     # Dependencies
├── README.md                        # This file
└── .gitignore                       # Git ignore rules
```

---

## 🎨 Design System

### Color Palette
- **Primary**: `#0066FF` (Blue)
- **Success**: `#10B981` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Neutral**: Gray scale

### Typography
- **Headlines**: Bold, clear hierarchy
- **Body**: 14-16px for readability
- **Monospace**: Code snippets

### Spacing
- Consistent padding/margins using Tailwind scale
- Base unit: 4px

### Components
- Rounded corners: `lg` (8px) to `xl` (12px)
- Smooth transitions: 200-300ms
- Layered shadows for depth
- Hover effects on interactive elements

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly (48px minimum tap targets)

---

## 📊 Database Schema

### Collections Overview

#### `notices`
```typescript
Notice {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  universityId: string;
  universityName: string;
  category: NoticeCategory; // admission, result, admit-card, etc.
  universityType: UniversityType; // public, private, medical, etc.
  unit?: string;
  session: string;
  applicationStart?: Date;
  applicationEnd?: Date;
  examDate?: Date;
  resultDate?: Date;
  pdfUrl?: string;
  officialUrl?: string;
  imageUrl?: string;
  tags: string[];
  searchKeywords: string[];
  isFeatured: boolean;
  isUrgent: boolean;
  viewCount: number;
  status: "draft" | "published" | "archived";
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}
```

#### `blogPosts`
```typescript
BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory; // tips, guide, routine, strategy, etc.
  tags: string[];
  searchKeywords: string[];
  imageUrl?: string;
  status: "draft" | "published" | "archived";
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}
```

#### `universities`
```typescript
University {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortName: string;
  type: UniversityType; // public, private, medical, etc.
  division: string;
  district: string;
  officialWebsite: string;
  admissionWebsite?: string;
  logoUrl?: string;
  description?: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### `users`
```typescript
AppUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: "student" | "editor" | "admin";
  status: "active" | "suspended" | "disabled";
  savedUniversities?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

#### `logs` (Activity Audit Trail)
```typescript
AdminLog {
  id: string;
  action: string;
  entityType: "notice" | "university" | "post" | "user" | "settings";
  entityId?: string;
  entityTitle?: string;
  performedBy: string;
  performedByEmail: string;
  role: UserRole;
  createdAt: Date;
  metadata?: Record<string, unknown>;
}
```

#### `siteSettings`
```typescript
SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  footerText?: string;
  seoTitle: string;
  seoDescription: string;
  allowRegistration?: boolean;
  maintenanceMode: boolean;
  noticeBanner?: string;
  noticeBannerEnabled: boolean;
  updatedAt: Date;
}
```

### Firestore Indexes
- `notices`: `status` ascending (published notices only)
- `blogPosts`: `status` ascending (published posts only)
- `universities`: `isFeatured` descending
- In-memory filtering for complex queries (avoids index delays)

---

## 🔐 Security

### Authentication
- **Firebase Authentication** with email/password
- **Custom Claims** for role-based access
- **ID Token Verification** on all protected routes
- **Session Management** with automatic expiry

### Authorization
- **Role-Based Access Control (RBAC)**
  - `admin`: Full platform access
  - `editor`: Content creation and management
  - `student`: Read-only + saved notices
  
- **Resource-Level Permissions**
  - Users can only modify their own data
  - Admins can modify any content

### API Security
- **Token Verification**: All protected routes verify Firebase ID tokens
- **Zod Validation**: Strict input validation
- **CORS Protection**: Configured CORS headers
- **Rate Limiting**: Planned for Phase 4
- **XSS Prevention**: Built-in React XSS protection

### Data Security
- **Firestore Security Rules**: Enforce permission layer
- **Encrypted Passwords**: Firebase handles hashing
- **No Sensitive Data**: PII stored minimally
- **Audit Logging**: All admin actions logged

### Best Practices
```
✅ Use environment variables for secrets
✅ Validate all user inputs server-side
✅ Implement audit logging
✅ Regular security audits
✅ Keep dependencies updated
✅ Use HTTPS in production
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Vercel Config** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase_api_key",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "FIREBASE_PRIVATE_KEY": "@firebase_private_key"
  }
}
```

### Deploy to Other Platforms

**Netlify**:
```bash
ntl deploy --prod
```

**Railway**:
```bash
railway up
```

**Docker** (Self-hosted):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Firebase Deployment

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy hosting (if using Firebase Hosting)
firebase deploy --only hosting
```

### Environment Variables (Production)

Set in your hosting platform:
- All `NEXT_PUBLIC_*` variables
- All `FIREBASE_*` variables
- Any service-specific tokens

---

## 📱 Browser Support

| Browser | Minimum Version | Status |
|---------|-----------------|--------|
| Chrome  | 90+             | ✅ Supported |
| Firefox | 88+             | ✅ Supported |
| Safari  | 14+             | ✅ Supported |
| Edge    | 90+             | ✅ Supported |
| Mobile Safari | 14+       | ✅ Supported |
| Chrome Mobile | 90+       | ✅ Supported |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork & Clone
```bash
git clone https://github.com/yourusername/uathelp.git
cd uathelp
```

### 2. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes
- Follow the project structure
- Write clean, documented code
- Add TypeScript types
- Test your changes

### 4. Commit with Messages
```bash
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
git commit -m "docs: update documentation"
```

**Commit Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### 5. Push & Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request with detailed description.

---

## 📧 Support & Contact

- **Email**: support@uathelp.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/uathelp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/uathelp/discussions)

---

## 📄 License

This project is **proprietary software**. All rights reserved.

© 2024 UAT Help. All intellectual property rights reserved.

---

## 🙏 Acknowledgments

Built with ❤️ for Bangladeshi students.

Special thanks to:
- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend & Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

---

## 📊 Project Stats

- **Total Pages**: 20+
- **API Endpoints**: 15+
- **Components**: 40+
- **Database Collections**: 6
- **TypeScript Types**: 12+
- **Lines of Code**: 5000+

---

**Last Updated**: May 27, 2026  
**Version**: 0.1.0  
**Status**: 🚀 Active Development

---

## 🎯 Quick Links

- [Setup Instructions](#️-setup-instructions)
- [Development Roadmap](#️-development-roadmap)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)

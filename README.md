# UAT Help

**Bangladesh's #1 Admission Platform** — All University Admission Notices in One Place.

A comprehensive full-stack SaaS platform built with Next.js 16 (Turbopack), Tailwind CSS, shadcn/ui, and Firebase. Designed specifically for Bangladeshi students to discover admission notices, results, admit cards, and preparation tips for all universities.

## 🚀 Features

### Public Site
- **Modern Hero Section**: Gradient-based design with advanced search functionality
- **Smart Notice Feed**: 
  - 3 urgent notices (highlighted with red badges)
  - 6 latest notices (sorted by publish date)
  - Real-time filtering by category, university type, and urgency status
- **University Browser**: Browse by type (Public, Private, Medical, Engineering, Agriculture, National)
- **Popular Universities**: Quick access to top institutions (Dhaka, BUET, Rajshahi, Jahangirnagar)
- **Admission Tips & Guides**: Expert tips, strategies, and preparation guides
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewports
- **SEO-Friendly**: Pre-rendered static pages with ISR (Incremental Static Regeneration)

### Admin Dashboard
- Secure panel to manage universities, notices, blog posts, and users
- Role-Based Access Control (Admin, Editor, Student)
- Admin activity logging

### Data & Performance
- **10 Pre-seeded Notices**: Realistic admission content for multiple universities
- **9 Blog Posts**: Tips and preparation guides with categories
- **Firestore Optimization**: In-memory filtering to avoid composite index requirements
- **Static Generation**: Home page and public pages pre-rendered at build time
- **ISR Strategy**: 5-minute revalidation for dynamic content updates
- **Search & Filters**: Full-text search and multi-filter support (category, university type, urgency)

### Security & Quality
- Firebase Admin SDK for backend authentication
- Zod v4 validation (using `issues` API) for strict type safety
- React Hook Form with custom resolvers
- Protected API routes with token verification
- Firestore Security Rules

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm or pnpm
- Firebase Account (with Firestore and Authentication enabled)

### 2. Environment Setup
Rename `.env.example` to `.env.local` and fill in your Firebase credentials.

To get the Admin SDK credentials:
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the credentials to `.env.local`

```env
# Client SDK (Public configuration)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin SDK (Secret backend configuration)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create First Admin User
```bash
npx tsx scripts/create-admin.ts your-email@example.com your-secure-password "Your Name"
```

### 5. Seed Database (Optional)
Populate the database with 10 sample notices and 9 blog posts for testing:
```bash
# Using CommonJS (recommended for better compatibility)
node scripts/seed-simple.js

# Or using TypeScript
npx tsx scripts/seed.ts
```

### 6. Build & Deploy Firebase Rules
```bash
# Build Next.js application
npm run build

# Deploy Firestore rules
firebase deploy --only firestore
```

### 7. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the platform.

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Student-facing pages
│   │   ├── page.tsx       # Home with hero, notices, tips, universities
│   │   ├── notices/       # Notices listing page with filters
│   │   ├── tips/          # Blog posts and guides
│   │   └── universities/  # University listing and details
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # Backend REST API
│   │   ├── public/        # Public endpoints (notices, posts, search)
│   │   └── admin/         # Admin endpoints (CRUD operations)
│   └── auth/              # Authentication pages
├── components/
│   ├── notices/           # NoticeCard, NoticesContent components
│   ├── blog/              # BlogCard component
│   ├── layout/            # Header, Footer, Sidebar
│   ├── admin/             # Admin-specific components
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── firebase/          # Firebase Admin & Client SDK wrappers
│   └── server/            # Server utilities (API response helpers, etc.)
├── types/                 # TypeScript type definitions
├── context/               # React Context (Auth, etc.)
├── schemas/               # Zod validation schemas
└── hooks/                 # Custom React hooks
scripts/
├── seed-simple.js         # CommonJS seed script (notices + blogs)
├── seed.ts                # TypeScript seed script
└── create-admin.ts        # Create first admin user
```

## 🎨 Design System

- **Color Scheme**: Blue (`#0066FF`) with gradients and hover effects
- **Typography**: Bold headlines, clear hierarchy, readable body text
- **Spacing**: Consistent padding/margins using Tailwind scale
- **Rounded Corners**: lg/xl border radius for modern feel
- **Animations**: Smooth transitions and hover effects
- **Shadows**: Layered shadow effects for depth

## 📊 Database Schema

### Collections
- **notices**: Admission notices, results, admit cards
- **blogPosts**: Tips, guides, preparation strategies
- **universities**: Institution details, admission info
- **users**: Student and admin profiles
- **logs**: Activity audit trail

### Firestore Indexes
- `notices`: `status` ascending (for published notices)
- `blogPosts`: `status` ascending (for published posts)
- In-memory filtering handles complex queries to avoid index delays

## 🔐 Security

- **Firebase Authentication**: Email/password + custom claims
- **Role-Based Access**: Admin, Editor, Student roles
- **Token Verification**: All API routes verify Firebase ID tokens
- **Zod Validation**: Strict input validation on all endpoints
- **Security Rules**: Firestore rules restrict data access by role

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
vercel deploy --prod
```

### Deploy to Other Platforms
The app is compatible with any Node.js hosting:
- Netlify
- Railway
- Render
- AWS (EC2, Elastic Beanstalk)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Clone the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m "feat: your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Create a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

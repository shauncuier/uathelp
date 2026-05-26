# 🏗️ UAT Help - Architecture Documentation

**Comprehensive guide to the platform architecture, design patterns, and technical decisions.**

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Layers](#architecture-layers)
4. [Data Flow](#data-flow)
5. [Design Patterns](#design-patterns)
6. [API Structure](#api-structure)
7. [Database Design](#database-design)
8. [Authentication & Authorization](#authentication--authorization)
9. [Performance Optimization](#performance-optimization)
10. [Deployment Architecture](#deployment-architecture)

---

## System Overview

UAT Help is a **modern full-stack SaaS platform** following a **layered architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                  Frontend (Next.js)                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Pages | Components | Hooks | Context            │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────┐
│              API Layer (Next.js Routes)                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Public API | Admin API | Auth Middleware        │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ Firestore SDK
                         ▼
┌─────────────────────────────────────────────────────────┐
│            Firebase Backend Services                    │
│  ┌──────────────┬──────────────┬──────────────────┐   │
│  │  Firestore   │ Auth         │ Storage          │   │
│  │  (Database)  │ (Identity)   │ (File Upload)    │   │
│  └──────────────┴──────────────┴──────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | **Next.js 16** | React meta-framework with SSR/SSG |
| Language | **TypeScript** | Type safety |
| UI Framework | **React 19** | Component library |
| Styling | **Tailwind CSS 4** | Utility-first CSS |
| Components | **shadcn/ui** | Headless UI components |
| Forms | **React Hook Form** | Form state management |
| Validation | **Zod v4** | Runtime type validation |
| State | **React Context** | Auth state management |
| Icons | **Lucide React** | Icon library |
| Notifications | **Sonner** | Toast notifications |
| Date Utils | **date-fns** | Date manipulation |

### Backend
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | **Node.js 18+** | JavaScript runtime |
| Framework | **Next.js API Routes** | Backend endpoints |
| Database | **Firebase Firestore** | NoSQL document database |
| Auth | **Firebase Authentication** | User authentication |
| Storage | **Firebase Cloud Storage** | File uploads |
| Admin SDK | **firebase-admin** | Server-side operations |

### DevOps & Deployment
| Tool | Purpose |
|------|---------|
| **Vercel** | Hosting (recommended) |
| **Firebase** | Backend services |
| **GitHub** | Version control |
| **GitHub Actions** | CI/CD (future) |

---

## Architecture Layers

### 1. **Presentation Layer** (Frontend)

Located in: `src/app` and `src/components`

#### Characteristics:
- Server Components for data fetching
- Client Components for interactivity
- Responsive design (mobile-first)
- SEO optimization

#### Key Components:
```
├── Pages (Route Handlers)
│   ├── (public)/* - Public pages
│   ├── admin/* - Protected admin pages
│   └── api/* - REST API endpoints
│
├── Components
│   ├── Layout - Header, Footer, Sidebar
│   ├── Notices - Notice cards, lists, filters
│   ├── Blog - Blog cards, post forms
│   ├── UI - Reusable UI primitives
│   └── Admin - Admin-specific components
│
└── Hooks & Context
    ├── useAuth - Authentication state
    ├── useNotices - Notices data fetching
    └── AuthContext - Global auth state
```

### 2. **API Layer** (Backend)

Located in: `src/app/api`

#### Characteristics:
- RESTful API design
- Protected routes with token verification
- Strict input validation with Zod
- Consistent error handling

#### Endpoints Structure:
```
/api/
├── public/
│   ├── notices - GET notices
│   ├── posts - GET blog posts
│   ├── search - Full-text search
│   ├── universities - GET universities
│   └── user-preferences - GET/PUT preferences
│
└── admin/
    ├── notices - CRUD notices
    ├── posts - CRUD blog posts
    ├── universities - CRUD universities
    ├── users - User management
    ├── logs - Activity logs
    └── settings - Site settings
```

### 3. **Business Logic Layer**

Located in: `src/lib` and `src/hooks`

#### Utilities:
- **Firebase Integration**: `lib/firebase/admin.ts`, `lib/firebase/client.ts`
- **Helpers**: `lib/server/api-response.ts`, validation utilities
- **Algorithms**: Feed ranking, deadline calculation

#### Hooks:
- `useAuth()` - Authentication
- `useNotices()` - Notice data fetching
- `usePosts()` - Blog post fetching

### 4. **Data Access Layer**

Located in: Firebase Firestore

#### Features:
- Document-based storage
- Real-time capabilities
- Client-side filtering (for flexibility)
- Security Rules for authorization

#### Collections:
```
notices/          - Admission notices
blogPosts/        - Blog posts & tips
universities/     - University data
users/            - User profiles
logs/             - Admin activity logs
siteSettings/     - Global settings
userFilters/      - Saved filters (Phase 1)
searchHistory/    - User search history (Phase 1)
noticeVersions/   - Version history (Phase 1)
```

---

## Data Flow

### 🔄 Read Flow: User Views Notices

```
1. User Visits /notices
   │
   ▼
2. NoticesContent Component (Client)
   │
   ▼
3. useNotices() Hook
   │
   ▼
4. /api/public/notices Endpoint
   │
   ▼
5. Firebase Admin SDK
   │
   ▼
6. Firestore Query (WHERE status = published)
   │
   ▼
7. In-Memory Filtering (client-side for complex queries)
   │
   ▼
8. Response with Notices Array
   │
   ▼
9. Component Renders Notice Cards
```

### ✏️ Write Flow: Admin Creates Notice

```
1. Admin Fills NoticeForm
   │
   ▼
2. Form Validation (React Hook Form + Zod)
   │
   ▼
3. Submit → /api/admin/notices POST
   │
   ▼
4. Middleware: Verify Firebase ID Token
   │
   ▼
5. Middleware: Check Admin Role
   │
   ▼
6. Zod Schema Validation (Server-side)
   │
   ▼
7. Firebase Admin SDK: Create Document
   │
   ▼
8. Log Action in logs/ collection
   │
   ▼
9. Response Success → Toast Notification
   │
   ▼
10. Redirect to Edit Page
```

### 🔐 Authentication Flow

```
1. User Enters Credentials on /login
   │
   ▼
2. LoginContent Component
   │
   ▼
3. firebase.auth().signInWithEmailAndPassword()
   │
   ▼
4. Firebase Returns ID Token
   │
   ▼
5. AuthContext Updates
   │
   ▼
6. ID Token Sent in Requests (Authorization Header)
   │
   ▼
7. API Verifies Token: admin.auth().verifyIdToken()
   │
   ▼
8. Check Custom Claims for Role
   │
   ▼
9. Grant/Deny Access
```

---

## Design Patterns

### 1. **Server Components + Client Components**

**Pattern**: Use Server Components for data fetching, Client Components for interactivity

```typescript
// app/(public)/notices/page.tsx - SERVER COMPONENT
export default async function NoticesPage() {
  // Data fetching on server
  const notices = await fetchNotices();
  
  return (
    <>
      <NoticesContent initialNotices={notices} />
    </>
  );
}

// components/notices/NoticesContent.tsx - CLIENT COMPONENT
'use client';
export function NoticesContent({ initialNotices }: Props) {
  const [filter, setFilter] = useState('');
  
  return (
    <div>
      {/* Interactive filtering */}
    </div>
  );
}
```

### 2. **API Middleware Pattern**

**Pattern**: Chain middleware functions for request processing

```typescript
// lib/server/middleware.ts
export async function withAuth(request: Request) {
  const token = request.headers.get('authorization');
  if (!token) throw new Error('Unauthorized');
  
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken;
}

export async function withAdmin(request: Request) {
  const user = await withAuth(request);
  if (user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

// api/admin/notices/route.ts
export async function POST(request: Request) {
  try {
    const user = await withAdmin(request);
    const data = await request.json();
    
    // Process request
  } catch (error) {
    return apiError(error);
  }
}
```

### 3. **Hook Pattern for Data Fetching**

**Pattern**: Custom hooks encapsulate data fetching logic

```typescript
// hooks/useNotices.ts
export function useNotices(filters?: NoticeFilters) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/public/notices', {
          method: 'POST',
          body: JSON.stringify(filters),
        });
        const data = await response.json();
        setNotices(data.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  return { notices, loading, error };
}
```

### 4. **Context Pattern for Global State**

**Pattern**: React Context for authentication state

```typescript
// context/AuthContext.tsx
export const AuthContext = createContext<AuthContextType>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Fetch user doc from Firestore
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 5. **Validation Pattern with Zod**

**Pattern**: Define schemas for validation at boundaries

```typescript
// schemas/notice.ts
export const noticeCreateSchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().min(20),
  category: z.enum(['admission', 'result', 'admit-card']),
  universityId: z.string(),
  applicationStart: z.date().optional(),
  applicationEnd: z.date().optional(),
});

// api/admin/notices/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  
  const result = noticeCreateSchema.safeParse(body);
  if (!result.success) {
    return apiError(result.error);
  }
  
  // Process validated data
  const notice = await db.collection('notices').add(result.data);
  return apiSuccess(notice);
}
```

---

## API Structure

### Request Format

```typescript
// Standard API request with token
const response = await fetch('/api/admin/notices', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  },
  body: JSON.stringify({
    title: 'Notice Title',
    // ... data
  }),
});
```

### Response Format

```typescript
// Success Response
{
  success: true,
  data: {
    id: 'notice-123',
    title: 'Notice Title',
    // ...
  },
  message: 'Notice created successfully'
}

// Error Response
{
  success: false,
  error: {
    message: 'Validation failed',
    code: 'VALIDATION_ERROR'
  }
}
```

### API Rate Limiting (Future)

```typescript
// Will implement in Phase 4
const RateLimitMap = new Map<string, number[]>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = RateLimitMap.get(userId) || [];
  
  // Remove requests older than 1 minute
  const recent = limit.filter(t => now - t < 60000);
  
  if (recent.length >= 100) {
    return false; // Rate limited
  }
  
  recent.push(now);
  RateLimitMap.set(userId, recent);
  return true;
}
```

---

## Database Design

### Collections & Indexes

#### `notices` Collection
```
Field           | Type      | Index | Purpose
─────────────────────────────────────────────────────────
id              | string    | auto  | Document ID
title           | string    |       | Notice title
slug            | string    |       | URL slug
status          | string    | ✓     | published/draft
universityId    | string    |       | Reference to university
category        | string    |       | Filtering
isUrgent        | boolean   |       | Urgent filter
isFeatured      | boolean   |       | Featured notices
createdAt       | timestamp | ✓     | Sorting
publishedAt     | timestamp |       | Published date
authorId        | string    |       | Author reference
```

**Indexes**:
- `status` ASC (for published notices query)
- `createdAt` DESC (for sorting)
- `isFeatured` DESC + `createdAt` DESC (for featured notices)

#### Query Optimization
```typescript
// ✅ Good: Uses indexed field
const q = query(
  collection(db, 'notices'),
  where('status', '==', 'published'),
  orderBy('createdAt', 'desc')
);

// ❌ Bad: Would need composite index
const q = query(
  collection(db, 'notices'),
  where('status', '==', 'published'),
  where('category', '==', 'admission'),
  orderBy('createdAt', 'desc')
);
// Solution: Use in-memory filtering for category
```

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Public read access to published notices
    match /notices/{document=**} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth.token.role == 'admin' 
                      || request.auth.token.role == 'editor';
    }
    
    // Published blog posts are readable
    match /blogPosts/{document=**} {
      allow read: if resource.data.status == 'published';
      allow write: if request.auth.token.role == 'admin'
                      || request.auth.token.role == 'editor';
    }
    
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId 
                           || request.auth.token.role == 'admin';
    }
    
    // Admin only access to logs
    match /logs/{document=**} {
      allow read: if request.auth.token.role == 'admin';
      allow write: if false; // Server-only writes
    }
  }
}
```

---

## Authentication & Authorization

### Authentication Flow

1. **Sign Up** (Future Phase)
   ```typescript
   const user = await auth.createUserWithEmailAndPassword(email, password);
   await db.collection('users').doc(user.uid).set({
     name, email, role: 'student', createdAt: new Date()
   });
   ```

2. **Sign In**
   ```typescript
   const result = await auth.signInWithEmailAndPassword(email, password);
   const idToken = await result.user.getIdToken();
   // Send idToken with API requests
   ```

3. **Token Verification** (Server-side)
   ```typescript
   const decodedToken = await admin.auth().verifyIdToken(idToken);
   const userId = decodedToken.uid;
   const role = decodedToken.role; // Custom claim
   ```

### Role-Based Access Control

```typescript
// Roles
type UserRole = 'student' | 'editor' | 'admin';

// Permissions Matrix
const permissions = {
  student: ['read:public', 'read:notices', 'read:tips'],
  editor: ['create:notices', 'create:posts', 'edit:owned'],
  admin: ['*'],
};

// Middleware to check permission
function hasPermission(role: UserRole, action: string): boolean {
  return permissions[role].includes(action) || 
         permissions[role].includes('*');
}
```

---

## Performance Optimization

### 1. **Frontend Optimization**

#### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={imageUrl}
  alt="description"
  width={800}
  height={600}
  priority={isFeatured}
  quality={80}
/>
```

#### Code Splitting
```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(
  () => import('@/components/admin/Dashboard'),
  { loading: () => <Skeleton /> }
);
```

#### Caching Strategy
```typescript
// ISR for static pages with revalidation
export const revalidate = 300; // 5 minutes
```

### 2. **Database Optimization**

#### Query Optimization
```typescript
// Bad: Fetches all documents
const notices = await getDocs(collection(db, 'notices'));

// Good: Filter in query
const q = query(
  collection(db, 'notices'),
  where('status', '==', 'published'),
  limit(20)
);
```

#### Batch Reads
```typescript
// Bad: Multiple separate requests
for (let id of ids) {
  const doc = await getDoc(doc(db, 'notices', id));
}

// Good: Batch read
const docs = await Promise.all(
  ids.map(id => getDoc(doc(db, 'notices', id)))
);
```

### 3. **Network Optimization**

#### Request Compression
- Next.js handles automatically

#### CDN Caching
- Firestore CDN caching
- CloudFlare for static assets (optional)

#### API Response Pagination
```typescript
// Pagination
const pageSize = 20;
const response = {
  data: notices.slice(0, pageSize),
  hasMore: notices.length > pageSize,
  nextCursor: notices[pageSize]?.id,
};
```

---

## Deployment Architecture

### Development Environment
```
Local Machine
├── Code Editor
├── Node.js Runtime
├── Firebase Emulator (optional)
└── Browser (http://localhost:3000)
```

### Staging Environment
```
GitHub Repository
├── Pull Requests
├── GitHub Actions CI/CD
└── Preview Deployments on Vercel
```

### Production Environment
```
Vercel (Recommended)
├── Managed hosting
├── Auto SSL/TLS
├── Global CDN
├── Environment secrets
└── Auto deployments on push to main

Firebase Project
├── Firestore (Production DB)
├── Authentication
└── Cloud Storage
```

### Deployment Pipeline

```
1. Developer commits to feature branch
   │
   ▼
2. GitHub Actions runs tests/linter
   │
   ▼
3. Creates Preview Deployment on Vercel
   │
   ▼
4. Approved → Merge to main
   │
   ▼
5. GitHub Actions runs final tests
   │
   ▼
6. Auto-deploys to Vercel Production
   │
   ▼
7. Monitors health & metrics
```

---

## Scalability Considerations

### Current Limits (Phase 1)
- Up to 100K notices
- Up to 100K users
- Read/Write within Firebase quotas

### Scaling Strategy (Future)

#### Phase 2-3: Database
- Add search service: Algolia
- Add caching layer: Redis
- Implement CDN: CloudFlare

#### Phase 4: Infrastructure
- Load balancing
- Database sharding
- Microservices (optional)

---

## Error Handling Strategy

### Client-Side
```typescript
try {
  const response = await fetch('/api/notices');
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
} catch (error) {
  toast.error('Failed to load notices');
  logger.error(error);
}
```

### Server-Side
```typescript
export async function POST(req: Request) {
  try {
    const user = await withAdmin(req);
    const data = await req.json();
    
    const validated = noticeSchema.parse(data);
    const notice = await createNotice(validated);
    
    return apiSuccess(notice);
  } catch (error) {
    if (error instanceof ZodError) {
      return apiError(error, 'VALIDATION_ERROR', 400);
    }
    return apiError(error, 'INTERNAL_ERROR', 500);
  }
}
```

### Error Tracking (Phase 4)
- Sentry for error reporting
- Error severity levels
- Alert thresholds

---

## Security Architecture

### Input Validation
- All inputs validated with Zod
- Server-side validation mandatory

### Output Encoding
- React auto-escapes JSX
- Manual encoding for dynamic content

### Authentication
- Firebase handles secure password hashing
- ID tokens expire after 1 hour
- Refresh tokens for long sessions

### Authorization
- Role-based access control
- Resource-level permissions
- Firestore security rules

### Data Protection
- HTTPS only (enforced on Vercel)
- No sensitive data in localStorage
- Secure HttpOnly cookies for tokens

---

## Monitoring & Observability (Phase 4)

### Metrics to Track
- API response times
- Error rates
- User sessions
- Database queries
- Deployment health

### Tools
- Google Analytics 4
- Sentry for errors
- Vercel Analytics
- Firebase Performance Monitoring

---

## Architecture Decision Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Database | Firestore | Real-time, serverless, scalable |
| Framework | Next.js | SSR, SSG, API routes, performance |
| UI Framework | shadcn/ui | Customizable, headless, Tailwind |
| Validation | Zod | Runtime validation, type-safe |
| Styling | Tailwind CSS | Utility-first, responsive, fast |
| Deployment | Vercel | Next.js native, fast, reliable |

---

**Last Updated**: May 27, 2026  
**Version**: 1.0  
**Status**: 🚀 Production Ready (Core)

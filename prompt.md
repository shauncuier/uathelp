Build a complete production-ready full-stack web application called “UAT Help”.

UAT Help is a Bangladeshi university admission help platform where students can find all university admission notices, circulars, results, admit cards, seat plans, application deadlines, PDFs, guides, and preparation tips in one place.

The platform must include:
1. Public student-facing website
2. Secure admin dashboard/backend management panel
3. Backend API system
4. Firebase Authentication
5. Firestore database
6. Firebase Storage upload system
7. Firebase Admin SDK
8. Role-based access control
9. SEO-friendly pages
10. Search and filter system
11. Firestore security rules
12. Firebase Storage rules
13. Seed data
14. First admin creation script
15. Complete README setup guide

Project name:
UAT Help

Tagline:
All University Admission Notices in One Place

Target users:
Bangladeshi university admission candidates, students, parents, teachers, admission guide creators, editors, and admins.

Main goal:
Help students quickly find official university admission notices, deadlines, results, admit cards, seat plans, guides, PDFs, and preparation tips.

Use English UI by default, but make the project ready for Bangla content.

Use this tech stack:

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React icons
- React Hook Form
- Zod validation

Backend:
- Next.js App Router Route Handlers
- Firebase Admin SDK
- Firebase Authentication
- Cloud Firestore
- Firebase Storage

Database:
- Firestore

Authentication:
- Firebase Authentication
- Email/password login
- Google login

Deployment:
- Vercel for Next.js
- Firebase for Auth, Firestore, and Storage

Code quality:
- Clean reusable components
- Type-safe code
- Server-side validation
- Secure backend APIs
- Responsive mobile-first design
- SEO optimized
- Production-ready structure

Create these public pages:

1. Home page
Route: /

2. Notice listing page
Route: /notices

3. Notice details page
Route: /notices/[slug]

4. University listing page
Route: /universities

5. University details page
Route: /universities/[slug]

6. Tips/blog listing page
Route: /tips

7. Tips/blog details page
Route: /tips/[slug]

8. Guides page
Route: /guides

9. Results page
Route: /results

10. Admit card page
Route: /admit-card

11. About page
Route: /about

12. Contact page
Route: /contact

13. Login page
Route: /login

14. Unauthorized page
Route: /unauthorized

15. Not found page
Route: /not-found

Create these protected admin pages:

1. Admin dashboard
Route: /admin

2. Manage notices
Route: /admin/notices

3. Create notice
Route: /admin/notices/new

4. Edit notice
Route: /admin/notices/[id]/edit

5. Manage universities
Route: /admin/universities

6. Create university
Route: /admin/universities/new

7. Edit university
Route: /admin/universities/[id]/edit

8. Manage blog posts
Route: /admin/posts

9. Create blog post
Route: /admin/posts/new

10. Edit blog post
Route: /admin/posts/[id]/edit

11. Manage users
Route: /admin/users

12. Edit user
Route: /admin/users/[id]

13. Site settings
Route: /admin/settings

14. Admin logs
Route: /admin/logs

Public website layout:

Create a modern public layout with:

Header:
- Logo: UAT Help
- Navigation:
  - Notices
  - Universities
  - Tips
  - Guides
  - Results
  - Admit Card
- Search button
- Login/Admin button
- Mobile responsive menu

Footer:
- About
- Contact
- Privacy Policy
- Sitemap
- Facebook link
- Copyright text
- Short description of UAT Help

Home page requirements:

Build the home page with these sections:

1. Hero Section
Title:
All University Admission Notices in One Place

Subtitle:
Find admission circulars, results, admit cards, seat plans, deadlines, and preparation tips for Bangladeshi universities.

Search input placeholder:
Search by university, notice, result, admit card...

CTA buttons:
- Browse Latest Notices
- Explore Universities

2. Urgent Notices Section
- Show notices where isUrgent is true
- Display deadline badge
- Display university name
- Display notice category
- Display Read More button

3. Latest Notices Section
- Show newest published notices
- Card should show:
  - Title
  - Summary
  - University name
  - Category badge
  - Published date
  - Deadline
  - Read More button

4. University Categories Section
Show category cards for:
- Public University
- Private University
- Medical
- Engineering
- Agriculture
- National University

5. Popular Universities Section
Show cards for:
- University of Dhaka
- University of Chittagong
- University of Rajshahi
- Jahangirnagar University
- Bangladesh University of Engineering and Technology
- GST Universities
- National University
- Medical Admission

6. Admission Tips Section
- Show latest published blog posts from tips category

7. Final CTA Section
Title:
Never Miss an Admission Notice

Button:
Browse All Notices

Use these Firestore collections:

users/{userId}
universities/{universityId}
notices/{noticeId}
blogPosts/{postId}
savedNotices/{savedNoticeId}
siteSettings/main
adminLogs/{logId}

Create TypeScript data models.

Notice model:

export type NoticeCategory =
  | "admission"
  | "result"
  | "admit-card"
  | "seat-plan"
  | "routine"
  | "job"
  | "scholarship"
  | "general";

export type UniversityType =
  | "public"
  | "private"
  | "national"
  | "medical"
  | "engineering"
  | "agriculture";

export type NoticeStatus = "draft" | "published" | "archived";

export interface Notice {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  universityId: string;
  universityName: string;
  category: NoticeCategory;
  universityType: UniversityType;
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
  status: NoticeStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: string;
}

University model:

export interface University {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  shortName: string;
  type: UniversityType;
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

Blog post model:

export type BlogCategory =
  | "tips"
  | "guide"
  | "routine"
  | "strategy"
  | "subject-guide"
  | "news";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
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

User model:

export type UserRole = "student" | "editor" | "admin";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  status: "active" | "disabled";
  savedUniversities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

Saved notice model:

export interface SavedNotice {
  id: string;
  userId: string;
  noticeId: string;
  createdAt: Date;
}

Site settings model:

export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  facebookUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  footerText?: string;
  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
  noticeBanner?: string;
  noticeBannerEnabled: boolean;
  updatedAt: Date;
}

Admin log model:

export interface AdminLog {
  id: string;
  action: string;
  entityType: "notice" | "university" | "post" | "user" | "settings" | "upload";
  entityId?: string;
  entityTitle?: string;
  performedBy: string;
  performedByEmail: string;
  role: UserRole;
  createdAt: Date;
  metadata?: Record<string, any>;
}

Create these backend API routes using Next.js App Router Route Handlers:

Admin APIs:

app/api/admin/dashboard/route.ts

app/api/admin/notices/route.ts
app/api/admin/notices/[id]/route.ts

app/api/admin/universities/route.ts
app/api/admin/universities/[id]/route.ts

app/api/admin/posts/route.ts
app/api/admin/posts/[id]/route.ts

app/api/admin/users/route.ts
app/api/admin/users/[id]/route.ts

app/api/admin/uploads/route.ts

app/api/admin/settings/route.ts

app/api/admin/logs/route.ts

Public APIs:

app/api/public/notices/route.ts
app/api/public/notices/[slug]/route.ts

app/api/public/universities/route.ts
app/api/public/universities/[slug]/route.ts

app/api/public/posts/route.ts
app/api/public/posts/[slug]/route.ts

app/api/public/search/route.ts

Firebase Admin SDK setup:

Create Firebase Admin SDK setup in:

lib/firebase/admin.ts

Requirements:
- Initialize Firebase Admin only once
- Use environment variables
- Export adminAuth
- Export adminDb
- Export adminStorage
- Must work only on server side
- Never expose admin credentials to client components

Environment variables for Admin SDK:

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=

Client Firebase environment variables:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

Firebase Client SDK setup:

Create Firebase client files:

lib/firebase/client.ts
lib/firebase/auth.ts
lib/firebase/firestore.ts
lib/firebase/storage.ts

Client SDK should be used for:
- Login
- Logout
- Google login
- Reading current user
- Getting Firebase ID token
- Optional public realtime data reads

Do not use client SDK for sensitive admin writes.
Admin writes must go through backend API routes.

Authentication system:

Use Firebase Authentication.

Login page must support:
1. Email/password login
2. Google login
3. Logout

After login:
- Fetch user profile from Firestore users/{uid}
- If user role is admin or editor, allow access to /admin
- If user role is student, redirect to home page
- If user document does not exist, create student profile by default

Protected admin routes:
- If user is not logged in, redirect to /login
- If user is logged in but not admin/editor, redirect to /unauthorized

Server-side auth helper:

Create server-side auth helper:

File:
lib/server/auth.ts

Functions:

1. verifySessionUser(request)
- Read Firebase ID token from Authorization header
- Header format:
  Authorization: Bearer FIREBASE_ID_TOKEN
- Verify token using Firebase Admin SDK
- Return decoded Firebase user

2. getUserRole(uid)
- Fetch users/{uid} from Firestore
- Return user role

3. requireAdmin(request)
- Verify authenticated user
- Check user role is admin
- Return user if valid
- Return 401 or 403 if invalid

4. requireEditorOrAdmin(request)
- Verify authenticated user
- Allow admin or editor
- Return user if valid
- Return 401 or 403 if invalid

5. requireActiveUser(request)
- Verify user exists
- Check status is active

Role-based access control:

Use these roles:

student:
- Can read published public content
- Can save notices
- Can manage own profile

editor:
- Can create notices
- Can edit notices
- Can create blog posts
- Can edit blog posts
- Can upload PDFs/images
- Can create and edit universities
- Cannot delete users
- Cannot change user roles
- Cannot change site settings

admin:
- Full access
- Can manage notices
- Can manage universities
- Can manage blog posts
- Can manage users
- Can change roles
- Can update site settings
- Can delete/archive content
- Can view admin logs

Use consistent API response format.

Success response:

{
  "success": true,
  "data": {},
  "message": "Success"
}

Error response:

{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}

Create helper file:

lib/server/api-response.ts

Functions:
- successResponse(data, message, status)
- errorResponse(message, code, status)

Notice admin APIs:

GET /api/admin/notices

Access:
- Admin/editor only

Features:
- Return all notices including draft, published, and archived
- Support query params:
  - status
  - category
  - universityId
  - universityType
  - session
  - search
  - limit
  - cursor

POST /api/admin/notices

Access:
- Admin/editor only

Requirements:
- Validate request body with Zod
- Auto-generate slug if missing
- Generate searchKeywords
- Save notice to Firestore
- Add createdAt
- Add updatedAt
- Add authorId
- Add viewCount = 0
- If status is published, add publishedAt
- Create admin log

GET /api/admin/notices/[id]

Access:
- Admin/editor only

Requirements:
- Return one notice by ID
- Return 404 if not found

PATCH /api/admin/notices/[id]

Access:
- Admin/editor only

Requirements:
- Validate request body
- Update notice
- Update updatedAt
- If changing from draft to published, set publishedAt
- Regenerate searchKeywords if title, tags, university, category, or session changes
- Create admin log

DELETE /api/admin/notices/[id]

Access:
- Admin only

Requirements:
- Use soft delete
- Set status = archived
- Update updatedAt
- Create admin log

University admin APIs:

GET /api/admin/universities

Access:
- Admin/editor only

Features:
- Return all universities
- Support search, type, district, and division filters

POST /api/admin/universities

Access:
- Admin/editor only

Requirements:
- Validate request body with Zod
- Auto-generate slug if missing
- Save university to Firestore
- Add createdAt
- Add updatedAt
- Create admin log

GET /api/admin/universities/[id]

Access:
- Admin/editor only

Requirements:
- Return university by ID
- Return 404 if not found

PATCH /api/admin/universities/[id]

Access:
- Admin/editor only

Requirements:
- Validate input
- Update university
- Update updatedAt
- Create admin log

DELETE /api/admin/universities/[id]

Access:
- Admin only

Requirements:
- Delete or soft delete university
- Create admin log

Blog post admin APIs:

GET /api/admin/posts

Access:
- Admin/editor only

Features:
- Return all blog posts
- Support:
  - status
  - category
  - search
  - limit
  - cursor

POST /api/admin/posts

Access:
- Admin/editor only

Requirements:
- Validate with Zod
- Auto-generate slug
- Generate searchKeywords
- Save post
- Add createdAt
- Add updatedAt
- Add authorId
- Add viewCount = 0
- If status is published, add publishedAt
- Create admin log

GET /api/admin/posts/[id]

Access:
- Admin/editor only

Requirements:
- Return blog post by ID
- Return 404 if not found

PATCH /api/admin/posts/[id]

Access:
- Admin/editor only

Requirements:
- Validate input
- Update post
- Update updatedAt
- Regenerate searchKeywords if needed
- Create admin log

DELETE /api/admin/posts/[id]

Access:
- Admin only

Requirements:
- Soft delete or archive post
- Set status = archived
- Create admin log

User management APIs:

GET /api/admin/users

Access:
- Admin only

Features:
- Return all users
- Support:
  - role filter
  - status filter
  - search

GET /api/admin/users/[id]

Access:
- Admin only

Requirements:
- Return user profile by ID
- Return 404 if not found

PATCH /api/admin/users/[id]

Access:
- Admin only

Requirements:
- Update user role, name, and status
- Prevent admin from accidentally removing own admin role unless explicitly confirmed
- Create admin log

DELETE /api/admin/users/[id]

Access:
- Admin only

Requirements:
- Prefer disabling user instead of permanent delete
- Set status = disabled
- Create admin log

Create secure file upload backend.

Route:
POST /api/admin/uploads

Access:
- Admin/editor only

Upload types:
- notice-pdf
- notice-image
- university-logo
- blog-cover

Rules:
- Images allowed:
  - jpg
  - jpeg
  - png
  - webp

- PDFs allowed:
  - pdf

Max file size:
- Image max 3MB
- PDF max 10MB

Storage paths:
uploads/notices/pdfs/{noticeId}/{filename}
uploads/notices/images/{noticeId}/{filename}
uploads/universities/logos/{universityId}/{filename}
uploads/blog/covers/{postId}/{filename}

Requirements:
- Validate file type
- Validate file size
- Upload to Firebase Storage
- Return public download URL
- Create admin log

Public APIs:

GET /api/public/notices

Requirements:
- Return only published notices
- Support:
  - category
  - universityId
  - universityType
  - session
  - urgent
  - featured
  - search
  - limit
  - cursor

GET /api/public/notices/[slug]

Requirements:
- Return only published notice by slug
- Increment viewCount safely
- Return related notices
- Return 404 if not found

GET /api/public/universities

Requirements:
- Return universities
- Support:
  - search
  - type
  - district
  - division

GET /api/public/universities/[slug]

Requirements:
- Return university by slug
- Return latest published notices from that university
- Return related tips or guides if possible

GET /api/public/posts

Requirements:
- Return only published blog posts
- Support:
  - category
  - search
  - limit
  - cursor

GET /api/public/posts/[slug]

Requirements:
- Return published blog post by slug
- Increment viewCount safely
- Return related posts
- Return 404 if not found

GET /api/public/search

Requirements:
- Search published notices, universities, and blog posts
- Return grouped result:
  - notices
  - universities
  - posts

Dashboard backend API:

Create:

GET /api/admin/dashboard

Access:
- Admin/editor only

Return:
- totalNotices
- publishedNotices
- draftNotices
- archivedNotices
- urgentNotices
- totalUniversities
- totalBlogPosts
- totalUsers
- latestNotices
- latestPosts
- recentAdminLogs
- upcomingDeadlines

Site settings API:

Create:

GET /api/admin/settings
PATCH /api/admin/settings

Access:
- Admin only

Manage siteSettings/main:

Fields:
- siteName
- tagline
- description
- logoUrl
- facebookUrl
- contactEmail
- contactPhone
- address
- footerText
- seoTitle
- seoDescription
- maintenanceMode
- noticeBanner
- noticeBannerEnabled
- updatedAt

Admin logs:

Create an admin log system.

Collection:
adminLogs/{logId}

Fields:
- id
- action
- entityType
- entityId
- entityTitle
- performedBy
- performedByEmail
- role
- createdAt
- metadata

Log these actions:
- notice_created
- notice_updated
- notice_archived
- notice_deleted
- university_created
- university_updated
- university_deleted
- post_created
- post_updated
- post_deleted
- user_role_updated
- user_disabled
- file_uploaded
- settings_updated

Validation:

Use Zod validation for all backend inputs.

Create validation files:

lib/validations/notice.ts
lib/validations/university.ts
lib/validations/post.ts
lib/validations/user.ts
lib/validations/settings.ts
lib/validations/upload.ts

Validation rules:
- Title required
- Slug required or auto-generated
- Summary required for notices
- Body/content required
- Category must be valid enum
- Status must be valid enum
- URLs must be valid URLs
- Dates must be valid
- Tags must be array of strings
- SEO description should not be too long

Create these backend utility files:

lib/server/auth.ts
lib/server/api-response.ts
lib/server/admin-log.ts
lib/server/search-keywords.ts
lib/server/slug.ts
lib/server/pagination.ts
lib/server/upload.ts
lib/server/date.ts
lib/server/validators.ts
lib/firebase/admin.ts

Admin dashboard UI:

Build a clean admin dashboard layout.

Admin layout:
- Sidebar
- Topbar
- Main content area
- User profile menu
- Logout button

Sidebar links:
- Dashboard
- Notices
- Universities
- Blog Posts
- Users
- Settings
- Logs

Dashboard page should show:
1. Total notices
2. Published notices
3. Draft notices
4. Urgent notices
5. Total universities
6. Total blog posts
7. Total users
8. Recent notices table
9. Upcoming deadlines
10. Recent admin logs
11. Quick action buttons:
   - Add Notice
   - Add University
   - Add Blog Post

Admin notice form:

Create create/edit notice form.

Fields:
- Title
- Slug auto-generated from title, editable
- Summary
- Body rich text or large textarea
- University select
- Category select
- University type select
- Unit
- Session
- Application start date
- Application deadline
- Exam date
- Result date
- PDF upload to Firebase Storage
- Image upload to Firebase Storage
- Official URL
- Tags input
- isFeatured checkbox
- isUrgent checkbox
- Status:
  - draft
  - published
  - archived
- SEO title
- SEO description

Requirements:
- Use React Hook Form
- Use Zod validation
- Upload files via /api/admin/uploads
- Submit data via backend API
- Show success toast
- Show error toast
- Redirect to /admin/notices after success

Admin university form:

Create create/edit university form.

Fields:
- English name
- Bangla name
- Slug auto-generated from English name
- Short name
- Type
- Division
- District
- Official website
- Admission website
- Logo upload
- Description
- isFeatured checkbox

Requirements:
- Use React Hook Form
- Use Zod validation
- Upload logo via /api/admin/uploads
- Submit via backend API
- Show success/error toast

Admin blog post form:

Create create/edit blog post form.

Fields:
- Title
- Slug
- Excerpt
- Content
- Category
- Tags
- Cover image upload
- Status:
  - draft
  - published
  - archived
- SEO title
- SEO description

Requirements:
- Use React Hook Form
- Use Zod validation
- Upload cover image via /api/admin/uploads
- Submit via backend API
- Show success/error toast

Admin user management:

Create /admin/users page.

Features:
- User table
- Search by name/email
- Filter by role
- Filter by status
- View user details
- Change user role
- Disable user
- Show confirmation dialog before role change or disable action

Only admin can access this page.
Editors cannot access user management.

Notice listing page:

Create /notices page.

Features:
1. Page title:
Latest University Notices

2. Search input

3. Filters:
- Category
- University type
- University
- Session
- Urgent only

4. Sort options:
- Newest first
- Deadline soon
- Popular

5. Notice cards:
- Title
- Summary
- University name
- Category badge
- Urgent badge if urgent
- Deadline if available
- Published date
- Read More button

6. Load More button or pagination

7. Empty state if no notice found

8. Loading skeletons

Notice details page:

Create /notices/[slug] page.

Features:
1. Dynamic SEO metadata
2. Notice title
3. University name
4. Category badge
5. Urgent badge if urgent
6. Published date
7. Last updated date
8. View count
9. Important dates box:
   - Application start
   - Application deadline
   - Exam date
   - Result date
10. Main notice body
11. PDF download button if pdfUrl exists
12. Official website button if officialUrl exists
13. Save notice button for logged-in students
14. Related notices
15. Share buttons
16. Disclaimer:
Always verify important information from the official university website.

University listing page:

Create /universities page.

Features:
1. Search by university name
2. Filter by type:
   - Public
   - Private
   - Medical
   - Engineering
   - Agriculture
   - National
3. Filter by district/division
4. University cards:
   - Logo
   - Name English
   - Name Bangla
   - Short name
   - Type
   - District
   - View Details button

University details page:

Create /universities/[slug] page.

Features:
1. University logo
2. Name English
3. Name Bangla
4. Type
5. District
6. Division
7. Official website button
8. Admission website button
9. Description
10. Latest published notices from this university
11. Related tips/guides

Tips/blog pages:

Create /tips page.

Features:
- Page title
- Search input
- Category filter
- Featured tips section
- Blog post cards
- Load More button

Create /tips/[slug] page.

Features:
- Dynamic SEO metadata
- Title
- Excerpt
- Cover image
- Published date
- Updated date
- View count
- Content
- Tags
- Related posts
- Share buttons

Search system:

Implement basic Firestore query-based search.

For MVP:
- Generate searchKeywords array for notices and posts
- Generate search keywords from:
  - title
  - universityName
  - category
  - tags
  - session
  - shortName
  - Bangla name if available

Search should support:
- Notice title
- University name
- Category
- Tags
- Session

Create helper:
lib/server/search-keywords.ts

Functions:
- generateSearchKeywords(input: string[])
- normalizeText(text: string)

SEO requirements:

Implement SEO.

Static metadata for:
- Home
- Notices
- Universities
- Tips
- Guides
- Results
- Admit Card
- About
- Contact

Dynamic metadata for:
- Notice details
- University details
- Blog post details

Use seoTitle and seoDescription fields if available.

Use clean URLs:
- /notices/dhaka-university-admission-circular-2025-26
- /universities/dhaka-university
- /tips/how-to-prepare-for-university-admission-test

Add:
- Open Graph metadata
- Twitter card metadata
- Sitemap support
- robots.txt

UI design requirements:

Design style:
- Modern
- Clean
- Student-friendly
- Light theme by default
- Use soft blue, green, and white color palette
- Rounded cards
- Soft shadows
- Clear badges
- Mobile-first responsive layout
- Accessible buttons and forms
- Good spacing
- Good typography
- Bangla content support with font fallback

Use shadcn/ui components:
- Button
- Card
- Badge
- Input
- Textarea
- Select
- Dialog
- Dropdown Menu
- Table
- Tabs
- Skeleton
- Toast
- Alert
- Sheet
- Avatar

Create reusable components:

Layout:
components/layout/Header.tsx
components/layout/Footer.tsx
components/layout/AdminSidebar.tsx
components/layout/AdminTopbar.tsx
components/layout/AdminLayout.tsx

Home:
components/home/HeroSearch.tsx
components/home/UrgentNotices.tsx
components/home/LatestNotices.tsx
components/home/UniversityCategories.tsx
components/home/PopularUniversities.tsx
components/home/AdmissionTips.tsx

Notices:
components/notices/NoticeCard.tsx
components/notices/NoticeFilters.tsx
components/notices/NoticeDetails.tsx
components/notices/ImportantDatesBox.tsx
components/notices/DeadlineBadge.tsx

Universities:
components/universities/UniversityCard.tsx
components/universities/UniversityFilters.tsx
components/universities/UniversityDetails.tsx

Blog:
components/blog/BlogCard.tsx
components/blog/BlogDetails.tsx
components/blog/BlogFilters.tsx

Admin:
components/admin/StatsCard.tsx
components/admin/NoticeForm.tsx
components/admin/UniversityForm.tsx
components/admin/BlogPostForm.tsx
components/admin/DataTable.tsx
components/admin/UserTable.tsx
components/admin/AdminLogTable.tsx

Shared:
components/shared/SearchInput.tsx
components/shared/EmptyState.tsx
components/shared/LoadingSkeleton.tsx
components/shared/PageHeader.tsx
components/shared/CategoryBadge.tsx
components/shared/UrgentBadge.tsx
components/shared/ShareButtons.tsx
components/shared/CopyLinkButton.tsx
components/shared/BackToTop.tsx

Firestore security rules:

Create Firestore security rules.

Rules:
- Anyone can read published notices
- Anyone can read published blog posts
- Anyone can read universities
- Only admin/editor can create or update notices
- Only admin can delete/archive notices
- Only admin/editor can create or update universities
- Only admin can delete universities
- Only admin/editor can create or update blog posts
- Only admin can delete/archive blog posts
- Users can read/update their own profile
- Admin can read all users
- Admin can update user roles
- Prevent public write access

Use this base rule:

rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function userDoc() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid));
    }

    function isActiveUser() {
      return isSignedIn() && userDoc().data.status == "active";
    }

    function isAdmin() {
      return isActiveUser() && userDoc().data.role == "admin";
    }

    function isEditorOrAdmin() {
      return isActiveUser() &&
        (
          userDoc().data.role == "admin" ||
          userDoc().data.role == "editor"
        );
    }

    match /notices/{noticeId} {
      allow read: if resource.data.status == "published" || isEditorOrAdmin();
      allow create, update: if isEditorOrAdmin();
      allow delete: if isAdmin();
    }

    match /blogPosts/{postId} {
      allow read: if resource.data.status == "published" || isEditorOrAdmin();
      allow create, update: if isEditorOrAdmin();
      allow delete: if isAdmin();
    }

    match /universities/{universityId} {
      allow read: if true;
      allow create, update: if isEditorOrAdmin();
      allow delete: if isAdmin();
    }

    match /users/{userId} {
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow read: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow update: if isSignedIn() && (request.auth.uid == userId || isAdmin());
      allow delete: if isAdmin();
    }

    match /savedNotices/{savedNoticeId} {
      allow create: if isActiveUser() &&
        request.resource.data.userId == request.auth.uid;

      allow read, delete: if isActiveUser() &&
        resource.data.userId == request.auth.uid;

      allow update: if false;
    }

    match /siteSettings/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /adminLogs/{logId} {
      allow read: if isAdmin();
      allow create: if isEditorOrAdmin();
      allow update, delete: if false;
    }
  }
}

Firebase Storage rules:

Create Firebase Storage rules.

Rules:
- Public read for uploaded notice PDFs, images, university logos, and blog images
- Only admin/editor can upload
- Only admin can delete
- Restrict file types
- Restrict file sizes

Allowed image types:
- jpg
- jpeg
- png
- webp

Allowed document type:
- pdf

Max image size:
3MB

Max PDF size:
10MB

File upload requirements:

Use upload route:

POST /api/admin/uploads

Admin dashboard must upload files through this route.

Upload fields:
- file
- type
- entityId optional

Supported types:
- notice-pdf
- notice-image
- university-logo
- blog-cover

Return:
{
  "success": true,
  "data": {
    "url": "download-url",
    "path": "storage-path"
  }
}

Admin dashboard API integration:

Admin pages must use backend APIs, not direct Firestore writes.

Use backend APIs for:
- Create notice
- Edit notice
- Delete/archive notice
- Create university
- Edit university
- Delete university
- Create blog post
- Edit blog post
- Delete blog post
- Upload files
- Update users
- Change roles
- Update settings

When calling backend APIs:
- Get Firebase ID token from current user
- Send it in Authorization header:

Authorization: Bearer FIREBASE_ID_TOKEN

Public extra UX features:

Add these UX features:

1. Deadline countdown badge
2. Copy link button
3. Share to Facebook button
4. Download PDF button
5. Save notice button for logged-in students
6. Recently viewed notices using localStorage
7. Back to top button
8. Loading skeletons
9. Empty states
10. Toast notifications
11. Responsive mobile menu
12. Clear disclaimer on notice pages

Seed data:

Add sample seed data.

Sample universities:
1. University of Dhaka
2. University of Chittagong
3. University of Rajshahi
4. Jahangirnagar University
5. Bangladesh University of Engineering and Technology
6. GST Universities
7. National University
8. Medical Admission
9. Bangladesh Agricultural University
10. Islamic University

Sample notices:
1. Dhaka University Admission Circular 2025-26
2. Chittagong University Admit Card Download Notice
3. Rajshahi University Seat Plan Published
4. GST Admission Result Published
5. Medical Admission Circular 2025-26
6. National University Honours Admission Notice
7. BUET Preliminary Result Published
8. Jahangirnagar University Unit Wise Seat Plan

Sample tips:
1. 10 Common University Admission Test Mistakes to Avoid
2. 5 Proven Tips to Boost Your Admission Test Score
3. How to Sleep Well Before Admission Test
4. How to Create a Daily Admission Preparation Routine
5. Best Strategy for Science Unit Admission Test
6. Best Strategy for Arts Unit Admission Test
7. Best Strategy for Business Studies Unit Admission Test

Scripts:

Create these scripts:

scripts/seed.ts
scripts/create-admin.ts

seed.ts:
- Create sample universities
- Create sample notices
- Create sample blog posts
- Create site settings

create-admin.ts:
- Accept email, password, and name
- Create Firebase Auth user
- Create Firestore users/{uid} document
- Set role = admin
- Set status = active

Add package.json scripts:

"seed": "tsx scripts/seed.ts",
"create-admin": "tsx scripts/create-admin.ts"

First admin setup:

Add README section explaining first admin setup.

Option 1:
Manual setup:
1. Create user in Firebase Authentication
2. Copy UID
3. Create Firestore document:

users/{uid}

{
  "name": "Admin",
  "email": "admin@example.com",
  "role": "admin",
  "status": "active",
  "createdAt": serverTimestamp(),
  "updatedAt": serverTimestamp()
}

Option 2:
Run script:

npm run create-admin

Create .env.local.example with:

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
FIREBASE_STORAGE_BUCKET=

Recommended project structure:

uat-help/
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── notices/
│   │   │   ├── universities/
│   │   │   ├── posts/
│   │   │   ├── users/
│   │   │   ├── uploads/
│   │   │   ├── settings/
│   │   │   └── logs/
│   │   └── public/
│   │       ├── notices/
│   │       ├── universities/
│   │       ├── posts/
│   │       └── search/
│   ├── admin/
│   ├── notices/
│   ├── universities/
│   ├── tips/
│   ├── guides/
│   ├── results/
│   ├── admit-card/
│   ├── about/
│   ├── contact/
│   ├── login/
│   ├── unauthorized/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── layout/
│   ├── home/
│   ├── notices/
│   ├── universities/
│   ├── blog/
│   ├── admin/
│   └── shared/
├── lib/
│   ├── firebase/
│   │   ├── admin.ts
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   └── storage.ts
│   ├── server/
│   │   ├── auth.ts
│   │   ├── api-response.ts
│   │   ├── admin-log.ts
│   │   ├── search-keywords.ts
│   │   ├── slug.ts
│   │   ├── pagination.ts
│   │   ├── upload.ts
│   │   └── date.ts
│   ├── validations/
│   │   ├── notice.ts
│   │   ├── university.ts
│   │   ├── post.ts
│   │   ├── user.ts
│   │   ├── settings.ts
│   │   └── upload.ts
│   └── utils.ts
├── types/
│   └── index.ts
├── scripts/
│   ├── seed.ts
│   └── create-admin.ts
├── public/
├── firestore.rules
├── storage.rules
├── .env.local.example
├── README.md
└── package.json

README requirements:

Create a detailed README.md.

README must include:

1. Project overview
2. Features list
3. Tech stack
4. Installation guide
5. Firebase project setup
6. Firebase Authentication setup
7. Firestore setup
8. Firebase Storage setup
9. Environment variable setup
10. How to run locally
11. How to seed sample data
12. How to create first admin user
13. How to deploy to Vercel
14. How to deploy Firestore rules
15. How to deploy Storage rules
16. Admin dashboard usage
17. Role permission guide
18. Folder structure explanation

Final output requirements:

Generate the full codebase.

Make sure:

1. App runs without TypeScript errors
2. All public routes work
3. All admin routes work
4. Admin routes are protected
5. Backend APIs are protected
6. Firebase Admin SDK works server-side only
7. Firebase client SDK works client-side
8. Firestore data models are typed
9. Zod validation is used
10. API response format is consistent
11. Admin logs are created
12. File upload is secure
13. Public APIs only return published content
14. Draft and archived content are hidden from public
15. Admin/editor can manage content
16. Only admin can manage users and settings
17. Search and filters work
18. SEO metadata is implemented
19. Sitemap and robots are included
20. UI is responsive and mobile friendly
21. README is complete
22. Seed script works
23. Create-admin script works
24. Firestore rules are included
25. Storage rules are included

Important security requirements:

Security is very important.

Implement these rules carefully:

1. Do not expose Firebase Admin SDK credentials to frontend.
2. Do not rely only on frontend role checks.
3. Every admin API must verify Firebase ID token server-side.
4. Every admin API must check user role server-side.
5. Validate all inputs using Zod.
6. Sanitize slugs.
7. Validate file type and file size before upload.
8. Public APIs must never return draft content.
9. Use soft delete/archive for notices and posts.
10. Create admin logs for all important admin actions.
11. Only admin can update user roles.
12. Only admin can update site settings.
13. Editors can create and update content but cannot manage users/settings.
14. Return safe error messages.
15. Use Firestore Security Rules as second protection layer.

Final instruction:

Now generate the complete project code.

Start by creating:
1. Project structure
2. TypeScript types
3. Firebase client setup
4. Firebase Admin setup
5. Server auth helpers
6. API response helpers
7. Validation schemas
8. Backend API routes
9. Public pages
10. Admin dashboard pages
11. Forms
12. Components
13. Firestore rules
14. Storage rules
15. Seed scripts
16. Create admin script
17. README

Do not skip backend management.
Do not only create frontend mockup.
Build a real full-stack app with secure backend APIs and admin dashboard.
# UAT Help

All University Admission Notices in One Place. A comprehensive full-stack platform built with Next.js 14, Tailwind CSS, shadcn/ui, and Firebase.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm or pnpm
- Firebase Account

### 2. Environment Setup
Rename `.env.example` to `.env.local` and fill in your Firebase credentials.
To get the Admin SDK credentials, go to Firebase Console > Project Settings > Service Accounts > Generate New Private Key.

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
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Create First Admin
Use the provided script to create your first admin user.
```bash
npx tsx scripts/create-admin.ts your-email@example.com your-secure-password "Your Name"
```

### 5. Seed Database (Optional)
Populate your database with mock universities and notices for testing.
```bash
npx tsx scripts/seed.ts
```

### 6. Run the Application
```bash
npm run dev
```

### 7. Deploy Firebase Rules
To secure your production database and storage, deploy the security rules:
```bash
firebase deploy --only firestore,storage
```

## Features
- **Public Site**: SEO-friendly lists of universities, notices, admit cards, and blogs.
- **Admin Dashboard**: Secure panel to manage universities, notices, users, and logs.
- **Role-Based Access**: Admins (full control), Editors (content only), Students (read/profile).
- **Security**: Next.js route handlers secured by Firebase Admin token verification. Zod validation for all data.
- **Firebase**: Uses Auth, Firestore, and Storage natively.

## Structure
- `/src/app/(public)` - The student-facing website
- `/src/app/admin` - The secured admin dashboard
- `/src/app/api` - Backend REST API protected via middleware
- `/src/components` - UI Components (shadcn + custom)
- `/src/lib/firebase` - Firebase client & admin SDK wrappers
- `/scripts` - CLI tools for admin creation and seeding

# Firebase Migration Guide

## Overview
The project has been migrated from Supabase (PostgreSQL) to Firebase (Firestore + Authentication).

## What's Been Done

### 1. Firebase Configuration ✅
- **File**: `lib/firebase/config.ts`
- Initializes Firebase app, Auth, Firestore, and Storage
- Exports `auth`, `db`, and `storage` instances

### 2. Firebase Authentication ✅
- **File**: `lib/firebase/auth.ts`
- Functions for sign-up, sign-in, Google OAuth, sign-out
- Password reset and profile management
- Methods:
  - `signUp(email, password)`
  - `signIn(email, password)`
  - `signInWithGoogle()`
  - `logOut()`
  - `getCurrentUser()`
  - `onAuthStateChange(callback)`

### 3. Auth Context Provider ✅
- **File**: `lib/firebase/auth-context.tsx`
- Provides `useAuth()` hook for accessing user state globally
- Manages loading state and authentication status

### 4. Firestore Database Utilities ✅
- **File**: `lib/firebase/database.ts`
- Functions for CRUD operations
- Methods:
  - `addDocument(collection, data)`
  - `setDocument(collection, docId, data, merge?)`
  - `getDocument(collection, docId)`
  - `queryDocuments(collection, constraints)`
  - `getDocumentsByField(collection, fieldName, fieldValue)`
  - `updateDocument(collection, docId, data)`
  - `deleteDocument(collection, docId)`
  - `getAllDocuments(collection)`

### 5. Updated Auth Pages ✅
- **Login Page**: `app/(auth)/login/page.tsx`
  - Uses Firebase `signIn()` and `signInWithGoogle()`
- **Signup Page**: `app/(auth)/signup/page.tsx`
  - Uses Firebase `signUp()` and creates Firestore documents for profile and preferences

### 6. Layout Updates ✅
- **File**: `app/layout.tsx`
- Added `AuthProvider` wrapper for global auth state

## Environment Variables

Add these to `.env.local` (get values from Firebase Console):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID_HERE
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control. These are public keys (safe to expose) but should still be kept in `.env.local` and added to `.gitignore`.

## Firestore Database Structure

### Collections Needed

1. **profiles**
   ```
   {
     id: string (Firebase UID)
     email: string
     displayName: string
     role: "student" | "admin" | "moderator"
     isVerified: boolean
     isBlocked: boolean
     photoURL: string | null
     createdAt: timestamp
     updatedAt: timestamp
   }
   ```

2. **userPreferences**
   ```
   {
     userId: string
     emailNotifications: boolean
     deadlineReminders: boolean
     productUpdates: boolean
     weeklyDigest: boolean
     themePreference: "system" | "light" | "dark"
     createdAt: timestamp
     updatedAt: timestamp
   }
   ```

3. **universities** (migrate from Supabase)
4. **admissionCirculars** (migrate from Supabase)
5. **blogPosts** (migrate from Supabase)
6. **conversations** (chat history)
7. **bookmarks** (saved items)
8. **savedUniversities** (liked universities)

## Next Steps - IMPORTANT

### 1. **Remaining API Routes to Update** (104 files with Supabase imports)
These files still use Supabase and need to be updated:
- `app/api/admin/**` (all routes)
- `app/api/chat/route.ts`
- `app/api/bookmarks/route.ts`
- `app/api/auth/verify-email/route.ts`
- `app/(admin)/**` (page components)
- `app/(dashboard)/**` (page components)
- `app/(marketing)/**` (page components)

### 2. **Migration Steps for Each File**

Replace Supabase imports with Firebase:
```typescript
// Old (Supabase)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
const { data: users } = await supabase.from("profiles").select("*");

// New (Firebase)
import { queryDocuments, getDocument } from "@/lib/firebase/database";
const profiles = await queryDocuments("profiles");
const profile = await getDocument("profiles", userId);
```

### 3. **Common Replacements**

| Supabase | Firebase |
|----------|----------|
| `supabase.from("table").select()` | `queryDocuments("collection")` |
| `supabase.from("table").select().eq("field", value)` | `getDocumentsByField("collection", "field", value)` |
| `supabase.from("table").select().single()` | `getDocument("collection", id)` |
| `supabase.from("table").insert(data)` | `addDocument("collection", data)` |
| `supabase.from("table").update(data).eq("id", id)` | `updateDocument("collection", id, data)` |
| `supabase.from("table").delete().eq("id", id)` | `deleteDocument("collection", id)` |
| `supabase.auth.getUser()` | `getCurrentUser()` (Firebase) |

### 4. **Database Schema Migration**

Use Firebase console or a migration script to:
1. Export data from Supabase PostgreSQL
2. Transform to Firestore document format
3. Import into Firebase

### 5. **Security Rules**

Create Firestore Security Rules in Firebase Console:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own profile
    match /profiles/{document=**} {
      allow read, write: if request.auth.uid == document;
    }
    
    // Allow authenticated users to read public data
    match /universities/{document=**} {
      allow read: if request.auth != null;
    }
    
    // Admin-only operations
    match /admin/{document=**} {
      allow read, write: if request.auth.token.role == "admin";
    }
  }
}
```

## Testing

1. **Test Login**: `npm run dev` → Go to `/login` → Test email/password and Google login
2. **Test Signup**: Go to `/signup` → Create new account
3. **Verify Firestore**: Check Firebase Console → Firestore Database for created documents
4. **Test Auth State**: Use `useAuth()` hook to verify authentication state

## Troubleshooting

**Error: "Firebase config not found"**
- Ensure `.env.local` has all required Firebase variables
- Restart dev server after changing environment variables

**Error: "Missing Firestore permissions"**
- Check Firestore Security Rules in Firebase Console
- Ensure user is authenticated

**Error: "Collection not found"**
- Create collection in Firebase Console
- Or use `setDocument()` which auto-creates collections

## API Documentation

### Using useAuth() in Components
```typescript
import { useAuth } from "@/lib/firebase/auth-context";

export default function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return <div>Welcome, {user?.displayName}</div>;
}
```

### Querying Data
```typescript
import { queryDocuments, getDocumentsByField } from "@/lib/firebase/database";
import { where } from "firebase/firestore";

// Get all documents
const profiles = await queryDocuments("profiles");

// Get with where clause
const admins = await queryDocuments("profiles", [
  where("role", "==", "admin")
]);

// Get by specific field
const userProfile = await getDocumentsByField("profiles", "email", "user@example.com");
```

## Notes
- Firebase Firestore has different pricing model than PostgreSQL (read/write operations)
- No complex SQL queries - use simple queries or fetch all and filter
- Real-time listeners available via `onSnapshot()` for real-time updates
- Firebase Storage for file uploads (not covered in this guide yet)

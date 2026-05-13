/**
 * Seed Users Script for UAT Help (Firebase)
 *
 * This script creates dummy users in Firebase for testing purposes.
 *
 * Prerequisites:
 *   - GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service account key
 *   - firebase-admin installed
 *
 * Usage:
 *   npx ts-node scripts/seed-users.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (getApps().length === 0) {
  initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'uat-help',
  });
}

const auth = getAuth();
const db = getFirestore();

const users = [
  { email: "student1@test.com", password: "TestPass123!", fullName: "Rafiq Ahmed", role: "student" },
  { email: "student2@test.com", password: "TestPass123!", fullName: "Fatima Khan", role: "student" },
  { email: "student3@test.com", password: "TestPass123!", fullName: "Ali Hassan", role: "student" },
  { email: "admin@test.com", password: "AdminPass123!", fullName: "Admin User", role: "admin" },
  { email: "moderator@test.com", password: "ModPass123!", fullName: "Moderator User", role: "moderator" },
];

async function seedUsers() {
  console.log("🌱 Seeding users into Firebase...\n");

  for (const user of users) {
    try {
      // Create user in Firebase Auth
      let uid: string;
      try {
        const userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.fullName,
          emailVerified: true,
        });
        uid = userRecord.uid;
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          const existingUser = await auth.getUserByEmail(user.email);
          uid = existingUser.uid;
          console.log(`  ⚠️  User ${user.email} already exists, updating profile...`);
        } else {
          throw error;
        }
      }

      // Create/update profile in Firestore
      await db.collection('profiles').doc(uid).set({
        email: user.email,
        displayName: user.fullName,
        role: user.role,
        isVerified: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log(`  ✅ ${user.fullName} (${user.email}) - Role: ${user.role}`);
    } catch (error) {
      console.error(`  ❌ Error creating ${user.email}:`, error);
    }
  }

  console.log("\n✨ Seeding complete!");
  process.exit(0);
}

seedUsers().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

// src/lib/firebase/admin.ts
// Firebase Admin SDK — SERVER SIDE ONLY, never import in client components
import * as admin from "firebase-admin";
import { App, getApps, initializeApp, cert } from "firebase-admin/app";
import { Auth, getAuth } from "firebase-admin/auth";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import { Storage, getStorage } from "firebase-admin/storage";

let adminApp: App;

function initAdmin(): App {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey,
      }),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET!,
    });
  } else {
    adminApp = getApps()[0];
  }
  return adminApp;
}

export const adminAuth: Auth = getAuth(initAdmin());
export const adminDb: Firestore = getFirestore(initAdmin());
export const adminStorage: Storage = getStorage(initAdmin());

export { admin };

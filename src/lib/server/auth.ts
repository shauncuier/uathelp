// src/lib/server/auth.ts
// Server-side auth verification using Firebase Admin SDK
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { errorResponse } from "./api-response";
import { NextRequest } from "next/server";
import { UserRole, UserStatus } from "@/types";

export interface VerifiedUser {
  uid: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export async function verifySessionUser(request: NextRequest): Promise<VerifiedUser | null> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await getUserFromFirestore(decoded.uid);
    return user;
  } catch {
    return null;
  }
}

export async function getUserFromFirestore(uid: string): Promise<VerifiedUser | null> {
  try {
    const doc = await adminDb.collection("users").doc(uid).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
      uid,
      email: data.email,
      role: data.role as UserRole,
      status: data.status as UserStatus,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(request: NextRequest) {
  const user = await verifySessionUser(request);
  if (!user) {
    return { user: null, response: errorResponse("Unauthorized", "UNAUTHORIZED", 401) };
  }
  if (user.status !== "active") {
    return { user: null, response: errorResponse(`Account ${user.status}`, "ACCOUNT_INACTIVE", 403) };
  }
  if (user.role !== "admin") {
    return { user: null, response: errorResponse("Admin access required", "FORBIDDEN", 403) };
  }
  return { user, response: null };
}

export async function requireEditorOrAdmin(request: NextRequest) {
  const user = await verifySessionUser(request);
  if (!user) {
    return { user: null, response: errorResponse("Unauthorized", "UNAUTHORIZED", 401) };
  }
  if (user.status !== "active") {
    return { user: null, response: errorResponse(`Account ${user.status}`, "ACCOUNT_INACTIVE", 403) };
  }
  if (user.role !== "admin" && user.role !== "editor") {
    return { user: null, response: errorResponse("Editor or Admin access required", "FORBIDDEN", 403) };
  }
  return { user, response: null };
}

export async function requireActiveUser(request: NextRequest) {
  const user = await verifySessionUser(request);
  if (!user) {
    return { user: null, response: errorResponse("Unauthorized", "UNAUTHORIZED", 401) };
  }
  if (user.status !== "active") {
    return { user: null, response: errorResponse(`Account ${user.status}`, "ACCOUNT_INACTIVE", 403) };
  }
  return { user, response: null };
}

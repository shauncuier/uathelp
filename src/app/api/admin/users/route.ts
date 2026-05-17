// src/app/api/admin/users/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";
import type { Query } from "firebase-admin/firestore";
import type { UserRole, UserStatus } from "@/types";

type AdminUserListItem = {
  id: string;
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
  [key: string]: unknown;
};

function filterUsers(
  users: AdminUserListItem[],
  role: string | null,
  status: string | null,
  search: string | null
) {
  let filtered = users;

  if (role) {
    filtered = filtered.filter((u) => u.role === role);
  }

  if (status) {
    filtered = filtered.filter((u) => (u.status || "active") === status);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query: Query = adminDb.collection("users").orderBy("createdAt", "desc");
    if (role) query = query.where("role", "==", role);
    if (status) query = query.where("status", "==", status);

    let snap;
    try {
      snap = await query.limit(50).get();
    } catch (err) {
      console.warn("Falling back to in-memory user filters. Firestore indexes may still be building.", err);
      snap = await adminDb.collection("users").orderBy("createdAt", "desc").limit(500).get();
    }

    let users = snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUserListItem));
    users = filterUsers(users, role, status, search);

    return successResponse({ users: users.slice(0, 50), total: users.length });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch users", "SERVER_ERROR");
  }
}

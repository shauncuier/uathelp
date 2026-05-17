// src/app/api/admin/users/route.ts
import { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/server/auth";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  const { user, response } = await requireAdmin(request);
  if (!user) return response!;

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    let query: any = adminDb.collection("users").orderBy("createdAt", "desc");
    if (role) query = query.where("role", "==", role);
    if (status) query = query.where("status", "==", status);

    const snap = await query.limit(50).get();
    let users = snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
      );
    }

    return successResponse({ users, total: users.length });
  } catch (err) {
    console.error(err);
    return errorResponse("Failed to fetch users", "SERVER_ERROR");
  }
}

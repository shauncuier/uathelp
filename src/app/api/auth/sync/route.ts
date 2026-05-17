import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { successResponse, errorResponse } from "@/lib/server/api-response";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return errorResponse("Unauthorized", "UNAUTHORIZED", 401);
    }
    
    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    const userRef = adminDb.collection("users").doc(uid);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists) {
      // Create a brand new user profile
      const defaultRole = "student";
      
      await userRef.set({
        email: email || "",
        name: name || email?.split("@")[0] || "Student",
        avatarUrl: picture || null,
        role: defaultRole,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Assign custom claim
      await adminAuth.setCustomUserClaims(uid, { role: defaultRole });
    }

    return successResponse({ message: "User synced successfully" });
  } catch (err: any) {
    console.error("Sync Error:", err);
    return errorResponse(err.message || "Failed to sync user", "SERVER_ERROR", 500);
  }
}

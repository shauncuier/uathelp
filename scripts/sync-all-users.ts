import * as dotenv from "dotenv";
import path from "path";
import type { UserRecord } from "firebase-admin/auth";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function syncAllUsers() {
  try {
    const { adminAuth, adminDb } = await import("../src/lib/firebase/admin");
    console.log("Fetching all users from Firebase Auth...");
    
    let allUsers: UserRecord[] = [];
    let pageToken: string | undefined;
    do {
      const result = await adminAuth.listUsers(1000, pageToken);
      allUsers = allUsers.concat(result.users);
      pageToken = result.pageToken;
    } while (pageToken);

    console.log(`Found ${allUsers.length} users in Firebase Auth.`);

    let synced = 0;
    for (const user of allUsers) {
      const userRef = adminDb.collection("users").doc(user.uid);
      const snap = await userRef.get();
      
      if (!snap.exists) {
        console.log(`User ${user.email} is missing in Firestore. Creating...`);
        const customClaims = user.customClaims || {};
        
        await userRef.set({
          email: user.email || "",
          name: user.displayName || user.email?.split("@")[0] || "User",
          avatarUrl: user.photoURL || null,
          role: customClaims.role || "student",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date()
        });
        synced++;
      }
    }

    console.log(`\nSync complete! Added ${synced} missing users to Firestore.`);
    process.exit(0);
  } catch (error) {
    console.error("Error syncing users:", error);
    process.exit(1);
  }
}

syncAllUsers();

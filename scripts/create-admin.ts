import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || "Admin User";

  if (!email || !password) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> [name]");
    process.exit(1);
  }

  try {
    const { adminAuth, adminDb } = await import("../src/lib/firebase/admin");
    console.log(`Creating admin user: ${email}...`);
    
    // Check if user already exists
    let uid = "";
    try {
      const existing = await adminAuth.getUserByEmail(email);
      uid = existing.uid;
      console.log("User already exists in Firebase Auth. Updating password and role...");
      await adminAuth.updateUser(uid, { password });
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        const user = await adminAuth.createUser({
          email,
          password,
          displayName: name,
        });
        uid = user.uid;
      } else {
        throw e;
      }
    }

    // Set custom claims
    await adminAuth.setCustomUserClaims(uid, { role: "admin" });

    // Ensure Firestore record exists
    await adminDb.collection("users").doc(uid).set({
      email,
      name,
      role: "admin",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true });

    console.log(`\nSuccess! Admin created with email: ${email}`);
    console.log(`You can now log in at /login`);
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

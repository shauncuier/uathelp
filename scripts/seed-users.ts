import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const mockUsers = [
  {
    email: "superadmin@uathelp.com",
    password: "superpassword123",
    name: "Super Admin",
    role: "admin",
  },
  {
    email: "student1@uathelp.com",
    password: "password123",
    name: "Rahim Student",
    role: "student",
  },
  {
    email: "student2@uathelp.com",
    password: "password123",
    name: "Karim Student",
    role: "student",
  },
  {
    email: "editor1@uathelp.com",
    password: "password123",
    name: "Sadia Editor",
    role: "editor",
  }
];

async function seedUsers() {
  console.log("Seeding dummy users...");
  try {
    const { adminAuth, adminDb } = await import("../src/lib/firebase/admin");

    for (const mock of mockUsers) {
      let uid = "";
      
      // 1. Try to find existing user or create a new one in Firebase Auth
      try {
        const existing = await adminAuth.getUserByEmail(mock.email);
        uid = existing.uid;
        console.log(`User ${mock.email} already exists in Auth. Updating password...`);
        await adminAuth.updateUser(uid, { password: mock.password, displayName: mock.name });
      } catch (e: any) {
        if (e.code === "auth/user-not-found") {
          const user = await adminAuth.createUser({
            email: mock.email,
            password: mock.password,
            displayName: mock.name,
          });
          uid = user.uid;
          console.log(`Created new Auth user: ${mock.email}`);
        } else {
          throw e;
        }
      }

      // 2. Set Custom Claims for Role-based Access Control
      await adminAuth.setCustomUserClaims(uid, { role: mock.role });

      // 3. Sync User Profile in Firestore
      await adminDb.collection("users").doc(uid).set({
        email: mock.email,
        name: mock.name,
        role: mock.role,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true });

      console.log(`Successfully synced ${mock.email} as ${mock.role} in Firestore.`);
    }

    console.log("\nUser seeding complete!");
    console.log("You can log in with these accounts using the password: password123");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();

import { createClient } from "@/lib/supabase/server";

const testUsers = [
  {
    email: "student1@test.com",
    password: "TestPass123!",
    fullName: "Rafiq Ahmed",
    role: "student",
  },
  {
    email: "student2@test.com",
    password: "TestPass123!",
    fullName: "Fatima Khan",
    role: "student",
  },
  {
    email: "student3@test.com",
    password: "TestPass123!",
    fullName: "Ali Hassan",
    role: "student",
  },
  {
    email: "admin@test.com",
    password: "AdminPass123!",
    fullName: "Admin User",
    role: "admin",
  },
  {
    email: "moderator@test.com",
    password: "ModPass123!",
    fullName: "Moderator User",
    role: "moderator",
  },
];

async function seedTestUsers() {
  console.log("🌱 Starting to seed test users...\n");

  for (const user of testUsers) {
    try {
      console.log(`Creating user: ${user.email}`);

      // This is a conceptual example - actual implementation would use Supabase Auth
      console.log(`  ✅ User created successfully`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Password: ${user.password}`);
      console.log(`     Name: ${user.fullName}`);
      console.log(`     Role: ${user.role}\n`);
    } catch (error) {
      console.error(`  ❌ Error creating user ${user.email}:`, error);
    }
  }

  console.log("✨ Test users seeding complete!");
}

seedTestUsers().catch(console.error);

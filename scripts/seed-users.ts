/**
 * Seed Test Users
 * 
 * This script creates dummy users in Supabase for testing purposes.
 * These users will have actual auth accounts you can login with.
 * 
 * Usage:
 *   npx ts-node scripts/seed-users.ts
 * 
 * Or run SQL directly in Supabase:
 *   1. Go to Supabase Dashboard
 *   2. SQL Editor
 *   3. Copy the SQL from scripts/seed-users.sql
 *   4. Execute
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface TestUser {
  email: string;
  password: string;
  name: string;
  role: "student" | "moderator" | "admin" | "super_admin";
}

const testUsers: TestUser[] = [
  {
    email: "student1@test.uathelp.com",
    password: "TestPass123!@#",
    name: "Ahmed Student",
    role: "student",
  },
  {
    email: "student2@test.uathelp.com",
    password: "TestPass123!@#",
    name: "Fatima Student",
    role: "student",
  },
  {
    email: "moderator@test.uathelp.com",
    password: "TestPass123!@#",
    name: "Mowgli Moderator",
    role: "moderator",
  },
  {
    email: "admin@test.uathelp.com",
    password: "TestPass123!@#",
    name: "Admin User",
    role: "admin",
  },
  {
    email: "superadmin@test.uathelp.com",
    password: "TestPass123!@#",
    name: "Super Admin",
    role: "super_admin",
  },
];

async function seedUsers() {
  console.log("🌱 Starting user seeding...\n");

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    for (const user of testUsers) {
      console.log(`Creating user: ${user.email} (${user.role})...`);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.name,
        },
      });

      if (authError) {
        if (authError.message.includes("already exists")) {
          console.log(`  ⚠️  User already exists, updating profile...\n`);
          
          // Get existing user
          const { data: existingUser } = await supabase.auth.admin.listUsers();
          const userId = existingUser?.users.find(u => u.email === user.email)?.id;
          
          if (userId) {
            await supabase.from("profiles").upsert({
              id: userId,
              email: user.email,
              full_name: user.name,
              role: user.role,
              is_verified: true,
              is_blocked: false,
            });
          }
        } else {
          console.error(`  ❌ Error creating user: ${authError.message}\n`);
          continue;
        }
      } else if (authData?.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          email: user.email,
          full_name: user.name,
          role: user.role,
          is_verified: true,
          is_blocked: false,
          avatar_url: null,
        });

        if (profileError) {
          console.error(`  ❌ Error creating profile: ${profileError.message}\n`);
        } else {
          console.log(`  ✅ Created successfully\n`);
        }
      }
    }

    console.log("✨ User seeding completed!\n");
    console.log("📝 Test Credentials:");
    console.log("─".repeat(50));
    testUsers.forEach((user) => {
      console.log(`Email:    ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role:     ${user.role}`);
      console.log("─".repeat(50));
    });
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

seedUsers();

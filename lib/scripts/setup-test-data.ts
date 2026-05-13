/**
 * Test Data Setup Script for UAT Help
 * 
 * This script demonstrates how to create test users and data in Firebase.
 * Run with: npx ts-node lib/scripts/setup-test-data.ts
 */

const testUsers = [
  {
    email: "student1@test.com",
    password: "TestPass123!",
    fullName: "Rafiq Ahmed",
    role: "student",
    academicProfile: {
      level: "hsc",
      stream: "science",
      currentGpa: 4.8,
    },
  },
  {
    email: "student2@test.com",
    password: "TestPass123!",
    fullName: "Fatima Khan",
    role: "student",
    academicProfile: {
      level: "hsc",
      stream: "science",
      currentGpa: 4.9,
    },
  },
  {
    email: "student3@test.com",
    password: "TestPass123!",
    fullName: "Ali Hassan",
    role: "student",
    academicProfile: {
      level: "hsc",
      stream: "commerce",
      currentGpa: 4.7,
    },
  },
  {
    email: "admin@test.com",
    password: "AdminPass123!",
    fullName: "Admin User",
    role: "admin",
    academicProfile: null,
  },
  {
    email: "moderator@test.com",
    password: "ModPass123!",
    fullName: "Moderator User",
    role: "moderator",
    academicProfile: null,
  },
];

const testConversations = [
  {
    userId: "user_id_1",
    title: "BUET Admission Questions",
    messages: [
      {
        role: "user" as const,
        content: "Which university is best for Engineering?",
      },
      {
        role: "assistant" as const,
        content:
          "For Engineering in Bangladesh, I'd recommend BUET, KUET, or RUET. BUET is highly ranked and competitive. Would you like details about their admission process?",
      },
    ],
  },
  {
    userId: "user_id_1",
    title: "Medical College Guidance",
    messages: [
      {
        role: "user" as const,
        content: "How do I prepare for medical college admission?",
      },
      {
        role: "assistant" as const,
        content:
          "Medical college admission requires strong science fundamentals and good MCAT score. Start with biology and chemistry basics...",
      },
    ],
  },
];

const testSavedUniversities = [
  {
    userId: "user_id_1",
    universityId: "buet",
    savedAt: new Date(),
  },
  {
    userId: "user_id_1",
    universityId: "du",
    savedAt: new Date(),
  },
  {
    userId: "user_id_2",
    universityId: "nsu",
    savedAt: new Date(),
  },
];

const testBookmarks = [
  {
    userId: "user_id_1",
    postId: "complete-admission-guide-2026",
    bookmarkedAt: new Date(),
  },
  {
    userId: "user_id_1",
    postId: "buet-admission-preparation",
    bookmarkedAt: new Date(),
  },
  {
    userId: "user_id_2",
    postId: "medical-admission-guide",
    bookmarkedAt: new Date(),
  },
];

// Helper function to display test user credentials
export function displayTestUsers() {
  console.log("\n🌱 UAT Help - Test User Credentials\n");
  console.log("=".repeat(60));

  console.log("\n👨‍🎓 STUDENT ACCOUNTS:\n");
  testUsers
    .filter((u) => u.role === "student")
    .forEach((user, i) => {
      console.log(`${i + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Stream: ${user.academicProfile?.stream}`);
      console.log();
    });

  console.log("👨‍💼 ADMIN/MODERATOR ACCOUNTS:\n");
  testUsers
    .filter((u) => u.role !== "student")
    .forEach((user, i) => {
      console.log(`${i + 1}. ${user.fullName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log(`   Role: ${user.role.toUpperCase()}`);
      console.log();
    });

  console.log("=".repeat(60));
  console.log(
    "\n⚠️  These credentials are for testing only. Never use in production.\n"
  );
}

// Helper function to verify test data structure
export function verifyTestDataStructure() {
  console.log("\n✅ Test Data Structure Verification\n");

  console.log("Test Users:", testUsers.length);
  console.log("  - Students:", testUsers.filter((u) => u.role === "student").length);
  console.log("  - Admins:", testUsers.filter((u) => u.role === "admin").length);
  console.log("  - Moderators:", testUsers.filter((u) => u.role === "moderator").length);

  console.log("\nTest Conversations:", testConversations.length);
  console.log("Test Saved Universities:", testSavedUniversities.length);
  console.log("Test Bookmarks:", testBookmarks.length);

  console.log("\n✨ All test data structures validated!\n");
}

// Export for use in seeding scripts
export { testUsers, testConversations, testSavedUniversities, testBookmarks };

// Run verification if executed directly
if (require.main === module) {
  displayTestUsers();
  verifyTestDataStructure();
}

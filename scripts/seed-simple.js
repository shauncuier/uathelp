#!/usr/bin/env node

/**
 * Simple seed script - seed notices and blog posts to Firestore
 * Run: node scripts/seed-simple.js
 */

require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();

const mockNotices = [
  {
    title: "DU Undergraduate Admission Circular 2024-2025",
    slug: "du-undergraduate-admission-circular-2024-2025",
    summary: "Online application for undergraduate program of Dhaka University for the academic year 2024-2025 will begin soon.",
    body: "<p>The online application process for the first-year undergraduate program of Dhaka University for the 2024-2025 academic session will commence on Monday.</p>",
    category: "admission",
    universityName: "University of Dhaka",
    universityType: "public",
    session: "2024-2025",
    status: "published",
    isUrgent: true,
    isFeatured: true,
    searchKeywords: ["du", "dhaka", "admission", "circular", "2024-2025"],
    applicationEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days - CRITICAL
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "BUET Admission Test 2024 Result Published",
    slug: "buet-admission-test-2024-result",
    summary: "The BUET admission test results for 2024 session are now available on the official website.",
    body: "<p>Candidates can check their results using their registration number and password on the BUET admission portal.</p>",
    category: "result",
    universityName: "Bangladesh University of Engineering and Technology",
    universityType: "engineering",
    session: "2024",
    status: "published",
    isUrgent: false,
    isFeatured: true,
    searchKeywords: ["buet", "result", "2024", "admission test"],
    applicationEnd: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Past deadline
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Rajshahi University Admit Card Download 2024",
    slug: "rajshahi-university-admit-card-2024",
    summary: "Admit cards for RU admission test 2024 are ready for download from the official portal.",
    body: "<p>All candidates who have completed their application can now download their admit cards. The test will be held on the scheduled date.</p>",
    category: "admit-card",
    universityName: "Rajshahi University",
    universityType: "public",
    session: "2024",
    status: "published",
    isUrgent: true,
    isFeatured: false,
    searchKeywords: ["rajshahi", "admit card", "2024"],
    applicationEnd: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days - WARNING
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
   {
     title: "Jahangirnagar University Exam Routine Published",
     slug: "jahangirnagar-university-exam-routine-2024",
     summary: "The detailed exam routine for JU admission 2024 has been announced. Check the schedule now.",
     body: "<p>Students appearing for JU admission exam should download the complete routine to avoid confusion.</p>",
     category: "routine",
     universityName: "Jahangirnagar University",
     universityType: "public",
     session: "2024",
     status: "published",
     isUrgent: false,
     isFeatured: true,
     searchKeywords: ["jahangirnagar", "routine", "exam", "schedule"],
     applicationEnd: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days - WARNING
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "Medical University Scholarship Opportunities 2024",
     slug: "medical-university-scholarship-2024",
     summary: "Scholarships are available for meritorious medical students. Apply now to get financial assistance.",
     body: "<p>Merit-based and need-based scholarships are offered to qualified candidates pursuing medical degrees.</p>",
     category: "scholarship",
     universityName: "Bangabandhu Sheikh Mujib Medical University",
     universityType: "medical",
     session: "2024",
     status: "published",
     isUrgent: true,
     isFeatured: false,
     searchKeywords: ["scholarship", "medical", "bsmmu", "financial aid"],
     applicationEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days - WARNING
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "CUET Admission Application Extended",
     slug: "cuet-admission-application-extended-2024",
     summary: "Deadline for CUET admission application has been extended by one week.",
     body: "<p>Due to overwhelming response, the application deadline has been pushed to provide students more time to apply.</p>",
     category: "admission",
     universityName: "Chittagong University of Engineering & Technology",
     universityType: "engineering",
     session: "2024",
     status: "published",
     isUrgent: true,
     isFeatured: true,
     searchKeywords: ["cuet", "admission", "extended deadline", "application"],
     applicationEnd: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day - CRITICAL
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "Bangladesh Agricultural University Seat Plan Released",
     slug: "bau-seat-plan-2024",
     summary: "The seating arrangement for BAU admission exam has been finalized and published.",
     body: "<p>Check your roll number and assigned seat in the provided document.</p>",
     category: "seat-plan",
     universityName: "Bangladesh Agricultural University",
     universityType: "agriculture",
     session: "2024",
     status: "published",
     isUrgent: false,
     isFeatured: false,
     searchKeywords: ["bau", "seat plan", "exam", "arrangement"],
     applicationEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days - normal
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "National University Admission Notification",
     slug: "national-university-admission-2024",
     summary: "NU announces its upcoming admission test for various undergraduate and graduate programs.",
     body: "<p>Eligible candidates are invited to apply for admission to National University programs.</p>",
     category: "admission",
     universityName: "National University",
     universityType: "national",
     session: "2024",
     status: "published",
     isUrgent: false,
     isFeatured: true,
     searchKeywords: ["national university", "admission", "nu", "programs"],
     applicationEnd: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days - normal
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "KUET Application Fee Payment Reminder",
     slug: "kuet-application-fee-payment-reminder",
     summary: "Last day to complete application fee payment for KUET admission is coming soon.",
     body: "<p>Candidates who have filled their application forms must complete fee payment within the stipulated time.</p>",
     category: "general",
     universityName: "Khulna University of Engineering & Technology",
     universityType: "engineering",
     session: "2024",
     status: "published",
     isUrgent: true,
     isFeatured: false,
     searchKeywords: ["kuet", "fee payment", "application", "reminder"],
     applicationEnd: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days - WARNING
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
   {
     title: "RUET Engineering Admission Test Postponed",
     slug: "ruet-admission-test-postponed",
     summary: "The RUET admission test scheduled for this month has been postponed to next month.",
     body: "<p>New date and details will be announced shortly. Stay tuned to the official website.</p>",
     category: "admission",
     universityName: "Rajshahi University of Engineering & Technology",
     universityType: "engineering",
     session: "2024",
     status: "published",
     isUrgent: true,
     isFeatured: true,
     searchKeywords: ["ruet", "postponed", "test date", "admission"],
     applicationEnd: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days - normal
     publishedAt: new Date(),
     createdAt: new Date(),
     updatedAt: new Date(),
   },
];

const mockBlogs = [
  {
    title: "10 Proven Tips to Crack Dhaka University Admission Test",
    excerpt: "Preparing for the Dhaka University (DU) admission test can be overwhelming. Follow these 10 proven strategies to maximize your score and secure a seat in your dream unit.",
    content: "<h2>1. Understand the Question Pattern</h2><p>Before you start studying, collect the question banks of the last 10 years. Analyzing them will give you a clear idea of what topics are frequently tested.</p><h2>2. Focus on Core Textbooks</h2><p>Many students make the mistake of reading too many guidebooks. Your primary focus should be the NCTB syllabus textbooks. Ensure you understand the underlying concepts clearly.</p>",
    category: "tips",
    tags: ["Dhaka University", "Admission Preparation", "Study Hacks", "MCQ Tips"],
    searchKeywords: ["du admission tips", "how to prepare for dhaka university"],
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1542,
    slug: "10-proven-tips-to-crack-dhaka-university-admission-test",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "Medical Admission Guide 2026: Everything You Need to Know",
    excerpt: "Dreaming of becoming a doctor? The MBBS admission test is highly competitive. Here is a complete guide on eligibility, syllabus, and preparation strategies for Medical Admission.",
    content: "<h2>Eligibility Criteria</h2><p>To apply for the MBBS admission test, candidates must have a minimum combined GPA of 9.00 in SSC and HSC, with Biology being a mandatory subject.</p><h2>Subject-wise Preparation</h2><p>Focus on Biology, Chemistry, Physics, and English & General Knowledge.</p>",
    category: "guide",
    tags: ["Medical Admission", "MBBS", "Biology", "Preparation Guide"],
    searchKeywords: ["medical admission 2026", "mbbs preparation"],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee4?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 2310,
    slug: "medical-admission-guide-2026-everything-you-need-to-know",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "Engineering Universities: BUET vs CUET, KUET, RUET",
    excerpt: "Choosing the right engineering university is crucial for your career. This article compares BUET with the CKRUET cluster to help you make an informed decision.",
    content: "<h2>The Prestige of BUET</h2><p>Bangladesh University of Engineering and Technology (BUET) is the most prestigious engineering institution in the country.</p><h2>The CKRUET Cluster</h2><p>Chittagong (CUET), Khulna (KUET), and Rajshahi (RUET) form the engineering cluster.</p>",
    category: "subject-guide",
    tags: ["BUET", "Engineering", "CUET", "KUET", "RUET"],
    searchKeywords: ["buet vs cuet", "engineering admission"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 980,
    slug: "engineering-universities-buet-vs-cuet-kuet-ruet",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "How to Write a Strong Admission Essay",
    excerpt: "Your admission essay is your chance to stand out. Learn how to write a compelling essay that captures the attention of admission committees.",
    content: "<h2>Start with a Hook</h2><p>The opening sentence should be captivating and unique.</p><h2>Show, Don't Tell</h2><p>Rather than saying 'I am hardworking,' describe an instance where your hard work paid off.</p>",
    category: "tips",
    tags: ["Essay Writing", "Admission Strategy", "Writing Tips"],
    searchKeywords: ["admission essay tips", "how to write essay"],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1200,
    slug: "how-to-write-a-strong-admission-essay",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "Understanding the GPA System in Bangladesh Universities",
    excerpt: "GPA is a crucial metric in university admissions. This guide explains how the GPA system works in Bangladesh and how it impacts your admission prospects.",
    content: "<h2>What is GPA?</h2><p>Grade Point Average (GPA) is a numerical representation of your academic performance on a scale from 0 to 4.0.</p>",
    category: "guide",
    tags: ["GPA", "Academic Performance", "Admission Criteria"],
    searchKeywords: ["gpa system", "gpa calculation"],
    imageUrl: "https://images.unsplash.com/photo-1434582881033-add914d3cb1b?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 850,
    slug: "understanding-the-gpa-system-in-bangladesh-universities",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "Physics Preparation Strategy for University Admission",
    excerpt: "Physics often intimidates students preparing for admission tests. Here's a strategic approach to mastering physics and scoring high marks.",
    content: "<h2>1. Build Strong Fundamentals</h2><p>Before diving into complex problems, ensure your basic concepts are crystal clear.</p>",
    category: "tips",
    tags: ["Physics", "Science", "Study Strategy"],
    searchKeywords: ["physics preparation", "physics tips"],
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07f04a?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1100,
    slug: "physics-preparation-strategy-for-university-admission",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "Chemistry Mastery Guide for Competitive Exams",
    excerpt: "Chemistry is all about understanding reactions and patterns. Master the subject with this comprehensive guide to crack any admission test.",
    content: "<h2>Organic vs Inorganic Chemistry</h2><p>Organic chemistry requires memorization of reactions and mechanisms.</p>",
    category: "tips",
    tags: ["Chemistry", "Science", "Reaction Guide"],
    searchKeywords: ["chemistry preparation", "organic chemistry"],
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db8b90a2e7d?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1350,
    slug: "chemistry-mastery-guide-for-competitive-exams",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
  {
    title: "English Language Mastery for Admission Tests",
    excerpt: "English is critical in most admission tests. Improve your English skills with vocabulary, grammar, and comprehension strategies that actually work.",
    content: "<h2>Build Your Vocabulary</h2><p>Learn 5-10 new words daily with their meanings, pronunciation, and usage.</p>",
    category: "tips",
    tags: ["English", "Vocabulary", "Grammar"],
    searchKeywords: ["english preparation", "vocabulary tips"],
    imageUrl: "https://images.unsplash.com/photo-1451127580459-f4c1ad4ae379?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1720,
    slug: "english-language-mastery-for-admission-tests",
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  },
   {
     title: "Stress Management During Exam Preparation",
     excerpt: "Exam season stress can be overwhelming. Learn practical stress management techniques to stay calm, focused, and mentally healthy during your preparation.",
     content: "<h2>Maintain a Regular Sleep Schedule</h2><p>Your brain needs rest to function optimally. Aim for 7-8 hours of sleep daily.</p>",
     category: "tips",
     tags: ["Stress Management", "Mental Health", "Well-being"],
     searchKeywords: ["exam stress", "stress management"],
     imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 2100,
     slug: "stress-management-during-exam-preparation",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
   {
     title: "5 Science Topics You Must Master for Medical Admission",
     excerpt: "Medical admission tests heavily focus on certain science topics. Here are the 5 most important topics that guarantee you high marks.",
     content: "<h2>1. Cell Division and Genetics</h2><p>This is a critical topic in biology. Understanding mitosis, meiosis, and genetic inheritance is essential.</p><h2>2. Photosynthesis and Respiration</h2><p>These fundamental life processes appear in almost every medical admission test.</p>",
     category: "study-tips",
     tags: ["Medical", "Science Topics", "Biology Focus"],
     searchKeywords: ["medical study tips", "science topics"],
     imageUrl: "https://images.unsplash.com/photo-1576091160399-0ff8434e850f?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 950,
     slug: "5-science-topics-you-must-master-for-medical-admission",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
   {
     title: "Last Minute Exam Preparation: 48-Hour Strategy",
     excerpt: "Exam is in 2 days? Here's a proven 48-hour strategy to maximize your score even with limited time. Focus on high-yield topics.",
     content: "<h2>Hour 1-8: Organize Your Study Materials</h2><p>Identify the most important topics based on the exam pattern.</p><h2>Hour 9-24: Intensive Topic Review</h2><p>Focus on topics that appear frequently in past papers.</p>",
     category: "exam-prep",
     tags: ["Last Minute", "Time Management", "Quick Preparation"],
     searchKeywords: ["last minute exam prep", "quick study"],
     imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 3200,
     slug: "last-minute-exam-preparation-48-hour-strategy",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
   {
     title: "DU vs Private Universities: A Honest Comparison",
     excerpt: "Thinking about which university to apply to? Here's an honest comparison between Dhaka University and top private universities based on education quality.",
     content: "<h2>Academic Excellence at DU</h2><p>Dhaka University offers world-class education with rigorous curriculum and highly qualified faculty.</p><h2>Private University Advantages</h2><p>Private universities offer flexibility, modern facilities, and industry-oriented curriculum.</p>",
     category: "university-review",
     tags: ["University Comparison", "DU", "Private University"],
     searchKeywords: ["du vs private university", "university comparison"],
     imageUrl: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 1850,
     slug: "du-vs-private-universities-a-honest-comparison",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
   {
     title: "Career Paths After Engineering: Top 5 Options",
     excerpt: "You've got your engineering degree. Now what? Explore the top 5 career paths that engineering graduates can pursue with great prospects.",
     content: "<h2>1. Software Development</h2><p>One of the most lucrative and in-demand career paths for engineers in Bangladesh and globally.</p><h2>2. Civil Engineering Projects</h2><p>Infrastructure development is booming in Bangladesh, creating numerous opportunities.</p>",
     category: "career-guidance",
     tags: ["Engineering", "Career", "Job Opportunities"],
     searchKeywords: ["engineering career", "career guidance"],
     imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 1650,
     slug: "career-paths-after-engineering-top-5-options",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
   {
     title: "Why Choose Computer Science? Honest Review of CSE Degree",
     excerpt: "Computer Science is the most sought program. But is it the right choice for you? Read this honest review covering curriculum, job prospects, and challenges.",
     content: "<h2>What You'll Learn</h2><p>Programming, data structures, algorithms, databases, web development, AI/ML, and more.</p><h2>Job Market Reality</h2><p>CSE graduates have excellent job prospects both in Bangladesh and internationally.</p>",
     category: "course-review",
     tags: ["Computer Science", "CSE", "Course Review"],
     searchKeywords: ["cse course review", "computer science"],
     imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
     status: "published",
     viewCount: 2400,
     slug: "why-choose-computer-science-honest-review-of-cse-degree",
     createdAt: new Date(),
     updatedAt: new Date(),
     publishedAt: new Date(),
   },
 ];

async function seed() {
  console.log('🌱 Starting seed...');
  try {
    // Seed Notices
    console.log(`📰 Seeding ${mockNotices.length} notices...`);
    let noticeCount = 0;
    for (const notice of mockNotices) {
      const ref = db.collection('notices').doc();
      await ref.set(notice);
      noticeCount++;
      console.log(`  ✓ ${notice.title}`);
    }
    console.log(`✅ Seeded ${noticeCount} notices\n`);

    // Seed Blog Posts
    console.log(`📝 Seeding ${mockBlogs.length} blog posts...`);
    let blogCount = 0;
    for (const blog of mockBlogs) {
      const ref = db.collection('blogPosts').doc();
      await ref.set(blog);
      blogCount++;
      console.log(`  ✓ ${blog.title}`);
    }
    console.log(`✅ Seeded ${blogCount} blog posts\n`);

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding:', error);
    process.exit(1);
  }
}

seed();

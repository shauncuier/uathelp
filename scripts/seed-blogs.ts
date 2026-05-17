import * as dotenv from "dotenv";
import path from "path";
import { generateSlug } from "../src/lib/server/slug";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const mockBlogs = [
  {
    title: "10 Proven Tips to Crack Dhaka University Admission Test",
    excerpt: "Preparing for the Dhaka University (DU) admission test can be overwhelming. Follow these 10 proven strategies to maximize your score and secure a seat in your dream unit.",
    content: `
      <h2>1. Understand the Question Pattern</h2>
      <p>Before you start studying, collect the question banks of the last 10 years. Analyzing them will give you a clear idea of what topics are frequently tested.</p>
      
      <h2>2. Focus on Core Textbooks</h2>
      <p>Many students make the mistake of reading too many guidebooks. Your primary focus should be the NCTB syllabus textbooks. Ensure you understand the underlying concepts clearly.</p>

      <h2>3. Time Management is Key</h2>
      <p>In the admission test, you have very little time per question. Practice taking mock tests at home using a stopwatch. Aim to solve each MCQ in under 45 seconds.</p>

      <h2>4. Memorize English Vocabulary Daily</h2>
      <p>English is often the deciding factor in DU admission. Dedicate 30 minutes every day to learning new vocabulary, idioms, and appropriate prepositions.</p>

      <h2>5. Don't Ignore the Written Part</h2>
      <p>Since the introduction of the written segment, many students fail because they only focus on MCQs. Practice writing short essays and translations daily.</p>
    `,
    category: "tips",
    tags: ["Dhaka University", "Admission Preparation", "Study Hacks", "MCQ Tips"],
    searchKeywords: ["du admission tips", "how to prepare for dhaka university", "dhaka university question pattern"],
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1542,
  },
  {
    title: "Medical Admission Guide 2026: Everything You Need to Know",
    excerpt: "Dreaming of becoming a doctor? The MBBS admission test is highly competitive. Here is a complete guide on eligibility, syllabus, and preparation strategies for Medical Admission.",
    content: `
      <h2>Eligibility Criteria</h2>
      <p>To apply for the MBBS admission test, candidates must have a minimum combined GPA of 9.00 in SSC and HSC, with Biology being a mandatory subject. For tribal candidates, the required GPA is slightly lower.</p>
      
      <h2>Subject-wise Preparation</h2>
      <p><strong>Biology (30 marks):</strong> This is the most crucial subject. Read the textbooks by Abul Hasan and Gazi Azmal thoroughly. Memorize scientific names and characteristics.</p>
      <p><strong>Chemistry (25 marks):</strong> Focus on organic chemistry, chemical bonds, and important chemical reactions. Textbooks by Hazari & Nag are highly recommended.</p>
      <p><strong>Physics (20 marks):</strong> You don't need to solve complex mathematical problems. Focus on formulas, units, dimensions, and theoretical concepts from Ishaq's book.</p>
      <p><strong>English & General Knowledge (25 marks):</strong> Read standard GK books covering Bangladesh history and liberation war. For English, practice previous years' Bcs and Medical questions.</p>

      <h2>Negative Marking</h2>
      <p>Remember that 0.25 marks will be deducted for every wrong answer. Do not guess blindly. If you are not 50% sure about an answer, it is better to skip it.</p>
    `,
    category: "guide",
    tags: ["Medical Admission", "MBBS", "Biology", "Preparation Guide"],
    searchKeywords: ["medical admission 2026", "mbbs preparation", "how to study for medical admission"],
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173ff9e5ee4?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 2310,
  },
  {
    title: "Engineering Universities: BUET vs CUET, KUET, RUET",
    excerpt: "Choosing the right engineering university is crucial for your career. This article compares BUET with the CKRUET cluster to help you make an informed decision.",
    content: `
      <h2>The Prestige of BUET</h2>
      <p>Bangladesh University of Engineering and Technology (BUET) is the most prestigious engineering institution in the country. It offers unparalleled alumni networks, top-tier faculty, and excellent research opportunities. However, securing a seat here is extremely competitive.</p>
      
      <h2>The CKRUET Cluster</h2>
      <p>Chittagong (CUET), Khulna (KUET), and Rajshahi (RUET) form the engineering cluster. The admission test is centralized, meaning you only need to sit for one exam to compete for seats in all three universities.</p>

      <h2>Campus Life and Facilities</h2>
      <p>While BUET is located in the heart of Dhaka, CKRUET campuses are spread across different divisions, offering large, scenic campuses and a vibrant residential life away from the capital's traffic.</p>

      <h2>Which One Should You Choose?</h2>
      <p>If you get into BUET, it is usually the default choice. However, if you are choosing between a lower-tier subject in BUET and a top-tier subject (like CSE or EEE) in CUET/KUET/RUET, many experts advise prioritizing the subject over the university name.</p>
    `,
    category: "subject-guide",
    tags: ["BUET", "Engineering", "CUET", "KUET", "RUET", "University Comparison"],
    searchKeywords: ["buet vs cuet", "engineering admission", "ckruet admission test"],
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 980,
  }
];

async function seedBlogs() {
  console.log("Seeding real blog posts...");
  try {
    const { adminDb, adminAuth } = await import("../src/lib/firebase/admin");
    
    // Get an admin user ID to use as author
    const usersSnap = await adminDb.collection("users").where("role", "==", "admin").limit(1).get();
    let authorId = "system";
    if (!usersSnap.empty) {
      authorId = usersSnap.docs[0].id;
    }

    const batch = adminDb.batch();
    
    for (const blog of mockBlogs) {
      const docRef = adminDb.collection("blogPosts").doc();
      const slug = generateSlug(blog.title) + "-" + Math.floor(Math.random() * 1000);
      
      batch.set(docRef, {
        ...blog,
        slug,
        seoTitle: blog.title,
        seoDescription: blog.excerpt,
        authorId,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date()
      });
    }

    await batch.commit();
    console.log(`Successfully seeded ${mockBlogs.length} real blog posts!`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
}

seedBlogs();

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
  },
  {
    title: "How to Write a Strong Admission Essay",
    excerpt: "Your admission essay is your chance to stand out. Learn how to write a compelling essay that captures the attention of admission committees.",
    content: `
      <h2>Start with a Hook</h2>
      <p>The opening sentence should be captivating and unique. Avoid generic statements like 'I want to become a doctor since childhood.' Instead, tell a specific story that led to your passion.</p>
      
      <h2>Show, Don't Tell</h2>
      <p>Rather than saying 'I am hardworking,' describe an instance where your hard work paid off. Use anecdotes and examples to demonstrate your qualities.</p>

      <h2>Be Authentic</h2>
      <p>Admission committees read thousands of essays. They can spot insincerity from a mile away. Write about your genuine experiences and aspirations, not what you think they want to hear.</p>

      <h2>Proofread Multiple Times</h2>
      <p>Grammatical errors and typos can negatively impact your application. Get your essay reviewed by teachers, parents, or friends before submission.</p>

      <h2>Keep it Concise</h2>
      <p>Most essays have word limits. Use every word wisely. Remove redundancy and keep your narrative flowing.</p>
    `,
    category: "tips",
    tags: ["Essay Writing", "Admission Strategy", "Writing Tips", "Application"],
    searchKeywords: ["admission essay tips", "how to write essay", "college essay writing"],
    imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1200,
  },
  {
    title: "Understanding the GPA System in Bangladesh Universities",
    excerpt: "GPA is a crucial metric in university admissions. This guide explains how the GPA system works in Bangladesh and how it impacts your admission prospects.",
    content: `
      <h2>What is GPA?</h2>
      <p>Grade Point Average (GPA) is a numerical representation of your academic performance on a scale from 0 to 4.0, where 4.0 represents perfect grades.</p>
      
      <h2>Minimum GPA Requirements</h2>
      <p>Different universities have different GPA requirements. For top public universities, you typically need a combined GPA of 7-9. Medical universities require even higher GPA (9.0+).</p>

      <h2>How GPA is Calculated</h2>
      <p>Your final GPA depends on your grades in individual subjects. Some subjects carry more weight than others. For example, in science stream, math and science subjects often have higher weightage.</p>

      <h2>Improving Your GPA</h2>
      <p>If your current GPA is below target, focus on excelling in remaining exams. Consistent performance across all subjects is better than excellence in just a few.</p>

      <h2>GPA and Admission Decisions</h2>
      <p>While GPA is important, it's not the only factor. Admission tests results, merit, and other extracurricular activities also play a role in final selection.</p>
    `,
    category: "guide",
    tags: ["GPA", "Academic Performance", "Admission Criteria", "Study Guide"],
    searchKeywords: ["gpa system", "gpa calculation", "bangladesh universities", "gpa requirements"],
    imageUrl: "https://images.unsplash.com/photo-1434582881033-add914d3cb1b?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 850,
  },
  {
    title: "Agricultural Admission 101: BAU, BSMRAU, and SAU",
    excerpt: "Interested in agriculture? Compare the top agricultural universities in Bangladesh and understand the admission process for each.",
    content: `
      <h2>Bangladesh Agricultural University (BAU)</h2>
      <p>Located in Mymensingh, BAU is the largest agricultural university in Bangladesh. It offers a wide range of programs in agriculture, veterinary science, and allied fields. The campus is well-developed with excellent facilities.</p>
      
      <h2>BSMR Agricultural University</h2>
      <p>Located in Gazipur, BSMRAU is known for its research-oriented approach and strong alumni network. The university focuses on practical knowledge and skill development.</p>

      <h2>Sher-e-Bangla Agricultural University</h2>
      <p>SAU, located in Dhaka, is famous for its urban agriculture programs and innovative research. It's ideal if you prefer an agricultural university within the capital.</p>

      <h2>Admission Process</h2>
      <p>Admission to agricultural universities is competitive. You need a strong GPA and must clear the entrance examination. Science stream with biology as a subject is mandatory.</p>

      <h2>Career Opportunities</h2>
      <p>Agricultural graduates have excellent career prospects in government services, NGOs, private sector, and agricultural research organizations.</p>
    `,
    category: "subject-guide",
    tags: ["Agriculture", "BAU", "BSMRAU", "SAU", "Career Guide"],
    searchKeywords: ["agricultural university", "bau admission", "agriculture career", "bangladeshi universities"],
    imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 650,
  },
  {
    title: "National University Admission: A Complete Roadmap",
    excerpt: "National University offers affordable quality education with flexible schedules. Learn everything about NU admission process and programs.",
    content: `
      <h2>What is National University?</h2>
      <p>National University is Bangladesh's largest affiliating university with hundreds of colleges across the country. It provides quality education at an affordable cost.</p>
      
      <h2>Eligibility Criteria</h2>
      <p>You must have completed your HSC or equivalent examination. There's no minimum GPA requirement, making NU accessible to a wider range of students.</p>

      <h2>Programs Offered</h2>
      <p>NU offers programs in various disciplines including engineering, business, humanities, science, and social sciences. Most programs are offered at colleges affiliated with NU across Bangladesh.</p>

      <h2>Admission Process</h2>
      <p>Admission to NU is merit-based. You need to apply to your nearest affiliated college and appear for the entrance examination conducted by that college.</p>

      <h2>Advantages of NU</h2>
      <p>NU offers flexible class schedules (morning, evening, weekend), affordable tuition, and recognized qualifications that are respected in job markets.</p>

      <h2>Future Prospects</h2>
      <p>Many NU graduates pursue professional courses like BCS, MBA, and law. A NU degree is a stepping stone to higher education and successful careers.</p>
    `,
    category: "guide",
    tags: ["National University", "NU Admission", "Higher Education", "Career Path"],
    searchKeywords: ["national university admission", "nu programs", "national university bangladesh"],
    imageUrl: "https://images.unsplash.com/photo-1427504494785-cdcb0f3e4dbe?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 920,
  },
  {
    title: "Physics Preparation Strategy for University Admission",
    excerpt: "Physics often intimidates students preparing for admission tests. Here's a strategic approach to mastering physics and scoring high marks.",
    content: `
      <h2>1. Build Strong Fundamentals</h2>
      <p>Before diving into complex problems, ensure your basic concepts are crystal clear. Revisit formulas and their derivations from your HSC textbook.</p>
      
      <h2>2. Focus on Frequently Asked Topics</h2>
      <p>Analyze past 10 years question papers to identify recurring topics. Mechanics, electricity, thermodynamics, and modern physics are usually the focus areas.</p>

      <h2>3. Practice Numerical Problems</h2>
      <p>Physics is not just theory. Solve as many numerical problems as possible. This develops problem-solving skills and saves time during the actual exam.</p>

      <h2>4. Memorize Key Formulas</h2>
      <p>Create a formula sheet and memorize critical equations. But understanding what each formula means is more important than mere memorization.</p>

      <h2>5. Take Mock Tests</h2>
      <p>Time yourself while solving mock tests. This helps you manage time better and identify weak areas that need more attention.</p>

      <h2>6. Avoid Overthinking</h2>
      <p>Sometimes simple problems are deliberately made to look complex. Don't overcomplicate solutions. Go for the straightforward approach first.</p>
    `,
    category: "tips",
    tags: ["Physics", "Science", "Study Strategy", "Exam Preparation"],
    searchKeywords: ["physics preparation", "physics tips", "admission test physics", "science admission"],
    imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07f04a?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1100,
  },
  {
    title: "Chemistry Mastery Guide for Competitive Exams",
    excerpt: "Chemistry is all about understanding reactions and patterns. Master the subject with this comprehensive guide to crack any admission test.",
    content: `
      <h2>Organic vs Inorganic Chemistry</h2>
      <p>Organic chemistry requires memorization of reactions and mechanisms. Inorganic chemistry is more conceptual. Balance your study time between both to score well.</p>
      
      <h2>Make Reaction Flowcharts</h2>
      <p>Create visual flowcharts showing how different compounds react with each other. This visual approach helps retain information longer.</p>

      <h2>Understand Bonding Theories</h2>
      <p>Bonding theories form the foundation of chemistry. Whether it's ionic, covalent, or coordinate bonding, understanding the 'why' is crucial.</p>

      <h2>Practice Equation Balancing</h2>
      <p>Chemical equations are everywhere. Practice balancing them regularly to develop speed and accuracy.</p>

      <h2>Use Mnemonics</h2>
      <p>Chemistry involves many periodic elements and reactions. Use mnemonics to remember complex information easily.</p>

      <h2>Lab Experience Matters</h2>
      <p>If possible, perform simple experiments at home to understand concepts practically. Hands-on learning is more effective than theoretical study.</p>
    `,
    category: "tips",
    tags: ["Chemistry", "Science", "Reaction Guide", "Exam Preparation"],
    searchKeywords: ["chemistry preparation", "organic chemistry", "chemistry tips", "admission test chemistry"],
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db8b90a2e7d?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1350,
  },
  {
    title: "English Language Mastery for Admission Tests",
    excerpt: "English is critical in most admission tests. Improve your English skills with vocabulary, grammar, and comprehension strategies that actually work.",
    content: `
      <h2>Build Your Vocabulary</h2>
      <p>Learn 5-10 new words daily with their meanings, pronunciation, and usage. Create flashcards for better retention. Understanding word roots helps remember similar words.</p>
      
      <h2>Master Grammar Basics</h2>
      <p>Focus on subject-verb agreement, tense consistency, and preposition usage. These are the most commonly tested grammar topics.</p>

      <h2>Improve Reading Comprehension</h2>
      <p>Read extensively from diverse sources: news articles, blogs, and academic journals. This expands your vocabulary and improves understanding speed.</p>

      <h2>Practice Writing</h2>
      <p>Write essays, summaries, and short paragraphs daily. Get them reviewed by someone proficient in English to identify errors.</p>

      <h2>Develop Listening Skills</h2>
      <p>If your test includes listening sections, watch English movies, podcasts, and lectures. This improves your ability to understand native speakers.</p>

      <h2>Take Timed Practice Tests</h2>
      <p>English tests are often time-bound. Practice solving questions within strict time limits to build speed and accuracy.</p>
    `,
    category: "tips",
    tags: ["English", "Vocabulary", "Grammar", "Language Skills"],
    searchKeywords: ["english preparation", "vocabulary tips", "grammar practice", "english admission test"],
    imageUrl: "https://images.unsplash.com/photo-1451127580459-f4c1ad4ae379?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 1720,
  },
  {
    title: "Stress Management During Exam Preparation",
    excerpt: "Exam season stress can be overwhelming. Learn practical stress management techniques to stay calm, focused, and mentally healthy during your preparation.",
    content: `
      <h2>Maintain a Regular Sleep Schedule</h2>
      <p>Your brain needs rest to function optimally. Aim for 7-8 hours of sleep daily. Avoid last-minute cramming the night before the exam.</p>
      
      <h2>Exercise Regularly</h2>
      <p>Physical activity releases endorphins, which improve mood and reduce stress. A 30-minute walk or light workout daily can work wonders.</p>

      <h2>Practice Meditation and Deep Breathing</h2>
      <p>Spend 10-15 minutes daily on meditation. When stressed, practice deep breathing exercises to calm your nervous system.</p>

      <h2>Take Regular Breaks</h2>
      <p>Don't study continuously for 5-6 hours. Take short 10-15 minute breaks every hour. Use breaks to relax, not to check social media.</p>

      <h2>Eat Healthy</h2>
      <p>Junk food affects your mood and energy levels. Eat nutritious meals with fruits, vegetables, and protein to keep your mind sharp.</p>

      <h2>Talk to Someone</h2>
      <p>Share your worries with friends, family, or a counselor. Talking about stress helps alleviate it. You're not alone in this journey.</p>

      <h2>Positive Self-Talk</h2>
      <p>Replace negative thoughts with positive affirmations. Tell yourself that you are prepared and capable of doing well.</p>
    `,
    category: "tips",
    tags: ["Stress Management", "Mental Health", "Well-being", "Study Tips"],
    searchKeywords: ["exam stress", "stress management", "mental health", "study stress relief"],
    imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070&auto=format&fit=crop",
    status: "published",
    viewCount: 2100,
  },
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

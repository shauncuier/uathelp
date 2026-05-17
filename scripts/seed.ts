import * as dotenv from "dotenv";
import path from "path";
import slugify from "slugify";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const makeSlug = (str: string) => slugify(str, { lower: true, strict: true });

const mockUniversities = [
  // General Public Universities
  { nameEn: "University of Dhaka", nameBn: "ঢাকা বিশ্ববিদ্যালয়", shortName: "DU", slug: "university-of-dhaka", type: "public", division: "Dhaka", district: "Dhaka", officialWebsite: "https://du.ac.bd", admissionWebsite: "https://admission.eis.du.ac.bd", isFeatured: true, description: "The oldest and largest public university in Bangladesh." },
  { nameEn: "Rajshahi University", nameBn: "রাজশাহী বিশ্ববিদ্যালয়", shortName: "RU", slug: "rajshahi-university", type: "public", division: "Rajshahi", district: "Rajshahi", officialWebsite: "http://www.ru.ac.bd", admissionWebsite: "https://admission.ru.ac.bd", isFeatured: true, description: "Second oldest public university in Bangladesh." },
  { nameEn: "University of Chittagong", nameBn: "চট্টগ্রাম বিশ্ববিদ্যালয়", shortName: "CU", slug: "university-of-chittagong", type: "public", division: "Chittagong", district: "Chittagong", officialWebsite: "https://cu.ac.bd", admissionWebsite: "https://admission.cu.ac.bd", isFeatured: true, description: "One of the largest public universities in Bangladesh by campus area." },
  { nameEn: "Jahangirnagar University", nameBn: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়", shortName: "JU", slug: "jahangirnagar-university", type: "public", division: "Dhaka", district: "Savar", officialWebsite: "https://juniv.edu", admissionWebsite: "https://juniv-admission.org", isFeatured: true, description: "The only fully residential public university in Bangladesh." },
  { nameEn: "Islamic University", nameBn: "ইসলামী বিশ্ববিদ্যালয়", shortName: "IU", slug: "islamic-university", type: "public", division: "Khulna", district: "Kushtia", officialWebsite: "https://iu.ac.bd", isFeatured: false },
  { nameEn: "Khulna University", nameBn: "খুলনা বিশ্ববিদ্যালয়", shortName: "KU", slug: "khulna-university", type: "public", division: "Khulna", district: "Khulna", officialWebsite: "https://ku.ac.bd", isFeatured: true },
  { nameEn: "Jagannath University", nameBn: "জগন্নাথ বিশ্ববিদ্যালয়", shortName: "JnU", slug: "jagannath-university", type: "public", division: "Dhaka", district: "Dhaka", officialWebsite: "https://jnu.ac.bd", isFeatured: true },
  { nameEn: "Comilla University", nameBn: "কুমিল্লা বিশ্ববিদ্যালয়", shortName: "CoU", slug: "comilla-university", type: "public", division: "Chittagong", district: "Comilla", officialWebsite: "https://cou.ac.bd", isFeatured: false },
  { nameEn: "Jatiya Kabi Kazi Nazrul Islam University", nameBn: "জাতীয় কবি কাজী নজরুল ইসলাম বিশ্ববিদ্যালয়", shortName: "JKKNIU", slug: "jatiya-kabi-kazi-nazrul-islam-university", type: "public", division: "Mymensingh", district: "Mymensingh", officialWebsite: "https://jkkniu.edu.bd", isFeatured: false },
  { nameEn: "Begum Rokeya University", nameBn: "বেগম রোকেয়া বিশ্ববিদ্যালয়", shortName: "BRUR", slug: "begum-rokeya-university", type: "public", division: "Rangpur", district: "Rangpur", officialWebsite: "https://brur.ac.bd", isFeatured: false },
  { nameEn: "Barishal University", nameBn: "বরিশাল বিশ্ববিদ্যালয়", shortName: "BU", slug: "barishal-university", type: "public", division: "Barishal", district: "Barishal", officialWebsite: "https://bu.ac.bd", isFeatured: false },
  { nameEn: "Bangladesh University of Professionals", nameBn: "বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস", shortName: "BUP", slug: "bangladesh-university-of-professionals", type: "public", division: "Dhaka", district: "Dhaka", officialWebsite: "https://bup.edu.bd", isFeatured: true },
  
  // Engineering & Technology Universities (BUET + RUET/KUET/CUET + others)
  { nameEn: "Bangladesh University of Engineering and Technology", nameBn: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়", shortName: "BUET", slug: "bangladesh-university-of-engineering-and-technology", type: "engineering", division: "Dhaka", district: "Dhaka", officialWebsite: "https://buet.ac.bd", isFeatured: true },
  { nameEn: "Rajshahi University of Engineering & Technology", nameBn: "রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "RUET", slug: "rajshahi-university-of-engineering-and-technology", type: "engineering", division: "Rajshahi", district: "Rajshahi", officialWebsite: "https://ruet.ac.bd", isFeatured: true },
  { nameEn: "Khulna University of Engineering & Technology", nameBn: "খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "KUET", slug: "khulna-university-of-engineering-and-technology", type: "engineering", division: "Khulna", district: "Khulna", officialWebsite: "https://kuet.ac.bd", isFeatured: true },
  { nameEn: "Chittagong University of Engineering & Technology", nameBn: "চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "CUET", slug: "chittagong-university-of-engineering-and-technology", type: "engineering", division: "Chittagong", district: "Chittagong", officialWebsite: "https://cuet.ac.bd", isFeatured: true },
  { nameEn: "Shahjalal University of Science and Technology", nameBn: "শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "SUST", slug: "shahjalal-university-of-science-and-technology", type: "engineering", division: "Sylhet", district: "Sylhet", officialWebsite: "https://sust.edu", isFeatured: true },
  { nameEn: "Hajee Mohammad Danesh Science and Technology University", nameBn: "হাজী মোহাম্মদ দানেশ বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "HSTU", slug: "hajee-mohammad-danesh-science-and-technology-university", type: "engineering", division: "Rangpur", district: "Dinajpur", officialWebsite: "https://hstu.ac.bd", isFeatured: false },
  { nameEn: "Mawlana Bhashani Science and Technology University", nameBn: "মাওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "MBSTU", slug: "mawlana-bhashani-science-and-technology-university", type: "engineering", division: "Dhaka", district: "Tangail", officialWebsite: "https://mbstu.ac.bd", isFeatured: false },
  { nameEn: "Noakhali Science and Technology University", nameBn: "নোয়াখালী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "NSTU", slug: "noakhali-science-and-technology-university", type: "engineering", division: "Chittagong", district: "Noakhali", officialWebsite: "https://nstu.edu.bd", isFeatured: false },
  { nameEn: "Pabna University of Science and Technology", nameBn: "পাবনা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "PUST", slug: "pabna-university-of-science-and-technology", type: "engineering", division: "Rajshahi", district: "Pabna", officialWebsite: "https://pust.ac.bd", isFeatured: false },
  { nameEn: "Jessore University of Science and Technology", nameBn: "যশোর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "JUST", slug: "jessore-university-of-science-and-technology", type: "engineering", division: "Khulna", district: "Jessore", officialWebsite: "https://just.edu.bd", isFeatured: false },
  { nameEn: "Bangabandhu Sheikh Mujibur Rahman Science and Technology University", nameBn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "BSMRSTU", slug: "bangabandhu-sheikh-mujibur-rahman-science-and-technology-university", type: "engineering", division: "Dhaka", district: "Gopalganj", officialWebsite: "https://bsmrstu.edu.bd", isFeatured: false },

  // Agricultural Universities
  { nameEn: "Bangladesh Agricultural University", nameBn: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়", shortName: "BAU", slug: "bangladesh-agricultural-university", type: "agriculture", division: "Mymensingh", district: "Mymensingh", officialWebsite: "https://bau.edu.bd", isFeatured: true },
  { nameEn: "Bangabandhu Sheikh Mujibur Rahman Agricultural University", nameBn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান কৃষি বিশ্ববিদ্যালয়", shortName: "BSMRAU", slug: "bangabandhu-sheikh-mujibur-rahman-agricultural-university", type: "agriculture", division: "Dhaka", district: "Gazipur", officialWebsite: "https://bsmrau.edu.bd", isFeatured: true },
  { nameEn: "Sher-e-Bangla Agricultural University", nameBn: "শেরেবাংলা কৃষি বিশ্ববিদ্যালয়", shortName: "SAU", slug: "sher-e-bangla-agricultural-university", type: "agriculture", division: "Dhaka", district: "Dhaka", officialWebsite: "https://sau.edu.bd", isFeatured: true },
  { nameEn: "Sylhet Agricultural University", nameBn: "সিলেট কৃষি বিশ্ববিদ্যালয়", shortName: "SYLAU", slug: "sylhet-agricultural-university", type: "agriculture", division: "Sylhet", district: "Sylhet", officialWebsite: "https://sau.ac.bd", isFeatured: false },
  { nameEn: "Khulna Agricultural University", nameBn: "খুলনা কৃষি বিশ্ববিদ্যালয়", shortName: "KAU", slug: "khulna-agricultural-university", type: "agriculture", division: "Khulna", district: "Khulna", officialWebsite: "https://kau.edu.bd", isFeatured: false },
  
  // Medical Universities
  { nameEn: "Bangabandhu Sheikh Mujib Medical University", nameBn: "বঙ্গবন্ধু শেখ মুজিব মেডিকেল বিশ্ববিদ্যালয়", shortName: "BSMMU", slug: "bangabandhu-sheikh-mujib-medical-university", type: "medical", division: "Dhaka", district: "Dhaka", officialWebsite: "https://bsmmu.edu.bd", isFeatured: true },
  { nameEn: "Rajshahi Medical University", nameBn: "রাজশাহী মেডিকেল বিশ্ববিদ্যালয়", shortName: "RMU", slug: "rajshahi-medical-university", type: "medical", division: "Rajshahi", district: "Rajshahi", officialWebsite: "http://rmu.edu.bd", isFeatured: false },
  { nameEn: "Chittagong Medical University", nameBn: "চট্টগ্রাম মেডিকেল বিশ্ববিদ্যালয়", shortName: "CMU", slug: "chittagong-medical-university", type: "medical", division: "Chittagong", district: "Chittagong", officialWebsite: "http://cmu.edu.bd", isFeatured: false },
  { nameEn: "Sylhet Medical University", nameBn: "সিলেট মেডিকেল বিশ্ববিদ্যালয়", shortName: "SMU", slug: "sylhet-medical-university", type: "medical", division: "Sylhet", district: "Sylhet", officialWebsite: "http://smu.edu.bd", isFeatured: false },

  // Specialized / National
  { nameEn: "National University", nameBn: "জাতীয় বিশ্ববিদ্যালয়", shortName: "NU", slug: "national-university", type: "national", division: "Dhaka", district: "Gazipur", officialWebsite: "https://nu.ac.bd", isFeatured: true },
  { nameEn: "Bangladesh Open University", nameBn: "বাংলাদেশ উন্মুক্ত বিশ্ববিদ্যালয়", shortName: "BOU", slug: "bangladesh-open-university", type: "national", division: "Dhaka", district: "Gazipur", officialWebsite: "https://bou.ac.bd", isFeatured: false },
  
  // Major Private Universities
  { nameEn: "North South University", nameBn: "নর্থ সাউথ বিশ্ববিদ্যালয়", shortName: "NSU", slug: "north-south-university", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "http://www.northsouth.edu", isFeatured: true },
  { nameEn: "BRAC University", nameBn: "ব্র্যাক বিশ্ববিদ্যালয়", shortName: "BRACU", slug: "brac-university", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://www.bracu.ac.bd", isFeatured: true },
  { nameEn: "Independent University, Bangladesh", nameBn: "ইন্ডিপেন্ডেন্ট বিশ্ববিদ্যালয়, বাংলাদেশ", shortName: "IUB", slug: "independent-university-bangladesh", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "http://www.iub.edu.bd", isFeatured: false },
  { nameEn: "American International University-Bangladesh", nameBn: "আমেরিকান ইন্টারন্যাশনাল ইউনিভার্সিটি-বাংলাদেশ", shortName: "AIUB", slug: "american-international-university-bangladesh", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://www.aiub.edu", isFeatured: false },
  { nameEn: "East West University", nameBn: "ইস্ট ওয়েস্ট বিশ্ববিদ্যালয়", shortName: "EWU", slug: "east-west-university", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://www.ewubd.edu", isFeatured: false },
  { nameEn: "Daffodil International University", nameBn: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি", shortName: "DIU", slug: "daffodil-international-university", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://daffodilvarsity.edu.bd", isFeatured: false },
  { nameEn: "Ahsanullah University of Science and Technology", nameBn: "আহ্ছানউল্লা বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়", shortName: "AUST", slug: "ahsanullah-university-of-science-and-technology", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://aust.edu", isFeatured: false },
  { nameEn: "United International University", nameBn: "ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি", shortName: "UIU", slug: "united-international-university", type: "private", division: "Dhaka", district: "Dhaka", officialWebsite: "https://www.uiu.ac.bd", isFeatured: false },
];

const mockNotices = [
  {
    title: "DU Undergraduate Admission Circular 2024-2025",
    slug: "du-undergraduate-admission-circular-2024-2025",
    summary: "Online application for undergraduate program of Dhaka University for the academic year 2024-2025 will begin soon.",
    body: "<p>The online application process for the first-year undergraduate program of Dhaka University for the 2024-2025 academic session will commence on Monday.</p>",
    category: "admission",
    universityId: "TBD", // Will be replaced
    universityName: "University of Dhaka",
    universityType: "public",
    session: "2024-2025",
    status: "published",
    isUrgent: true,
    isFeatured: true,
    searchKeywords: ["du", "dhaka", "admission", "circular", "2024-2025"],
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

async function seed() {
  console.log("Seeding database...");
  try {
    const { adminDb } = await import("../src/lib/firebase/admin");
    // 1. Seed Universities
    const uniIds = new Map();
    for (const uni of mockUniversities) {
      const ref = adminDb.collection("universities").doc();
      await ref.set(uni);
      uniIds.set(uni.shortName, ref.id);
      console.log(`Seeded university: ${uni.nameEn}`);
    }

    // 2. Seed Notices
    for (const notice of mockNotices) {
      const ref = adminDb.collection("notices").doc();
      const n = { ...notice, universityId: uniIds.get("DU") || "unknown" };
      await ref.set(n);
      console.log(`Seeded notice: ${n.title}`);
    }

    // 3. Setup Settings
    await adminDb.collection("settings").doc("singleton").set({
      siteName: "UAT Help",
      seoTitle: "UAT Help - All University Admission Notices",
      seoDescription: "Find all Bangladeshi university admission notices in one place.",
      contactEmail: "contact@uathelp.com",
      allowRegistration: true,
      maintenanceMode: false,
      updatedAt: new Date(),
    });
    console.log("Seeded settings");

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();

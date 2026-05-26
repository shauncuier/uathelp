// src/app/(public)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";
import { ApproachingDeadlines } from "@/components/notices/ApproachingDeadlines";
import { adminDb } from "@/lib/firebase/admin";

export const metadata: Metadata = {
  title: "UAT Help — University Admission Notices & Resources",
  description:
    "Find admission circulars, results, admit cards, and preparation tips for Bangladeshi universities. All in one place.",
};
export const revalidate = 300; // Revalidate every 5 minutes

// Helper to convert Firestore objects to plain JS objects
function toPlainObject(obj: any): any {
  if (obj == null) return null;
  if (obj instanceof Date) return obj;
  if (obj?.toDate) return obj.toDate(); // Firestore Timestamp
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(toPlainObject);
    }
    return Object.keys(obj).reduce((acc: any, key) => {
      acc[key] = toPlainObject(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

async function getHomeData() {
  try {
    // Fetch directly from Firestore - use simple queries only
    // Fetch all data and filter in memory to avoid index requirements
    const [noticesSnap, blogsSnap] = await Promise.all([
      adminDb.collection("notices").get(),
      adminDb.collection("blogPosts").get(),
    ]);
    
    const allNotices = noticesSnap.docs
      .map(d => toPlainObject({ id: d.id, ...d.data() }))
      .filter((n: any) => n.status === "published")
      .sort((a: any, b: any) => {
        const timeA = a.publishedAt?.getTime?.() || new Date(a.publishedAt || 0).getTime();
        const timeB = b.publishedAt?.getTime?.() || new Date(b.publishedAt || 0).getTime();
        return timeB - timeA;
      });
      
    const allBlogs = blogsSnap.docs
      .map(d => toPlainObject({ id: d.id, ...d.data() }))
      .filter((b: any) => b.status === "published")
      .sort((a: any, b: any) => {
        const timeA = a.publishedAt?.getTime?.() || new Date(a.publishedAt || 0).getTime();
        const timeB = b.publishedAt?.getTime?.() || new Date(b.publishedAt || 0).getTime();
        return timeB - timeA;
      });
    
    // Filter in memory
    const urgentNotices = allNotices.filter((n: any) => n.isUrgent).slice(0, 3);
    const latestNotices = allNotices.slice(0, 6);
    const tips = allBlogs.filter((b: any) => b.category === "tips").slice(0, 3);

    return { urgentNotices, latestNotices, tips };
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { urgentNotices: [], latestNotices: [], tips: [] };
  }
}

const universityCategories = [
  { label: "Public", type: "public", icon: "🏛️", color: "bg-blue-50" },
  { label: "Private", type: "private", icon: "🏢", color: "bg-purple-50" },
  { label: "Medical", type: "medical", icon: "🏥", color: "bg-red-50" },
  { label: "Engineering", type: "engineering", icon: "⚙️", color: "bg-orange-50" },
  { label: "Agriculture", type: "agriculture", icon: "🌾", color: "bg-green-50" },
  { label: "National", type: "national", icon: "📚", color: "bg-teal-50" },
];

const popularUniversities = [
  { name: "University of Dhaka", slug: "university-of-dhaka" },
  { name: "BUET", slug: "bangladesh-university-of-engineering-and-technology" },
  { name: "Rajshahi University", slug: "rajshahi-university" },
  { name: "Jahangirnagar University", slug: "jahangirnagar-university" },
];

export default async function HomePage() {
  const { urgentNotices, latestNotices, tips } = await getHomeData();

  return (
    <div className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-12rem] top-[-12rem] h-[34rem] w-[34rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-24 h-[32rem] w-[32rem] rounded-full bg-secondary/14 blur-3xl" />
        <div className="absolute bottom-24 left-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl" />
      </div>
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="glass-badge inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground">
              <span>✨</span>
              <span>Bangladesh's #1 Admission Platform</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Find Your Perfect
                <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  University
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get admission notices, results, admit cards, and expert tips for all Bangladeshi universities in one place.
              </p>
            </div>

            {/* Search Bar */}
            <div className="pt-4">
              <HomeSearchBar />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Link href="/notices">
                <Button size="lg" className="rounded-lg">
                  <Bell className="h-5 w-5 mr-2" />
                  Browse Notices
                </Button>
              </Link>
              <Link href="/universities">
                <Button size="lg" variant="outline" className="rounded-lg">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Explore Universities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-4 border-b border-white/10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">200+</div>
              <div className="text-sm text-muted-foreground mt-1">Universities</div>
            </div>
            <div className="text-center border-l border-r border-white/10">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">1000+</div>
              <div className="text-sm text-muted-foreground mt-1">Notices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Notices */}
      {urgentNotices.length > 0 && (
        <section className="py-14 px-4 border-b border-white/10 bg-destructive/5">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-foreground">🔔 Urgent Notices</h2>
              </div>
              <Link href="/notices?urgent=true" className="text-sm font-semibold text-primary hover:text-secondary flex items-center gap-1 transition-colors">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {urgentNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Approaching Deadlines */}
      <ApproachingDeadlines notices={latestNotices} thresholdDays={7} limit={5} />

      {/* Latest Notices */}
      <section className="py-14 px-4 border-b border-white/10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">📋 Latest Notices</h2>
              <p className="text-sm text-muted-foreground mt-1">Recently published admissions</p>
            </div>
            <Link href="/notices" className="text-sm font-semibold text-primary hover:text-secondary flex items-center gap-1 transition-colors">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {latestNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-muted-foreground">No notices published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* University Categories */}
      <section className="py-14 px-4 border-b border-white/10 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">🏛️ Browse by Type</h2>
            <p className="text-muted-foreground">Find admission info by university category</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {universityCategories.map((cat) => (
              <Link key={cat.type} href={`/notices?universityType=${cat.type}`}>
                <div className="glass-card glass-card-hover rounded-xl p-5 text-center cursor-pointer border-white/10">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <span className="text-sm font-semibold text-foreground block">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Universities */}
      <section className="py-14 px-4 border-b border-white/10">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">🎓 Popular Universities</h2>
            <p className="text-muted-foreground">Quick access to top institutions</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularUniversities.map((uni) => (
              <Link key={uni.slug} href={`/universities/${uni.slug}`}>
                <div className="glass-card glass-card-hover rounded-xl p-4 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground flex items-center justify-center font-bold text-lg flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                      {uni.name.charAt(0)}
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{uni.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Tips */}
      {tips.length > 0 && (
        <section className="py-14 px-4 border-b border-white/10 bg-white/[0.02]">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">💡 Admission Tips</h2>
              <p className="text-muted-foreground">Expert guidance for your preparation</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tips.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss an Admission Update</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Join thousands of students staying updated with all admission news in one place.
          </p>
          <Link href="/notices">
            <Button size="lg" variant="glass" className="font-semibold rounded-lg shadow-lg text-foreground">
              Start Exploring
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

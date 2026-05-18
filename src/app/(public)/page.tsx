// src/app/(public)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { HomeSearchBar } from "@/components/home/HomeSearchBar";

export const metadata: Metadata = {
  title: "UAT Help — University Admission Notices & Resources",
  description:
    "Find admission circulars, results, admit cards, and preparation tips for Bangladeshi universities. All in one place.",
};

async function getHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [urgentRes, latestRes, tipsRes] = await Promise.all([
      fetch(`${baseUrl}/api/public/notices?urgent=true&limit=3`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/public/notices?limit=6`, { next: { revalidate: 300 } }),
      fetch(`${baseUrl}/api/public/posts?category=tips&limit=3`, { next: { revalidate: 300 } }),
    ]);
    const [urgentData, latestData, tipsData] = await Promise.all([
      urgentRes.json(),
      latestRes.json(),
      tipsRes.json(),
    ]);
    return {
      urgentNotices: urgentData.data?.notices || [],
      latestNotices: latestData.data?.notices || [],
      tips: tipsData.data?.posts || [],
    };
  } catch {
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
    <div className="bg-white">
      {/* Hero - Clean & Minimal */}
      <section className="pt-16 pb-12 px-4 border-b">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              University Admission <br className="hidden sm:block" />
              <span className="text-primary">Notices in One Place</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Get all admission notices, results, admit cards, and admission tips for Bangladeshi universities.
            </p>

            {/* Search Bar */}
            <HomeSearchBar />

            <div className="flex flex-wrap gap-2 justify-center pt-2">
              <Link href="/notices">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  Browse Notices
                </Button>
              </Link>
              <Link href="/universities">
                <Button variant="outline">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Universities
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Urgent Notices - High Priority */}
      {urgentNotices.length > 0 && (
        <section className="py-10 px-4 bg-red-50/50 border-b">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <h2 className="font-bold text-foreground">Urgent Notices</h2>
              </div>
              <Link href="/notices?urgent=true" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {urgentNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Notices */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-foreground">Latest Notices</h2>
            <Link href="/notices" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {latestNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {latestNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground text-sm">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p>No notices yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories - Quick Filter */}
      <section className="py-12 px-4 bg-slate-50 border-b">
        <div className="container mx-auto">
          <h2 className="font-bold text-lg text-foreground mb-5">Browse by Type</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {universityCategories.map((cat) => (
              <Link key={cat.type} href={`/notices?universityType=${cat.type}`}>
                <div className={`${cat.color} border border-slate-200 rounded-lg p-3 text-center hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer`}>
                  <div className="text-xl mb-1">{cat.icon}</div>
                  <span className="text-xs font-medium text-foreground">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links - Popular Universities */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto">
          <h2 className="font-bold text-lg text-foreground mb-5">Popular Universities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {popularUniversities.map((uni) => (
              <Link key={uni.slug} href={`/universities/${uni.slug}`}>
                <div className="border rounded-lg p-3 hover:border-primary/50 hover:bg-slate-50 transition-all cursor-pointer text-sm font-medium text-foreground">
                  {uni.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      {tips.length > 0 && (
        <section className="py-12 px-4 bg-slate-50 border-b">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-foreground">Admission Tips</h2>
              <Link href="/tips" className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA - Minimal */}
      <section className="py-12 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <BookOpen className="h-8 w-8 mx-auto mb-3 text-primary/20" />
          <h2 className="text-2xl font-bold mb-3">Start Your Admission Journey</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Browse all universities and never miss an important admission notice.
          </p>
          <Link href="/notices">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Explore Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

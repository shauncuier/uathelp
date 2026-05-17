// src/app/(public)/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bell, BookOpen, GraduationCap, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoticeCard } from "@/components/notices/NoticeCard";
import { BlogCard } from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "UAT Help — All University Admission Notices in One Place",
  description:
    "Find admission circulars, results, admit cards, seat plans, deadlines, and preparation tips for all Bangladeshi universities.",
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
  { label: "Public University", type: "public", icon: "🏛️", color: "from-blue-500 to-blue-600" },
  { label: "Private University", type: "private", icon: "🏢", color: "from-purple-500 to-purple-600" },
  { label: "Medical Admission", type: "medical", icon: "🏥", color: "from-red-500 to-red-600" },
  { label: "Engineering", type: "engineering", icon: "⚙️", color: "from-orange-500 to-orange-600" },
  { label: "Agriculture", type: "agriculture", icon: "🌾", color: "from-green-500 to-green-600" },
  { label: "National University", type: "national", icon: "📚", color: "from-teal-500 to-teal-600" },
];

const popularUniversities = [
  { name: "University of Dhaka", slug: "university-of-dhaka", short: "DU" },
  { name: "University of Chittagong", slug: "university-of-chittagong", short: "CU" },
  { name: "Rajshahi University", slug: "rajshahi-university", short: "RU" },
  { name: "Jahangirnagar University", slug: "jahangirnagar-university", short: "JU" },
  { name: "BUET", slug: "bangladesh-university-of-engineering-and-technology", short: "BUET" },
  { name: "National University", slug: "national-university", short: "NU" },
  { name: "GST Universities", slug: "gst-universities", short: "GST" },
  { name: "Medical Admission", slug: "medical-admission", short: "MBBS" },
];

export default async function HomePage() {
  const { urgentNotices, latestNotices, tips } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Bangladesh&apos;s #1 Admission Platform
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            All University Admission
            <br />
            <span className="text-blue-200">Notices in One Place</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Find admission circulars, results, admit cards, seat plans, deadlines, and preparation
            tips for Bangladeshi universities.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-8">
            <Link href="/notices">
              <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 shadow-lg cursor-pointer group hover:shadow-xl transition-shadow">
                <Search className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground text-sm flex-1 text-left group-hover:text-foreground transition-colors">
                  Search by university, notice, result, admit card...
                </span>
                <span className="bg-primary text-white text-xs px-3 py-1 rounded-lg">Search</span>
              </div>
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/notices">
              <Button size="lg" className="bg-white text-primary hover:bg-blue-50 shadow-lg font-semibold">
                <Bell className="h-4 w-4 mr-2" />
                Browse Latest Notices
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 mr-2" />
                Explore Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Urgent Notices */}
      {urgentNotices.length > 0 && (
        <section className="py-12 px-4 bg-red-50/50">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <h2 className="text-xl font-bold text-foreground">Urgent Notices</h2>
              </div>
              <Link href="/notices?urgent=true" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {urgentNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Notices */}
      <section className="py-14 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Latest Notices</h2>
              <p className="text-muted-foreground text-sm mt-1">Recently published admission information</p>
            </div>
            <Link href="/notices" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {latestNotices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestNotices.map((notice: any) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No notices published yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* University Categories */}
      <section className="py-14 px-4 bg-muted/40">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-foreground text-center mb-2">Find by Category</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">Browse admission notices by university type</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {universityCategories.map((cat) => (
              <Link key={cat.type} href={`/notices?universityType=${cat.type}`}>
                <div className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-center text-foreground leading-tight">{cat.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Universities */}
      <section className="py-14 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Popular Universities</h2>
              <p className="text-muted-foreground text-sm mt-1">Quick access to top universities</p>
            </div>
            <Link href="/universities" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {popularUniversities.map((uni) => (
              <Link key={uni.slug} href={`/universities/${uni.slug}`}>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {uni.short.slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-foreground line-clamp-2">{uni.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Tips */}
      {tips.length > 0 && (
        <section className="py-14 px-4 bg-muted/40">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Admission Tips</h2>
                <p className="text-muted-foreground text-sm mt-1">Expert guidance for your preparation</p>
              </div>
              <Link href="/tips" className="text-sm text-primary hover:underline flex items-center gap-1">
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {tips.map((post: any) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-20 px-4 gradient-primary text-white text-center">
        <div className="container mx-auto max-w-2xl">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Never Miss an Admission Notice</h2>
          <p className="text-blue-100 mb-8">
            Stay updated with all Bangladeshi university admission news in one place.
          </p>
          <Link href="/notices">
            <Button size="lg" className="bg-white text-primary hover:bg-blue-50 font-semibold shadow-lg">
              Browse All Notices
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

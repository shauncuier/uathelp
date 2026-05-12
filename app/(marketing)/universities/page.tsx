import type { Metadata } from "next";
import { universities } from "@/config/universities";
import { PremiumUniversityList } from "@/components/university/premium-university-list";

export const metadata: Metadata = {
  title: "University Database | UAT Help",
  description: "Browse 270+ Bangladeshi public, private, engineering, medical, and national universities with admission criteria, rankings, and detailed information.",
};

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative py-12 lg:py-16 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">University Database</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore comprehensive information about 270+ Bangladeshi universities. Search, filter by type, and compare institutions across public, private, engineering, medical, and national categories.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <PremiumUniversityList universities={universities} />
      </div>
    </div>
  );
}

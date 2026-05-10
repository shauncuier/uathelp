import type { Metadata } from "next";
import { universities } from "@/config/universities";
import { UniversityList } from "@/components/university/university-filters";

export const metadata: Metadata = {
  title: "Universities",
  description: "Browse 150+ Bangladeshi universities with detailed profiles, admission criteria, and ranking information.",
};

export default function UniversitiesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          University <span className="gradient-text">Database</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore universities across Bangladesh. Filter by type, location, and requirements.
        </p>
      </div>
      <UniversityList universities={universities} />
    </div>
  );
}

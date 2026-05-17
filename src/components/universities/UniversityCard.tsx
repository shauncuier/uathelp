// src/components/universities/UniversityCard.tsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { University } from "@/types";

const typeColors: Record<string, string> = {
  public: "bg-blue-100 text-blue-700",
  private: "bg-purple-100 text-purple-700",
  national: "bg-green-100 text-green-700",
  medical: "bg-red-100 text-red-700",
  engineering: "bg-orange-100 text-orange-700",
  agriculture: "bg-teal-100 text-teal-700",
};

export function UniversityCard({ university }: { university: University }) {
  return (
    <Card className="card-hover">
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
            {university.logoUrl ? (
              <Image
                src={university.logoUrl}
                alt={university.nameEn}
                width={48}
                height={48}
                className="object-contain"
              />
            ) : (
              <span className="font-bold text-primary text-sm">
                {university.shortName?.slice(0, 2)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[university.type] || "bg-slate-100 text-slate-700"}`}>
              {university.type.charAt(0).toUpperCase() + university.type.slice(1)}
            </span>
            <h3 className="font-semibold text-foreground mt-1 line-clamp-1 text-sm">
              {university.nameEn}
            </h3>
            <p className="text-xs text-muted-foreground font-bn">{university.nameBn}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
          <MapPin className="h-3.5 w-3.5" />
          <span>{university.district}, {university.division}</span>
        </div>

        <Link href={`/universities/${university.slug}`}>
          <Button variant="outline" size="sm" className="w-full group">
            View Details
            <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

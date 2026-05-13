import { Bookmark, BookOpenText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const bookmarks = [
  { title: "Complete University Admission Guide 2026", type: "Guide", href: "/blog/complete-admission-guide-2026" },
  { title: "Top 10 Engineering Universities in Bangladesh", type: "Ranking", href: "/blog/top-10-engineering-universities" },
  { title: "Private vs Public University: Which is Right for You?", type: "Advice", href: "/blog/private-vs-public-university" },
];

export default function BookmarksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bookmarked Articles</h1>
        <p className="mt-1 text-muted-foreground">Keep your favorite guides and circulars in one place.</p>
      </div>

      <div className="grid gap-4">
        {bookmarks.map((item) => (
          <div key={item.title} className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <BookOpenText className="size-5 text-brand" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.type}</p>
                <h2 className="font-semibold">{item.title}</h2>
              </div>
            </div>
            <Link
              href={item.href}
              className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
            >
              Open <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <Bookmark className="size-5 text-brand" />
          <div>
            <h2 className="font-semibold">Bookmark articles as you research</h2>
            <p className="text-sm text-muted-foreground">This section is ready for Firestore persistence and user-specific bookmarks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

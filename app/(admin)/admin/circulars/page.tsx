import { CalendarDays, Megaphone, PencilLine, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { circulars } from "@/data/circulars";

function formatDate(date: string | null) {
  if (!date) return "Not announced";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AdminCircularsPage() {
  const visibleCirculars = circulars.slice(0, 40);
  const publishedCount = circulars.filter((item) => item.status === "Published").length;
  const draftCount = circulars.length - publishedCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Circulars</h1>
          <p className="mt-1 text-muted-foreground">Manage admission circular updates and publishing status.</p>
        </div>
        <Button className="bg-brand text-brand-foreground hover:bg-brand/90">New Circular</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total circulars</p>
          <p className="mt-1 text-2xl font-bold">{circulars.length}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="mt-1 text-2xl font-bold">{publishedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Draft</p>
          <p className="mt-1 text-2xl font-bold">{draftCount}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
            <Megaphone className="size-5 text-brand" />
          </div>
          <div>
            <h2 className="font-semibold">Publishing queue</h2>
            <p className="text-sm text-muted-foreground">Showing the first 40 generated circulars from the shared circular database.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {visibleCirculars.map((item) => (
            <div key={item.slug} className="flex flex-col gap-3 rounded-xl border border-border/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <PencilLine className="size-4 shrink-0 text-brand" />
                  <p className="truncate font-medium">{item.title}</p>
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  Deadline: {formatDate(item.deadline)}
                </p>
              </div>
              <Badge variant="secondary" className="w-fit">
                <Rocket className="size-3.5" />
                {item.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

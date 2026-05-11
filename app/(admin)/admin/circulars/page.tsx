import { Megaphone, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

const circulars = [
  { title: "BUET Admission Circular 2026", date: "Oct 15, 2026", status: "Published" },
  { title: "DU Arts Unit Announcement", date: "Sep 30, 2026", status: "Draft" },
  { title: "AIUB Spring Intake", date: "Aug 31, 2026", status: "Published" },
];

export default function AdminCircularsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Circulars</h1>
          <p className="mt-1 text-muted-foreground">Manage admission circular updates and publishing status.</p>
        </div>
        <Button className="bg-brand text-brand-foreground hover:bg-brand/90">New Circular</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
            <Megaphone className="size-5 text-brand" />
          </div>
          <div>
            <h2 className="font-semibold">Publishing queue</h2>
            <p className="text-sm text-muted-foreground">A future Supabase table can power this with workflow status and moderation.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {circulars.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1"><CalendarDays className="size-3.5" />{item.date}</p>
              </div>
              <span className="text-sm text-muted-foreground">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

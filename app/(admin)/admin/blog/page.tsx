import { FileText, PencilLine, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  { title: "Complete University Admission Guide 2026", status: "Published" },
  { title: "Top 10 Engineering Universities in Bangladesh", status: "Scheduled" },
  { title: "Private vs Public University: Which is Right for You?", status: "Draft" },
];

export default function AdminBlogPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="mt-1 text-muted-foreground">Manage editorial content and SEO-driven guides.</p>
        </div>
        <Button className="bg-brand text-brand-foreground hover:bg-brand/90">New Post</Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
            <FileText className="size-5 text-brand" />
          </div>
          <div>
            <h2 className="font-semibold">Content pipeline</h2>
            <p className="text-sm text-muted-foreground">MDX-backed posts and a publish workflow can plug in here next.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {posts.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <PencilLine className="size-4 text-brand" />
                <p className="font-medium">{item.title}</p>
              </div>
              <span className="text-sm text-muted-foreground flex items-center gap-1"><Rocket className="size-3.5" />{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

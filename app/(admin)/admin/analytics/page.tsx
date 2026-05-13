import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

const metrics = [
  { label: "Monthly Active Users", value: "12.4k", detail: "+18%" },
  { label: "AI Queries", value: "84k", detail: "+23%" },
  { label: "Saved Universities", value: "3.2k", detail: "+9%" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-muted-foreground">Platform health, AI usage, and content performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <BarChart3 className="size-5 text-brand" />
              <span className="text-sm text-emerald-500 flex items-center gap-1"><TrendingUp className="size-3.5" />{metric.detail}</span>
            </div>
            <p className="mt-4 text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
            <Sparkles className="size-5 text-brand" />
          </div>
          <div>
            <h2 className="font-semibold">Insights</h2>
            <p className="text-sm text-muted-foreground">Connect this panel to Firestore analytics or event collections for live reporting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

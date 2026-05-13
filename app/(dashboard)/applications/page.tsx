import { ClipboardList, CheckCircle2, Clock3, AlertCircle } from "lucide-react";

const applications = [
  { name: "BUET", status: "Preparing", due: "Oct 15, 2026", tone: "text-amber-500", icon: Clock3 },
  { name: "University of Dhaka", status: "Submitted", due: "Sep 30, 2026", tone: "text-emerald-500", icon: CheckCircle2 },
  { name: "BRAC University", status: "Waiting", due: "Aug 31, 2026", tone: "text-blue-500", icon: AlertCircle },
];

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Application Tracker</h1>
        <p className="mt-1 text-muted-foreground">Monitor deadlines, statuses, and next actions.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
            <ClipboardList className="size-5 text-brand" />
          </div>
          <div>
            <h2 className="font-semibold">Applications at a glance</h2>
            <p className="text-sm text-muted-foreground">A future Firestore collection can back this timeline with real submissions and reminders.</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {applications.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <item.icon className={`size-4 ${item.tone}`} />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Deadline {item.due}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${item.tone}`}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

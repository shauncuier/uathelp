import { Bell, CalendarClock, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const notifications = [
  { title: "BUET admission deadline in 4 days", detail: "Don’t miss the application window.", icon: CalendarClock },
  { title: "AI generated a new DU comparison", detail: "You asked for CSE recommendations.", icon: MessageSquare },
  { title: "Scholarship alert from AIUB", detail: "Merit waivers available for eligible students.", icon: Sparkles },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="mt-1 text-muted-foreground">Deadline reminders and AI alerts.</p>
        </div>
        <Button variant="outline">
          <Bell className="mr-2 size-4" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <item.icon className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

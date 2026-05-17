import { Suspense } from "react";
import NoticesContent from "@/components/notices/NoticesContent";

function NoticesPageLoading() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">University Admission Notices</h1>
        <p className="text-muted-foreground mt-2">All official admission circulars, results, admit cards, and more</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 rounded-xl bg-gray-200 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function NoticesPage() {
  return (
    <Suspense fallback={<NoticesPageLoading />}>
      <NoticesContent />
    </Suspense>
  );
}

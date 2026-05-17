import { Suspense } from "react";
import ProfileContent from "@/components/profile/ProfileContent";
import { Card, CardContent } from "@/components/ui/card";

function ProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-sm">
            <CardContent className="p-6 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-6 bg-gray-100 rounded" />
              ))}
            </CardContent>
          </Card>
          <Card className="md:col-span-2 shadow-sm">
            <CardContent className="p-6">
              <div className="h-32 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <ProfileContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import LoginContent from "@/components/auth/LoginContent";
import { Card } from "@/components/ui/card";

function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <div className="p-8 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-40 mx-auto" />
          <div className="h-4 bg-gray-100 rounded w-48 mx-auto" />
          <div className="space-y-3 mt-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
}

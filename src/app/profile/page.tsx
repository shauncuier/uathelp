"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, GraduationCap, Bookmark } from "lucide-react";
import { logout } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default function StudentDashboardPage() {
  const { user, appUser, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    
    if (user) {
      getDoc(doc(db, "users", user.uid)).then((d) => {
        if (d.exists()) setUserData(d.data());
      });
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      document.cookie = "__session=; path=/; max-age=0;";
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (err: any) {
      toast.error("Failed to log out");
    }
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base text-foreground font-medium">{userData?.name || appUser?.name || user.displayName || "Student"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 mt-1">
                  {userData?.role || appUser?.role || "Student"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-primary" />
                Saved Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 border-2 border-dashed rounded-lg border-slate-200">
                <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-slate-900">No saved items yet</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  When you save universities or notices, they will appear here for quick access.
                </p>
                <Button variant="outline" className="mt-4" onClick={() => router.push("/universities")}>
                  Explore Universities
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

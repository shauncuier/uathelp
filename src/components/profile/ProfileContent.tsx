"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { logout } from "@/lib/firebase/auth";
import { toast } from "sonner";
import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default function ProfileContent() {
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

  if (loading || !user) return null;

  const userRole = userData?.role || appUser?.role || "student";

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Name</p>
                <p className="font-medium text-foreground mt-0.5">
                  {userData?.name || appUser?.name || user.displayName || "Student"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Email</p>
                <p className="font-medium text-foreground mt-0.5 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground">Account Type</p>
                <p className="font-medium text-foreground mt-0.5 capitalize">{userRole}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">📚</div>
              <p className="font-medium text-foreground text-sm mb-2">Browse Notices</p>
              <Button variant="outline" size="sm" onClick={() => router.push("/notices")}>
                Explore
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all">
            <CardContent className="p-6 text-center">
              <div className="text-2xl mb-2">🏫</div>
              <p className="font-medium text-foreground text-sm mb-2">Universities</p>
              <Button variant="outline" size="sm" onClick={() => router.push("/universities")}>
                Explore
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

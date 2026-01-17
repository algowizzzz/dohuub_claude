"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isCustomer, setIsCustomer] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    } else if (user?.role === "ADMIN") {
      router.replace("/admin");
    } else if (user?.role === "VENDOR") {
      router.replace("/vendor");
    } else if (user?.role === "CUSTOMER") {
      // Customer trying to access business portal
      setIsCustomer(true);
    }
  }, [isAuthenticated, user, router]);

  if (isCustomer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Business Portal</CardTitle>
            <CardDescription>
              This portal is for vendors and administrators only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You&apos;re logged in as a customer ({user?.email}). To access services, please use the mobile app.
            </p>
            <p className="text-sm text-gray-600">
              Want to become a vendor? Register a business account to start listing your services.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { logout(); router.push("/auth/login"); }}>
                Sign Out
              </Button>
              <Button onClick={() => router.push("/auth/register")}>
                Register as Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}


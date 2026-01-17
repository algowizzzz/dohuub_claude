"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuthStore } from "@/stores/authStore";

interface PortalLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function PortalLayout({ children, title, subtitle }: PortalLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, fetchUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the first client render matches the server render (avoid hydration mismatches).
    setMounted(true);
    setToken(localStorage.getItem("doohub_token"));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check auth on mount/when token changes - only redirect if definitely not authenticated
    if (token && !isAuthenticated) {
      fetchUser();
    } else if (!token && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [mounted, token, isAuthenticated, fetchUser, router]);

  // Show loading while checking auth (only if we have a token but state not yet loaded)
  if (!mounted) {
    return null;
  }

  if (!isAuthenticated && token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // No token - don't render, will redirect
  if (!isAuthenticated && !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-[280px]">
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}


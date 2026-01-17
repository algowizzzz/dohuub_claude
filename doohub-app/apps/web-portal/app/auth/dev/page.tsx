"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export default function DevLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Authenticating...");
  const { setToken, fetchUser } = useAuthStore();

  useEffect(() => {
    const role = searchParams.get("role") || "admin";
    
    const emailMap: Record<string, string> = {
      admin: "demo-admin@doohub.com",
      vendor: "demo-vendor@doohub.com",
      customer: "demo-customer@doohub.com",
    };

    const email = emailMap[role.toLowerCase()] || emailMap.admin;
    
    const doLogin = async () => {
      try {
        setStatus(`Logging in as ${role}...`);
        const response = await api.post("/auth/dev-login", { email });
        const { token, refreshToken, user } = response.data.data;
        
        // Use auth store to set tokens
        setToken(token, refreshToken);
        
        setStatus(`Fetching user data...`);
        
        // Fetch user to update the store
        await fetchUser();
        
        setStatus(`Logged in! Redirecting to ${user.role} portal...`);
        
        // Redirect based on role
        setTimeout(() => {
          if (user.role === "ADMIN") {
            router.push("/admin");
          } else if (user.role === "VENDOR") {
            router.push("/vendor");
          } else {
            router.push("/");
          }
        }, 300);
      } catch (err: any) {
        setStatus(`Error: ${err.response?.data?.error || err.message}`);
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    };

    doLogin();
  }, [router, searchParams, setToken, fetchUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto mb-4"></div>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}

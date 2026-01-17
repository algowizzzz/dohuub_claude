"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, vendor } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Subscription status for vendors */}
        {vendor && user?.role === "VENDOR" && (
          <Badge
            variant={
              vendor.subscriptionStatus === "ACTIVE"
                ? "success"
                : vendor.subscriptionStatus === "TRIAL"
                ? "warning"
                : "error"
            }
          >
            {vendor.subscriptionStatus === "TRIAL"
              ? "Trial"
              : vendor.subscriptionStatus === "ACTIVE"
              ? "Active"
              : "Expired"}
          </Badge>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold text-white flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </header>
  );
}


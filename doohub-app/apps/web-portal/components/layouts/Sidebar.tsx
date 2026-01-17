"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  CreditCard,
  Settings,
  Users,
  Store,
  AlertTriangle,
  Crown,
  BarChart3,
  LogOut,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const vendorNavItems: NavItem[] = [
  { title: "Dashboard", href: "/vendor", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "My Listings", href: "/vendor/listings", icon: <Package className="h-5 w-5" /> },
  { title: "Orders", href: "/vendor/orders", icon: <ShoppingBag className="h-5 w-5" /> },
  { title: "Reviews", href: "/vendor/reviews", icon: <Star className="h-5 w-5" /> },
  { title: "Performance", href: "/vendor/performance", icon: <TrendingUp className="h-5 w-5" /> },
  { title: "Service Areas", href: "/vendor/areas", icon: <MapPin className="h-5 w-5" /> },
  { title: "Availability", href: "/vendor/availability", icon: <Clock className="h-5 w-5" /> },
  { title: "Subscription", href: "/vendor/subscription", icon: <CreditCard className="h-5 w-5" /> },
  { title: "Settings", href: "/vendor/settings", icon: <Settings className="h-5 w-5" /> },
];

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { title: "Vendors", href: "/admin/vendors", icon: <Store className="h-5 w-5" /> },
  { title: "Customers", href: "/admin/customers", icon: <Users className="h-5 w-5" /> },
  { title: "All Listings", href: "/admin/listings", icon: <Package className="h-5 w-5" /> },
  { title: "Reports", href: "/admin/reports", icon: <AlertTriangle className="h-5 w-5" /> },
  { title: "Michelle Listings", href: "/admin/michelle", icon: <Crown className="h-5 w-5" /> },
  { title: "Subscriptions", href: "/admin/subscriptions", icon: <BarChart3 className="h-5 w-5" /> },
  { title: "Settings", href: "/admin/settings", icon: <Settings className="h-5 w-5" /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isAdmin = user?.role === "ADMIN";
  const navItems = isAdmin ? adminNavItems : vendorNavItems;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href={isAdmin ? "/admin" : "/vendor"} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">DH</span>
            </div>
            <span className="text-xl font-bold text-primary">DoHuub</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    {item.icon}
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary font-semibold">
                {user?.profile?.firstName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}


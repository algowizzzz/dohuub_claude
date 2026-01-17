"use client";

import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Store, Package, AlertTriangle, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";
import api, { ENDPOINTS } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface PlatformStats {
  totalCustomers: number;
  activeVendors: number;
  liveListings: number;
  pendingReports: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalVendors: number;
}

interface RecentVendor {
  id: string;
  businessName: string;
  subscriptionStatus: string;
  user: { email: string };
  _count?: { cleaningListings: number; handymanListings: number; beautyListings: number };
}

interface PendingReport {
  id: string;
  reason: string;
  createdAt: string;
  listing?: { title: string };
}

const statusColors: Record<string, "success" | "warning" | "error"> = {
  ACTIVE: "success",
  TRIAL: "warning",
  EXPIRED: "error",
  PAUSED: "warning",
  CANCELLED: "error",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [recentVendors, setRecentVendors] = useState<RecentVendor[]>([]);
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch vendors
        const vendorsRes = await api.get(ENDPOINTS.VENDORS);
        const vendors: RecentVendor[] = vendorsRes.data.data || [];

        // Fetch reports
        const reportsRes = await api.get("/reports", { params: { status: "PENDING", limit: 20 } });
        const reports: PendingReport[] = reportsRes.data.data || [];

        // Fetch customer count
        const customersRes = await api.get("/users", { params: { role: "CUSTOMER", limit: 1 } });
        const totalCustomers = customersRes.data.pagination?.total || 0;

        // Fetch listing count
        const listingsRes = await api.get("/vendors/all-listings", { params: { limit: 1 } });
        const liveListings = listingsRes.data.pagination?.total || (listingsRes.data.data?.length || 0);

        // Calculate stats
        const activeVendors = vendors.filter(v => v.subscriptionStatus === "ACTIVE").length;
        const activeSubscriptions = vendors.filter(v => ["ACTIVE", "TRIAL"].includes(v.subscriptionStatus)).length;
        const monthlyRevenue = activeVendors * 79; // $79/month per active vendor

        setStats({
          totalCustomers,
          activeVendors,
          liveListings,
          pendingReports: reports.length,
          monthlyRevenue,
          activeSubscriptions,
          totalVendors: vendors.length,
        });

        setRecentVendors(vendors.slice(0, 4));
        setPendingReports(reports.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setStats({
          totalCustomers: 0,
          activeVendors: 0,
          liveListings: 0,
          pendingReports: 0,
          monthlyRevenue: 0,
          activeSubscriptions: 0,
          totalVendors: 0,
        });
        setRecentVendors([]);
        setPendingReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const platformStats = [
    { 
      title: "Total Customers", 
      value: stats?.totalCustomers?.toString() || "0", 
      icon: Users, 
      change: "Registered users", 
      color: "bg-blue-50 text-blue-600" 
    },
    { 
      title: "Active Vendors", 
      value: stats?.activeVendors?.toString() || "0", 
      icon: Store, 
      change: `${stats?.totalVendors || 0} total`, 
      color: "bg-green-50 text-green-600" 
    },
    { 
      title: "Live Listings", 
      value: stats?.liveListings?.toString() || "0", 
      icon: Package, 
      change: "Across all categories", 
      color: "bg-purple-50 text-purple-600" 
    },
    { 
      title: "Pending Reports", 
      value: stats?.pendingReports?.toString() || "0", 
      icon: AlertTriangle, 
      change: stats?.pendingReports ? "Needs attention" : "All clear", 
      color: "bg-red-50 text-red-600" 
    },
    { 
      title: "Monthly Revenue", 
      value: formatCurrency(stats?.monthlyRevenue || 0), 
      icon: DollarSign, 
      change: "From subscriptions", 
      color: "bg-yellow-50 text-yellow-600" 
    },
    { 
      title: "Active Subscriptions", 
      value: stats?.activeSubscriptions?.toString() || "0", 
      icon: TrendingUp, 
      change: stats?.totalVendors ? `${Math.round((stats.activeSubscriptions / stats.totalVendors) * 100)}% of vendors` : "0%", 
      color: "bg-indigo-50 text-indigo-600" 
    },
  ];

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <PortalLayout title="Admin Dashboard" subtitle="Platform overview and management">
      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-center h-28">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {platformStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vendors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Vendors</CardTitle>
            <Link href="/admin/vendors" className="text-sm text-gray-700 hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : recentVendors.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No vendors yet</p>
            ) : (
              <div className="space-y-4">
                {recentVendors.map((vendor) => (
                  <Link 
                    key={vendor.id} 
                    href={`/admin/vendors/${vendor.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{vendor.businessName}</p>
                      <p className="text-sm text-gray-500">{vendor.user?.email || 'No email'}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColors[vendor.subscriptionStatus] || "default"}>
                        {vendor.subscriptionStatus}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Pending Reports
              {pendingReports.length > 0 && (
                <Badge variant="error">{pendingReports.length}</Badge>
              )}
            </CardTitle>
            <Link href="/admin/reports" className="text-sm text-gray-700 hover:underline">
              View all →
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : pendingReports.length === 0 ? (
              <div className="py-8 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-gray-500">No pending reports</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div>
                      <p className="font-medium text-gray-900">{report.listing?.title || "Unknown Listing"}</p>
                      <p className="text-sm text-red-600">{report.reason.replace(/_/g, " ")}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{getTimeAgo(report.createdAt)}</p>
                      <Link href={`/admin/reports/${report.id}`} className="text-sm text-gray-700 hover:underline">
                        Review →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Link href="/admin/michelle/new">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="font-medium">Add DoHuub Listing</p>
              <p className="text-sm text-gray-500 mt-1">Michelle&apos;s priority listings</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/vendors">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Store className="h-8 w-8 text-gray-600 mx-auto mb-3" />
              <p className="font-medium">Manage Vendors</p>
              <p className="text-sm text-gray-500 mt-1">View all business accounts</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/reports">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <p className="font-medium">Review Reports</p>
              <p className="text-sm text-gray-500 mt-1">Moderate flagged content</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/subscriptions">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <p className="font-medium">Subscriptions</p>
              <p className="text-sm text-gray-500 mt-1">Monitor revenue & plans</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PortalLayout>
  );
}

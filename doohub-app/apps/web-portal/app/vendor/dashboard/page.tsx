"use client";

import { useState, useEffect } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { Package, ShoppingBag, Star, DollarSign, TrendingUp, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import api, { ENDPOINTS } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

interface DashboardStats {
  activeListings: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  averageRating: number;
  reviewCount: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

interface RecentOrder {
  id: string;
  category: string;
  status: string;
  total: number;
  user: {
    profile?: { firstName: string; lastName: string };
    email: string;
  };
  cleaningListing?: { title: string };
  handymanListing?: { title: string };
  beautyListing?: { title: string };
  rentalListing?: { title: string };
  caregivingListing?: { title: string };
}

const statusColors: Record<string, "default" | "warning" | "success" | "secondary"> = {
  PENDING: "warning",
  ACCEPTED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "success",
};

export default function VendorDashboard() {
  const { vendor } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch vendor bookings for stats
        const ordersRes = await api.get(`${ENDPOINTS.BOOKINGS}/vendor`, { params: { limit: 100 } });
        const orders = ordersRes.data.data || [];
        const counts = ordersRes.data.counts || {};

        // Fetch reviews
        let avgRating = 0;
        let reviewCount = 0;
        try {
          const reviewsRes = await api.get(`${ENDPOINTS.REVIEWS}/vendor`);
          const reviews = reviewsRes.data.data || [];
          reviewCount = reviews.length;
          avgRating = reviewCount > 0 
            ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviewCount 
            : 0;
        } catch {
          // Reviews endpoint might not exist, use vendor data
          avgRating = vendor?.rating || 0;
          reviewCount = vendor?.reviewCount || 0;
        }

        // Calculate revenue
        const completedOrders = orders.filter((o: RecentOrder) => o.status === "COMPLETED");
        const totalRevenue = completedOrders.reduce((sum: number, o: RecentOrder) => sum + o.total, 0);
        
        // Calculate monthly revenue (current month)
        const now = new Date();
        const monthlyCompleted = completedOrders.filter((o: RecentOrder) => {
          const orderDate = new Date((o as any).completedAt || (o as any).createdAt);
          return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
        });
        const monthlyRevenue = monthlyCompleted.reduce((sum: number, o: RecentOrder) => sum + o.total, 0);

        // Count listings (approximate from orders)
        const uniqueListings = new Set(orders.map((o: any) => 
          o.cleaningListingId || o.handymanListingId || o.beautyListingId || 
          o.rentalListingId || o.caregivingListingId
        ).filter(Boolean));

        setStats({
          activeListings: uniqueListings.size || 0,
          totalOrders: orders.length,
          completedOrders: counts.COMPLETED || 0,
          pendingOrders: counts.PENDING || 0,
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount,
          totalRevenue,
          monthlyRevenue,
        });

        // Get recent orders
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [vendor]);

  const getServiceTitle = (order: RecentOrder) => {
    return (
      order.cleaningListing?.title ||
      order.handymanListing?.title ||
      order.beautyListing?.title ||
      order.rentalListing?.title ||
      order.caregivingListing?.title ||
      order.category
    );
  };

  const getCustomerName = (order: RecentOrder) => {
    if (order.user.profile) {
      return `${order.user.profile.firstName} ${order.user.profile.lastName.charAt(0)}.`;
    }
    return order.user.email.split("@")[0];
  };

  const statItems = [
    { 
      title: "Active Listings", 
      value: stats?.activeListings?.toString() || "0", 
      icon: Package, 
      change: "Services listed" 
    },
    { 
      title: "Total Orders", 
      value: stats?.totalOrders?.toString() || "0", 
      icon: ShoppingBag, 
      change: `${stats?.pendingOrders || 0} pending` 
    },
    { 
      title: "Average Rating", 
      value: stats?.averageRating?.toFixed(1) || "0.0", 
      icon: Star, 
      change: `From ${stats?.reviewCount || 0} reviews` 
    },
    { 
      title: "Revenue", 
      value: formatCurrency(stats?.totalRevenue || 0), 
      icon: DollarSign, 
      change: `${formatCurrency(stats?.monthlyRevenue || 0)} this month` 
    },
  ];

  return (
    <PortalLayout title="Overview" subtitle="Welcome back to your business portal">
      {/* Trial Banner */}
      {vendor?.subscriptionStatus === "TRIAL" && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-800">Trial Period Active</p>
              <p className="text-sm text-yellow-600">
                {vendor.trialEndsAt 
                  ? `Your free trial ends ${new Date(vendor.trialEndsAt).toLocaleDateString()}`
                  : "Your free trial is active"}
              </p>
            </div>
          </div>
          <Link
            href="/vendor/subscription-management"
            className="text-sm font-medium text-yellow-800 hover:underline"
          >
            Upgrade Now →
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statItems.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/vendor/orders" className="text-sm text-gray-700 hover:underline">
            View all →
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No orders yet. Your orders will appear here once customers book your services.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {order.id.slice(0, 8)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{getServiceTitle(order)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{getCustomerName(order)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={statusColors[order.status] || "default"}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Link href="/vendor/services">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-gray-700 mx-auto mb-3" />
              <p className="font-medium">My Services</p>
              <p className="text-sm text-gray-500 mt-1">Manage your service listings</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/vendor/orders">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <ShoppingBag className="h-8 w-8 text-gray-700 mx-auto mb-3" />
              <p className="font-medium">Manage Orders</p>
              <p className="text-sm text-gray-500 mt-1">View and handle bookings</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/vendor/profile">
          <Card className="hover:border-gray-400 transition-colors cursor-pointer">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-gray-700 mx-auto mb-3" />
              <p className="font-medium">Profile</p>
              <p className="text-sm text-gray-500 mt-1">Manage your business info</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PortalLayout>
  );
}

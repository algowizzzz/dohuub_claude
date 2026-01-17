"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Users, Star, ShoppingBag, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ui/toaster";

type Analytics = {
  metrics: {
    totalRevenue: number;
    totalBookings: number;
    uniqueCustomers: number;
    averageRating: number;
    reviewCount: number;
  };
  monthly: Array<{ month: string; year: number; revenue: number; bookings: number }>;
  topServices: Array<{ name: string; bookings: number; revenue: number; rating: number }>;
};

export default function PerformancePage() {
  const { toast } = useToast();
  const [data, setData] = useState<Analytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/vendors/me/analytics");
      setData(res.data.data);
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load analytics",
        variant: "destructive",
      });
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const monthlyData = data?.monthly || [];
  const maxRevenue = useMemo(() => Math.max(1, ...monthlyData.map((d) => d.revenue)), [monthlyData]);

  const metrics = useMemo(() => {
    const m = data?.metrics;
    if (!m) return [];
    const avg = m.averageRating || 0;
    return [
      { label: "Total Revenue", value: formatCurrency(m.totalRevenue), change: "All time", trend: "up", icon: DollarSign },
      { label: "Total Bookings", value: String(m.totalBookings), change: "All time", trend: "up", icon: ShoppingBag },
      { label: "Unique Customers", value: String(m.uniqueCustomers), change: "All time", trend: "up", icon: Users },
      { label: "Average Rating", value: avg.toFixed(1), change: `From ${m.reviewCount} reviews`, trend: "down", icon: Star },
    ] as const;
  }, [data]);

  const topServices = data?.topServices || [];

  return (
    <PortalLayout title="Performance Analytics" subtitle="Track your business performance">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="flex justify-end">
          <button
            onClick={fetchAnalytics}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 flex items-center justify-center h-28">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                      <div className={`flex items-center gap-1 mt-1 ${
                        metric.trend === "up" ? "text-success" : "text-error"
                      }`}>
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">{metric.change}</span>
                      </div>
                    </div>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      metric.trend === "up" ? "bg-success-50" : "bg-error-50"
                    }`}>
                      <metric.icon className={`h-6 w-6 ${
                        metric.trend === "up" ? "text-success" : "text-error"
                      }`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {monthlyData.map((data) => (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-primary rounded-t-lg transition-all"
                      style={{ height: `${(data.revenue / maxRevenue) * 200}px` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                  <span className="text-xs font-medium">{formatCurrency(data.revenue)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Bookings</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Revenue</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.map((service, index) => (
                    <tr key={service.name} className="border-b border-gray-100">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary font-semibold text-sm">
                            {index + 1}
                          </span>
                          <span className="font-medium">{service.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">{service.bookings}</td>
                      <td className="py-4 px-4 text-right font-medium">{formatCurrency(service.revenue)}</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          {service.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-success mt-2" />
                  <div>
                    <p className="font-medium">Revenue is up 12% this month</p>
                    <p className="text-sm text-gray-500">You&apos;re on track to hit $15,000 next month</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-warning mt-2" />
                  <div>
                    <p className="font-medium">Deep Cleaning is your best performer</p>
                    <p className="text-sm text-gray-500">Consider promoting this service more</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">15% more repeat customers</p>
                    <p className="text-sm text-gray-500">Your customer retention is improving</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li>
                  <a href="/vendor/listings/new" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-xl">📦</span>
                    <span className="font-medium">Add a new service listing</span>
                  </a>
                </li>
                <li>
                  <a href="/vendor/reviews" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-xl">⭐</span>
                    <span className="font-medium">Respond to pending reviews</span>
                  </a>
                </li>
                <li>
                  <a href="/vendor/availability" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <span className="text-xl">📅</span>
                    <span className="font-medium">Update your availability</span>
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}


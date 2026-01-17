"use client";

import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, CreditCard, TrendingUp, Users, DollarSign, Loader2, RefreshCw, Eye } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import api, { ENDPOINTS } from "@/lib/api";
import Link from "next/link";

interface VendorSubscription {
  id: string;
  businessName: string;
  subscriptionStatus: string;
  trialStartedAt?: string;
  trialEndsAt?: string;
  createdAt: string;
  user: {
    email: string;
  };
}

const statusColors: Record<string, "success" | "warning" | "error" | "secondary" | "default"> = {
  TRIAL: "warning",
  ACTIVE: "success",
  PAUSED: "secondary",
  EXPIRED: "error",
  CANCELLED: "error",
};

const tabs = ["ALL", "TRIAL", "ACTIVE", "PAUSED", "EXPIRED"];

export default function SubscriptionsPage() {
  const [vendors, setVendors] = useState<VendorSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(ENDPOINTS.VENDORS);
      setVendors(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setVendors([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Calculate stats
  const stats = {
    total: vendors.length,
    trial: vendors.filter((v) => v.subscriptionStatus === "TRIAL").length,
    active: vendors.filter((v) => v.subscriptionStatus === "ACTIVE").length,
    paused: vendors.filter((v) => v.subscriptionStatus === "PAUSED").length,
    expired: vendors.filter((v) => v.subscriptionStatus === "EXPIRED" || v.subscriptionStatus === "CANCELLED").length,
    monthlyRevenue: vendors.filter((v) => v.subscriptionStatus === "ACTIVE").length * 79, // Assuming $79/month
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.businessName.toLowerCase().includes(search.toLowerCase()) ||
      vendor.user.email.toLowerCase().includes(search.toLowerCase());
    const matchesTab =
      activeTab === "ALL" ||
      vendor.subscriptionStatus === activeTab ||
      (activeTab === "EXPIRED" && (vendor.subscriptionStatus === "EXPIRED" || vendor.subscriptionStatus === "CANCELLED"));
    return matchesSearch && matchesTab;
  });

  return (
    <PortalLayout title="Subscriptions" subtitle="Monitor vendor subscription statuses">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total Vendors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.trial}</p>
                  <p className="text-sm text-gray-500">In Trial</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.monthlyRevenue)}</p>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
                  <p className="text-sm text-gray-500">Expired/Cancelled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm" onClick={fetchVendors}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              {tab}
              <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs">
                {tab === "ALL" ? stats.total : tab === "EXPIRED" ? stats.expired : stats[tab.toLowerCase() as keyof typeof stats] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Vendors Table */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading subscriptions...</p>
            </CardContent>
          </Card>
        ) : filteredVendors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No vendors found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vendor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Trial Ends</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {vendor.businessName.charAt(0)}
                              </span>
                            </div>
                            <p className="font-medium text-gray-900">{vendor.businessName}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{vendor.user.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={statusColors[vendor.subscriptionStatus] || "default"}>
                            {vendor.subscriptionStatus}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {vendor.trialEndsAt ? formatDate(vendor.trialEndsAt) : "-"}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(vendor.createdAt)}</td>
                        <td className="py-3 px-4 text-right">
                          <Link href={`/admin/vendors/${vendor.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}

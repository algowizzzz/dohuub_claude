"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, Ban, CheckCircle, Crown, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/utils";

const statusColors: Record<string, "success" | "warning" | "error" | "default"> = {
  ACTIVE: "success",
  PENDING_REVIEW: "warning",
  REVIEW: "warning",
  SUSPENDED: "error",
  DRAFT: "default",
};

const categoryColors: Record<string, string> = {
  CLEANING: "bg-blue-100 text-blue-800",
  HANDYMAN: "bg-orange-100 text-orange-800",
  BEAUTY: "bg-pink-100 text-pink-800",
  GROCERIES: "bg-green-100 text-green-800",
  RENTALS: "bg-purple-100 text-purple-800",
  CAREGIVING: "bg-red-100 text-red-800",
};

type ListingRow = {
  id: string;
  category: string;
  status: string;
  title?: string;
  name?: string;
  vendor?: { id: string; businessName: string; isMichelle: boolean };
  basePrice?: number;
  price?: number;
  pricePerNight?: number | null;
  createdAt?: string;
};

export default function AdminListingsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/vendors/all-listings");
      setListings(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch listings:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load listings",
        variant: "destructive",
      });
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = useMemo(() => listings.filter((listing: any) => {
    const title = (listing.title || listing.name || "").toString();
    const vendorName = listing.vendor?.businessName || "";
    const matchesSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      vendorName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "ALL" || listing.category === categoryFilter;
    const matchesStatus = statusFilter === "ALL" || listing.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [listings, search, categoryFilter, statusFilter]);

  const getPrice = (listing: any) => {
    if (listing.basePrice != null) return listing.basePrice;
    if (listing.pricePerNight != null) return listing.pricePerNight;
    if (listing.price != null) return listing.price;
    return 0;
  };

  return (
    <PortalLayout title="All Listings" subtitle="Review and moderate platform listings">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search listings or vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="CLEANING">Cleaning</option>
            <option value="HANDYMAN">Handyman</option>
            <option value="BEAUTY">Beauty</option>
            <option value="GROCERIES">Groceries</option>
            <option value="RENTALS">Rentals</option>
            <option value="CAREGIVING">Caregiving</option>
          </select>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchListings} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-2xl font-bold">{listings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-success">
                {listings.filter((l) => l.status === "ACTIVE").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-2xl font-bold text-warning">
                {listings.filter((l) => l.status === "PENDING_REVIEW" || l.status === "REVIEW").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Suspended</p>
              <p className="text-2xl font-bold text-error">
                {listings.filter((l) => l.status === "SUSPENDED").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">DoHuub Official</p>
              <p className="text-2xl font-bold text-secondary">
                {listings.filter((l: any) => l.vendor?.isMichelle).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listings Table */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading listings...</p>
            </CardContent>
          </Card>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No listings found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Listing</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredListings.map((listing: any) => {
                      const title = listing.title || listing.name || "(Untitled)";
                      return (
                        <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {listing.vendor?.isMichelle && <Crown className="h-4 w-4 text-secondary" />}
                              <div>
                                <p className="font-medium text-gray-900">{title}</p>
                                <p className="text-sm text-gray-500">{listing.vendor?.businessName || "-"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[listing.category] || ""}`}>
                              {listing.category}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant={statusColors[listing.status] || "default"}>
                              {String(listing.status).replace("_", " ")}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 font-medium">{formatCurrency(getPrice(listing))}</td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" disabled>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" disabled>
                                <CheckCircle className="h-4 w-4 text-gray-300" />
                              </Button>
                              <Button variant="ghost" size="sm" disabled>
                                <Ban className="h-4 w-4 text-gray-300" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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


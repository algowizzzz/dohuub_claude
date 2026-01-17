"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit2, Trash2, Eye, MoreVertical, Loader2, RefreshCw } from "lucide-react";
import api, { ENDPOINTS } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";

interface Listing {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  category: string;
  basePrice?: number;
  pricePerNight?: number;
  hourlyRate?: number;
  status: string;
  images?: string[];
  createdAt?: string;
}

const statusColors: Record<string, "success" | "warning" | "error"> = {
  ACTIVE: "success",
  PAUSED: "warning",
  DRAFT: "error",
  INACTIVE: "error",
};

const categoryEmoji: Record<string, string> = {
  CLEANING: "🧹",
  HANDYMAN: "🔧",
  BEAUTY: "💅",
  RENTALS: "🏠",
  CAREGIVING: "❤️",
  GROCERIES: "🛒",
};

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const { toast } = useToast();

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${ENDPOINTS.VENDORS}/listings`);
      setListings(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch listings:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load listings",
        variant: "destructive",
      });
      // Fallback to empty array
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const getListingTitle = (listing: Listing) => listing.title || listing.name || "Untitled";

  const handleDelete = async (listing: Listing) => {
    if (!confirm(`Are you sure you want to delete "${getListingTitle(listing)}"?`)) return;

    try {
      const endpoint = getListingEndpoint(listing.category);
      await api.delete(`${endpoint}/${listing.id}`);
      toast({
        title: "Deleted",
        description: "Listing deleted successfully",
      });
      fetchListings();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to delete listing",
        variant: "destructive",
      });
    }
  };

  const getListingEndpoint = (category: string) => {
    const endpoints: Record<string, string> = {
      CLEANING: "/cleaning",
      HANDYMAN: "/handyman",
      BEAUTY: "/beauty",
      RENTALS: "/rentals",
      CAREGIVING: "/caregiving",
      GROCERIES: "/groceries",
    };
    return endpoints[category] || "/cleaning";
  };

  const getListingPrice = (listing: Listing) => {
    return listing.basePrice || listing.pricePerNight || listing.hourlyRate || 0;
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = getListingTitle(listing).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "ALL" || listing.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <PortalLayout title="My Listings" subtitle="Manage your service offerings">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PAUSED">Paused</option>
              <option value="DRAFT">Draft</option>
            </select>
            <Button variant="outline" size="sm" onClick={fetchListings}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <Link href="/vendor/listings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Listing
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Listings</p>
              <p className="text-2xl font-bold">{listings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {listings.filter((l) => l.status === "ACTIVE").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Paused</p>
              <p className="text-2xl font-bold text-yellow-600">
                {listings.filter((l) => l.status === "PAUSED").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Draft</p>
              <p className="text-2xl font-bold text-gray-600">
                {listings.filter((l) => l.status === "DRAFT").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Listings Grid */}
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
              <p className="text-gray-500">
                {listings.length === 0
                  ? "You don't have any listings yet"
                  : "No listings match your search"}
              </p>
              <Link href="/vendor/listings/new">
                <Button className="mt-4">Create Your First Listing</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  {/* Image placeholder */}
                  <div className="h-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-t-xl flex items-center justify-center">
                    {listing.images && listing.images[0] ? (
                      <img
                        src={listing.images[0]}
                        alt={getListingTitle(listing)}
                        className="w-full h-full object-cover rounded-t-xl"
                      />
                    ) : (
                      <span className="text-4xl">{categoryEmoji[listing.category] || "📦"}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{getListingTitle(listing)}</h3>
                        <p className="text-sm text-gray-500">{listing.category}</p>
                      </div>
                      <Badge variant={statusColors[listing.status] || "warning"}>
                        {listing.status}
                      </Badge>
                    </div>
                    <p className="text-xl font-bold text-primary mb-4">
                      ${getListingPrice(listing).toFixed(2)}
                    </p>
                    {listing.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Link
                        href={`/vendor/listings/${listing.id}/edit?category=${listing.category}`}
                        className="flex-1"
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(listing)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

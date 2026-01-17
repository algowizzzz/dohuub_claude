"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Star, Package, ShoppingBag, Ban, CheckCircle, Loader2, Globe, CreditCard } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import api, { ENDPOINTS } from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/components/ui/toaster";

interface VendorDetail {
  id: string;
  businessName: string;
  description?: string;
  logo?: string;
  coverImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  isMichelle: boolean;
  subscriptionStatus: string;
  trialStartedAt?: string;
  trialEndsAt?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  user: {
    id: string;
    email: string;
    phone?: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  serviceAreas: Array<{ city: string; state: string }>;
  listings: {
    cleaning: number;
    handyman: number;
    beauty: number;
    groceries: number;
    rentals: number;
    caregiving: number;
  };
  _count?: {
    bookings: number;
    reviews: number;
  };
}

const subscriptionColors: Record<string, "success" | "warning" | "error" | "secondary" | "default"> = {
  TRIAL: "warning",
  ACTIVE: "success",
  PAUSED: "secondary",
  EXPIRED: "error",
  CANCELLED: "error",
};

export default function VendorDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchVendor = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`${ENDPOINTS.VENDORS}/${params.id}/admin`);
        setVendor(response.data.data);
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
        setVendor(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchVendor();
    }
  }, [params.id]);

  const toggleSuspendStatus = async () => {
    if (!vendor) return;
    setIsUpdating(true);
    try {
      await api.put(`${ENDPOINTS.VENDORS}/${vendor.id}/status`, {
        isActive: !vendor.isActive,
      });
      toast({
        title: vendor.isActive ? "Vendor Suspended" : "Vendor Reactivated",
        description: `${vendor.businessName} has been ${vendor.isActive ? "suspended" : "reactivated"} successfully`,
      });
      setVendor({ ...vendor, isActive: !vendor.isActive });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update vendor status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <PortalLayout title="Vendor Details" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </PortalLayout>
    );
  }

  if (!vendor) {
    return (
      <PortalLayout title="Vendor Details" subtitle="Not found">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Vendor not found</p>
            <Link href="/admin/vendors">
              <Button className="mt-4">Back to Vendors</Button>
            </Link>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  const totalListings = Object.values(vendor.listings).reduce((sum, count) => sum + count, 0);

  return (
    <PortalLayout title="Vendor Details" subtitle={vendor.businessName}>
      <div className="space-y-6">
        <Link href="/admin/vendors" className="inline-flex items-center text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Vendors
        </Link>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="h-24 w-24 rounded-xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-3xl">
                  {vendor.businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">{vendor.businessName}</h2>
                      {vendor.isMichelle && (
                        <Badge className="bg-blue-600">DoHuub Official</Badge>
                      )}
                    </div>
                    <p className="text-gray-500 mt-1">{vendor.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={vendor.isActive ? "success" : "error"}>
                      {vendor.isActive ? "Active" : "Suspended"}
                    </Badge>
                    <Badge variant={subscriptionColors[vendor.subscriptionStatus] || "default"}>
                      {vendor.subscriptionStatus}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                    <span className="text-gray-500">({vendor.reviewCount} reviews)</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {vendor.contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{vendor.contactEmail}</span>
                    </div>
                  )}
                  {vendor.contactPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{vendor.contactPhone}</span>
                    </div>
                  )}
                  {vendor.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {vendor.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant={vendor.isActive ? "outline" : "default"}
                    onClick={toggleSuspendStatus}
                    disabled={isUpdating}
                    className={vendor.isActive ? "text-red-600 border-red-200 hover:bg-red-50" : ""}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : vendor.isActive ? (
                      <Ban className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {vendor.isActive ? "Suspend Vendor" : "Reactivate Vendor"}
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Owner Info */}
        <Card>
          <CardHeader>
            <CardTitle>Business Owner</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">
                  {vendor.user.profile?.firstName?.charAt(0) || vendor.user.email.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">
                  {vendor.user.profile
                    ? `${vendor.user.profile.firstName} ${vendor.user.profile.lastName}`
                    : vendor.user.email.split("@")[0]}
                </p>
                <p className="text-sm text-gray-500">{vendor.user.email}</p>
                {vendor.user.phone && (
                  <p className="text-sm text-gray-500">{vendor.user.phone}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-2xl font-bold">{totalListings}</p>
              <p className="text-sm text-gray-500">Total Listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-2xl font-bold">{vendor._count?.bookings || 0}</p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-2xl font-bold">{vendor._count?.reviews || vendor.reviewCount}</p>
              <p className="text-sm text-gray-500">Reviews Received</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-6 w-6 mx-auto text-gray-400 mb-2" />
              <p className="text-2xl font-bold">{formatDate(vendor.createdAt).split(",")[0]}</p>
              <p className="text-sm text-gray-500">Member Since</p>
            </CardContent>
          </Card>
        </div>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium">{vendor.subscriptionStatus} Subscription</p>
                  {vendor.trialEndsAt && (
                    <p className="text-sm text-gray-500">Trial ends {formatDate(vendor.trialEndsAt)}</p>
                  )}
                </div>
              </div>
              <Badge variant={subscriptionColors[vendor.subscriptionStatus] || "default"} className="text-sm">
                {vendor.subscriptionStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        {vendor.serviceAreas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Service Areas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {vendor.serviceAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>
                      {area.city && area.state ? `${area.city}, ${area.state}` : (area as any).name || "Service Area"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listings by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(vendor.listings).map(([category, count]) => (
                <div key={category} className="p-4 border rounded-lg text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-gray-500 capitalize">{category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}

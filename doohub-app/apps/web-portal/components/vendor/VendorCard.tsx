"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, MapPin, Package, Star, Calendar, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface VendorCardProps {
  vendor: {
    id: string;
    businessName: string;
    logo?: string | null;
    status: "ACTIVE" | "SUSPENDED";
    subscriptionStatus: string;
    category?: string;
    regions?: string[];
    joinedAt: string;
    listingCount?: number;
    rating?: number;
    reviewCount?: number;
    trialEndsAt?: string | null;
  };
  onSuspend?: (vendorId: string) => void;
  onUnsuspend?: (vendorId: string) => void;
  isUpdating?: boolean;
}

export function VendorCard({ vendor, onSuspend, onUnsuspend, isUpdating }: VendorCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return { dot: "#10B981", text: "#10B981" };
      case "SUSPENDED":
        return { dot: "#DC2626", text: "#DC2626" };
      case "TRIAL":
        return { dot: "#3B82F6", text: "#3B82F6" };
      default:
        return { dot: "#9CA3AF", text: "#9CA3AF" };
    }
  };

  const statusColors = getStatusColor(vendor.status);
  const isTrialActive = vendor.subscriptionStatus === "TRIAL";
  const isSuspended = vendor.status === "SUSPENDED";

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (!vendor.trialEndsAt) return null;
    const daysRemaining = Math.ceil(
      (new Date(vendor.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysRemaining);
  };

  const trialDaysRemaining = getTrialDaysRemaining();

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row bg-white border rounded-2xl p-5 lg:p-6 mb-5 transition-all duration-200",
        isHovered
          ? "border-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.08)] -translate-y-0.5"
          : "border-gray-200"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Section */}
      <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden">
          {vendor.logo ? (
            <img
              src={vendor.logo}
              alt={vendor.businessName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <Link
            href={`/admin/vendors/${vendor.id}`}
            className="text-lg lg:text-xl font-bold text-gray-900 hover:text-blue-600 hover:underline transition-colors"
          >
            {vendor.businessName}
          </Link>

          {/* Status Badge */}
          <div className="flex items-center gap-1.5 ml-4">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: statusColors.dot }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: statusColors.text }}
            >
              {vendor.status}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {/* Category */}
          {vendor.category && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">🏷️</span>
              <span className="text-gray-900 font-medium">{vendor.category}</span>
            </div>
          )}

          {/* Subscription/Trial */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {isTrialActive ? (
              <>
                <span className="text-base">⏱️</span>
                <span className="text-gray-900 font-medium">
                  Trial: {trialDaysRemaining} days left
                </span>
              </>
            ) : (
              <>
                <span className="text-base">💳</span>
                <span className="text-gray-900 font-medium">
                  {vendor.subscriptionStatus || "No Plan"}
                </span>
              </>
            )}
          </div>

          {/* Regions */}
          {vendor.regions && vendor.regions.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">📍</span>
              <span className="text-gray-900 font-medium">
                {vendor.regions.length <= 2
                  ? vendor.regions.join(", ")
                  : `${vendor.regions.length} regions`}
              </span>
            </div>
          )}

          {/* Joined Date */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-base">📅</span>
            <span className="text-gray-900 font-medium">
              {formatDate(vendor.joinedAt)}
            </span>
          </div>

          {/* Listings Count */}
          {vendor.listingCount !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">📦</span>
              <span className="text-gray-900 font-medium">
                {vendor.listingCount} listings
              </span>
            </div>
          )}

          {/* Rating */}
          {vendor.rating !== undefined && vendor.rating > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">⭐</span>
              <span className="text-gray-900 font-medium">
                {vendor.rating.toFixed(1)} ({vendor.reviewCount || 0})
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full sm:w-auto">
          <Link href={`/admin/vendors/${vendor.id}`} className="flex-1 sm:flex-none">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>

          {!isSuspended ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-red-100 text-red-600 hover:bg-red-50"
              onClick={() => onSuspend?.(vendor.id)}
              disabled={isUpdating}
            >
              Suspend
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-green-100 text-green-600 hover:bg-green-50"
              onClick={() => onUnsuspend?.(vendor.id)}
              disabled={isUpdating}
            >
              Unsuspend
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Eye, AlertTriangle, Flag, Loader2, RefreshCw } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/components/ui/toaster";

const reasonLabels: Record<string, string> = {
  MISLEADING: "Misleading Information",
  NO_SHOW: "No Show",
  POOR_QUALITY: "Poor Quality",
  FRAUD: "Fraud/Scam",
  INAPPROPRIATE: "Inappropriate Behavior",
  OTHER: "Other",
};

const statusColors: Record<string, "warning" | "default" | "success" | "error"> = {
  PENDING: "warning",
  IN_REVIEW: "default",
  RESOLVED: "success",
  DISMISSED: "error",
};

interface ReportRow {
  id: string;
  reason: string;
  description?: string;
  status: "PENDING" | "IN_REVIEW" | "RESOLVED" | "DISMISSED" | "REVIEWED";
  createdAt: string;
  resolution?: string;
  reporter: { id: string; email: string; profile?: { firstName: string; lastName: string } };
  listing?: { id: string; title: string; category: string; vendor: { id: string; businessName: string } };
}

export default function ReportsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/reports");
      setReports(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch reports:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load reports",
        variant: "destructive",
      });
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => reports.filter((report) => {
    const listingTitle = report.listing?.title || "";
    const vendorName = report.listing?.vendor.businessName || "";
    const reporterName = report.reporter.profile
      ? `${report.reporter.profile.firstName} ${report.reporter.profile.lastName}`
      : report.reporter.email;
    const matchesSearch =
      listingTitle.toLowerCase().includes(search.toLowerCase()) ||
      vendorName.toLowerCase().includes(search.toLowerCase()) ||
      reporterName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  }), [reports, search, statusFilter]);

  const pendingCount = reports.filter((r) => r.status === "PENDING").length;

  return (
    <PortalLayout title="Reports & Moderation" subtitle="Review and handle user reports">
      <div className="space-y-6">
        {/* Alert for pending reports */}
        {pendingCount > 0 && (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning-600" />
            <div>
              <p className="font-medium text-warning-800">
                {pendingCount} report{pendingCount > 1 ? "s" : ""} require{pendingCount === 1 ? "s" : ""} attention
              </p>
              <p className="text-sm text-warning-600">Please review and take appropriate action</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          <Button variant="outline" size="sm" onClick={fetchReports} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Reports List */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading reports...</p>
            </CardContent>
          </Card>
        ) : filteredReports.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No reports found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const reporterName = report.reporter.profile
                ? `${report.reporter.profile.firstName} ${report.reporter.profile.lastName}`
                : report.reporter.email.split("@")[0];
              const listingTitle = report.listing?.title || "Listing";
              const listingVendor = report.listing?.vendor.businessName || "Unknown Vendor";

              return (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-error-50 flex items-center justify-center">
                              <Flag className="h-5 w-5 text-error" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{report.id}</span>
                                <Badge variant={statusColors[report.status] || "default"}>
                                  {report.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">{formatDateTime(report.createdAt)}</p>
                            </div>
                          </div>
                          <Link href={`/admin/reports/${report.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </Link>
                        </div>

                        {/* Listing Info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm text-gray-500 mb-1">Reported Listing</p>
                          <p className="font-medium text-gray-900">{listingTitle}</p>
                          <p className="text-sm text-gray-600">by {listingVendor}</p>
                        </div>

                        {/* Report Details */}
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500">Reason</p>
                            <p className="font-medium text-gray-900">{reasonLabels[report.reason] || report.reason}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Description</p>
                            <p className="text-gray-700">{report.description || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Reported by</p>
                            <p className="font-medium text-gray-900">{reporterName}</p>
                            <p className="text-sm text-gray-600">{report.reporter.email}</p>
                          </div>
                          {report.resolution && (
                            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                              <p className="text-sm text-gray-500">Resolution</p>
                              <p className="font-medium text-gray-900">{report.resolution}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}


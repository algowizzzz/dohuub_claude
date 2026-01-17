"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, User, Flag, Calendar, MessageSquare, CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
import { formatDate, formatDateTime } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/components/ui/toaster";

interface Report {
  id: string;
  reason: string;
  description?: string;
  status: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  reporter: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
  listing?: {
    id: string;
    title: string;
    category: string;
    vendor: {
      id: string;
      businessName: string;
    };
  };
  targetUser?: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

const statusColors: Record<string, "warning" | "secondary" | "success" | "error"> = {
  PENDING: "warning",
  REVIEWED: "secondary",
  RESOLVED: "success",
  DISMISSED: "error",
};

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/reports/${params.id}`);
        setReport(response.data.data);
      } catch (err) {
        console.error("Failed to fetch report:", err);
        // Mock data
        setReport({
          id: params.id as string,
          reason: "INAPPROPRIATE_CONTENT",
          description: "This listing contains misleading information about pricing and services offered. The actual service provided does not match what is described.",
          status: "PENDING",
          createdAt: "2026-01-10T14:30:00Z",
          reporter: {
            id: "user-1",
            email: "demo-customer@doohub.com",
            profile: { firstName: "Sarah", lastName: "Johnson" },
          },
          listing: {
            id: "listing-1",
            title: "Premium Deep Cleaning",
            category: "CLEANING",
            vendor: {
              id: "vendor-1",
              businessName: "QuickClean Services",
            },
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  const handleResolve = async (action: "RESOLVED" | "DISMISSED") => {
    if (!report) return;
    setIsUpdating(true);
    try {
      await api.put(`/reports/${report.id}`, {
        status: action,
        resolution: resolution || (action === "DISMISSED" ? "Report dismissed after review" : "Listing has been removed"),
      });
      toast({
        title: action === "RESOLVED" ? "Report Resolved" : "Report Dismissed",
        description: `Report has been ${action.toLowerCase()} successfully`,
      });
      router.push("/admin/reports");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update report",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <PortalLayout title="Report Details" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </PortalLayout>
    );
  }

  if (!report) {
    return (
      <PortalLayout title="Report Details" subtitle="Not found">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Report not found</p>
            <Link href="/admin/reports">
              <Button className="mt-4">Back to Reports</Button>
            </Link>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  const reporterName = report.reporter.profile
    ? `${report.reporter.profile.firstName} ${report.reporter.profile.lastName}`
    : report.reporter.email.split("@")[0];

  return (
    <PortalLayout title="Report Details" subtitle={`Report #${report.id.slice(0, 8)}`}>
      <div className="space-y-6">
        <Link href="/admin/reports" className="inline-flex items-center text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Link>

        {/* Status Banner */}
        {report.status === "PENDING" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Action Required</p>
                <p className="text-sm text-yellow-600">This report is pending review and requires moderation action.</p>
              </div>
            </div>
          </div>
        )}

        {/* Report Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Report Information</CardTitle>
              <Badge variant={statusColors[report.status]} className="text-sm">
                {report.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="font-medium">{report.reason.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reported On</p>
                <p className="font-medium">{formatDateTime(report.createdAt)}</p>
              </div>
            </div>

            {report.description && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{report.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reporter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Reporter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">
                    {reporterName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{reporterName}</p>
                  <p className="text-sm text-gray-500">{report.reporter.email}</p>
                </div>
              </div>
              <Link href={`/admin/customers/${report.reporter.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Reported Listing */}
        {report.listing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Reported Listing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-lg">{report.listing.title}</p>
                  <p className="text-sm text-gray-500">
                    {report.listing.category} • By {report.listing.vendor.businessName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/vendors/${report.listing.vendor.id}`}>
                    <Button variant="outline" size="sm">View Vendor</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resolution */}
        {report.status === "PENDING" ? (
          <Card>
            <CardHeader>
              <CardTitle>Take Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resolution Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Add notes about your decision..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleResolve("RESOLVED")}
                  disabled={isUpdating}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Remove Listing
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleResolve("DISMISSED")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Dismiss Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Resolution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={statusColors[report.status]}>{report.status}</Badge>
                  {report.resolvedAt && (
                    <span className="text-sm text-gray-500">
                      on {formatDate(report.resolvedAt)}
                    </span>
                  )}
                </div>
                {report.resolution && (
                  <p className="text-gray-700">{report.resolution}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}

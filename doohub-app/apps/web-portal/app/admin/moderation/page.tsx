"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, Ban } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";

interface ListingReport {
  id: string;
  listingName: string;
  vendorId: string;
  vendorName: string;
  customerName: string;
  reportReason: string;
  reportExplanation: string;
  reportedAt: string;
}

// Mock data - Only listing reports
const mockReports: ListingReport[] = [
  {
    id: "1",
    listingName: "Deep Cleaning Service",
    vendorId: "V001",
    vendorName: "CleanCo Services",
    customerName: "John D.",
    reportReason: "Service Not As Described",
    reportExplanation:
      "Service advertised as 3-hour deep clean. Vendor left after 90 minutes, many areas not cleaned as promised. When questioned, claimed 3 hours is 'maximum' not standard. Very disappointed.",
    reportedAt: "2026-01-03",
  },
  {
    id: "2",
    listingName: "Professional Plumbing Repair",
    vendorId: "V002",
    vendorName: "QuickFix Pro",
    customerName: "Maria S.",
    reportReason: "Safety Concerns",
    reportExplanation:
      "The vendor did not follow proper safety protocols. No protective equipment was used and water was left running after the job, causing minor flooding in my basement.",
    reportedAt: "2026-01-02",
  },
  {
    id: "3",
    listingName: "Home Beauty Services",
    vendorId: "V003",
    vendorName: "Glam Squad Mobile",
    customerName: "Sarah K.",
    reportReason: "Misleading Pricing",
    reportExplanation:
      "Listing showed $50 for haircut but was charged $120 at completion. Hidden fees were not disclosed upfront. This is deceptive pricing.",
    reportedAt: "2025-12-28",
  },
];

function ReportCard({
  report,
  onIgnore,
  onSuspend
}: {
  report: ListingReport;
  onIgnore: () => void;
  onSuspend: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 mb-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{report.reportReason}</h3>
            <p className="text-sm text-gray-500">
              Reported {new Date(report.reportedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-500 mb-1">Listing</p>
          <p className="text-sm font-semibold text-gray-900">{report.listingName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Vendor</p>
          <Link
            href={`/admin/vendors/${report.vendorId}`}
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            {report.vendorName}
          </Link>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Reported by</p>
          <p className="text-sm font-semibold text-gray-900">{report.customerName}</p>
        </div>
      </div>

      {/* Report Explanation */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Explanation:</p>
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg">
          <p className="text-sm text-gray-600">{report.reportExplanation}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
        <Button
          size="sm"
          variant="outline"
          onClick={onIgnore}
        >
          <X className="w-4 h-4 mr-2" />
          Ignore
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600 border-red-200 hover:bg-red-50"
          onClick={onSuspend}
        >
          <Ban className="w-4 h-4 mr-2" />
          Suspend Vendor
        </Button>
      </div>
    </div>
  );
}

export default function ModerationPage() {
  const [reports, setReports] = useState<ListingReport[]>(mockReports);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<"ignore" | "suspend" | null>(null);
  const [selectedReport, setSelectedReport] = useState<ListingReport | null>(null);

  const handleAction = (report: ListingReport, action: "ignore" | "suspend") => {
    setSelectedReport(report);
    setActionType(action);
    setShowActionModal(true);
  };

  const confirmAction = () => {
    if (selectedReport) {
      // Remove the report from the list
      setReports((prev) => prev.filter((r) => r.id !== selectedReport.id));
    }
    setShowActionModal(false);
    setSelectedReport(null);
    setActionType(null);
  };

  return (
    <PortalLayout title="Reported Listings" subtitle="Review customer reports and take action">
      {/* Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <p className="text-sm font-semibold text-gray-900">
            {reports.length} {reports.length === 1 ? "Report" : "Reports"} Pending Review
          </p>
        </div>
      </div>

      {/* Report Cards */}
      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No reports to review</p>
          </CardContent>
        </Card>
      ) : (
        <div>
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onIgnore={() => handleAction(report, "ignore")}
              onSuspend={() => handleAction(report, "suspend")}
            />
          ))}
        </div>
      )}

      {/* Action Confirmation Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" ? "Suspend Vendor?" : "Ignore Report?"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend"
                ? `This will suspend ${selectedReport?.vendorName}'s account. All their listings will be hidden and they won't be able to accept new bookings.`
                : "This will dismiss the report and no action will be taken."}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button
              className={actionType === "suspend" ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={confirmAction}
            >
              {actionType === "suspend" ? "Suspend Vendor" : "Ignore Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}

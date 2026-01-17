"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Calendar, Download, Edit, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  downloadUrl: string;
}

export default function VendorSubscriptionManagementPage() {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Mock subscription data
  const subscription = {
    plan: "Yearly Plan",
    status: "Active",
    amount: 470,
    billing: "yearly",
    nextBillingDate: "March 15, 2026",
    trialEndsDate: null,
    paymentMethod: {
      type: "Visa",
      last4: "4242",
      expiryDate: "12/28",
    },
  };

  const features = [
    "Unlimited service listings",
    "Real-time order management",
    "Payment processing included",
  ];

  const invoices: Invoice[] = [
    {
      id: "INV-2026-001",
      date: "Jan 15, 2026",
      amount: 470,
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: "INV-2025-012",
      date: "Dec 15, 2025",
      amount: 470,
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: "INV-2025-011",
      date: "Nov 15, 2025",
      amount: 470,
      status: "Paid",
      downloadUrl: "#",
    },
  ];

  const handleChangePlan = () => {
    router.push("/vendor/change-plan");
  };

  const handleUpdatePayment = () => {
    router.push("/vendor/update-payment");
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    console.log("Subscription cancelled. Reason:", cancelReason);
    setShowCancelModal(false);
    setCancelReason("");
  };

  return (
    <PortalLayout title="Subscription" subtitle="Manage your subscription, billing, and payment methods">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* Current Plan Overview */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Current Plan</h2>
                  <p className="text-sm text-gray-500">
                    Your subscription details and billing information
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                {subscription.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Plan Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Plan Type
                </p>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {subscription.plan}
                </p>
                <p className="text-sm text-gray-500">
                  ${subscription.amount}/{subscription.billing === "yearly" ? "year" : "month"}
                </p>
              </div>

              {/* Next Billing */}
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Next Billing Date
                </p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.nextBillingDate}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Auto-renews on this date
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-gray-50 rounded-xl p-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Payment Method
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <p className="text-base font-semibold text-gray-900">
                    {subscription.paymentMethod.type} **** {subscription.paymentMethod.last4}
                  </p>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Expires {subscription.paymentMethod.expiryDate}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleChangePlan}>
                Change Plan
              </Button>
              <Button onClick={handleUpdatePayment} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button
                onClick={handleCancelSubscription}
                variant="outline"
                className="text-red-600 hover:text-red-600 hover:bg-red-50 border-red-200"
              >
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Plan Features */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              What's Included in Your Plan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-800" />
                  </div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Billing History
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-200 last:border-0">
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-500">{invoice.date}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-semibold text-gray-900">
                          ${invoice.amount.toFixed(2)}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : invoice.status === "Pending"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {invoice.status === "Paid" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          )}
                          {invoice.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {invoice.id}
                      </p>
                      <p className="text-xs text-gray-500">{invoice.date}</p>
                    </div>
                    <Badge
                      className={
                        invoice.status === "Paid"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : invoice.status === "Pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {invoice.status === "Paid" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                      )}
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(invoice.downloadUrl, "_blank")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your subscription? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cancelReason" className="mb-2">
              Reason for Cancellation
            </Label>
            <textarea
              id="cancelReason"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 min-h-[100px]"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Tell us why you're leaving..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Subscription
            </Button>
            <Button
              onClick={handleConfirmCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}

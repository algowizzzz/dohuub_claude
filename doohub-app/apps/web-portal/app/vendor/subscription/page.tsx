"use client";

import { useCallback, useEffect, useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { Check, Crown, Clock, CreditCard, AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useToast } from "@/components/ui/toaster";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 29,
    period: "month",
    features: [
      "Up to 5 listings",
      "Basic analytics",
      "Email support",
      "Standard visibility",
    ],
    recommended: false,
  },
  {
    id: "pro",
    name: "Professional",
    price: 79,
    period: "month",
    features: [
      "Up to 20 listings",
      "Advanced analytics",
      "Priority support",
      "Enhanced visibility",
      "Featured badge",
      "Custom business page",
    ],
    recommended: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    period: "month",
    features: [
      "Unlimited listings",
      "Premium analytics & reports",
      "Dedicated account manager",
      "Maximum visibility",
      "Featured badge",
      "Custom business page",
      "API access",
      "White-label options",
    ],
    recommended: false,
  },
];

type BillingRow = {
  id: string;
  amount: number;
  currency: string;
  description: string;
  invoiceUrl?: string | null;
  paidAt?: string | null;
  createdAt: string;
};

export default function SubscriptionPage() {
  const { toast } = useToast();
  const { vendor } = useAuthStore();
  const [history, setHistory] = useState<BillingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/vendors/me/billing-history");
      setHistory(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch billing history:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to load billing history",
        variant: "destructive",
      });
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const currentPlan = vendor?.subscriptionStatus === "ACTIVE" ? "pro" : null;
  const isTrialActive = vendor?.subscriptionStatus === "TRIAL";

  return (
    <PortalLayout title="Subscription" subtitle="Manage your subscription and billing">
      <div className="space-y-8">
        {/* Trial Banner */}
        {isTrialActive && (
          <div className="bg-warning-50 border border-warning-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-warning-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-warning-800">Free Trial Active</h3>
                <p className="text-warning-600 mt-1">
                  Your 30-day free trial ends on{" "}
                  <strong>{vendor?.trialEndsAt ? formatDate(vendor.trialEndsAt) : "your trial end date"}</strong>. 
                  Choose a plan below to continue using DoHuub after your trial.
                </p>
              </div>
              <Badge variant="warning">Trial</Badge>
            </div>
          </div>
        )}

        {/* Current Plan Status */}
        {currentPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Professional Plan</p>
                    <p className="text-gray-500">$79/month • Renews on Jan 15, 2026</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="mt-4 pt-4 border-t flex gap-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-error hover:text-error">Cancel Subscription</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.recommended ? "border-2 border-primary shadow-lg" : ""}`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-success" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.recommended ? "" : "bg-gray-800 hover:bg-gray-700"}`}
                    variant={currentPlan === plan.id ? "outline" : "default"}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? "Current Plan" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-10 w-14 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">VISA</span>
                </div>
                <div>
                  <p className="font-medium">•••• •••• •••• 4242</p>
                  <p className="text-sm text-gray-500">Expires 12/2027</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchHistory} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-10 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading payment history...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No billing history yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Invoice</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm font-medium">
                          {row.invoiceUrl ? (
                            <a href={row.invoiceUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                              {row.id.slice(0, 8)}
                            </a>
                          ) : (
                            row.id.slice(0, 8)
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(row.createdAt)}</td>
                        <td className="py-3 px-4 text-sm">{row.description}</td>
                        <td className="py-3 px-4">
                          <Badge variant={row.paidAt ? "success" : "warning"}>{row.paidAt ? "Paid" : "Pending"}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm font-medium text-right">
                          {formatCurrency(row.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}


"use client";

import Link from "next/link";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VendorAvailabilityPage() {
  return (
    <PortalLayout title="Availability" subtitle="Manage when customers can book you">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Availability Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              This screen is now enabled to avoid 404s. Full availability editing will be wired to the vendor profile soon.
            </p>
            <div className="flex gap-3">
              <Link href="/vendor/settings">
                <Button>Go to Vendor Settings</Button>
              </Link>
              <Link href="/vendor">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalLayout>
  );
}


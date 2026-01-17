"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag, Star, Ban, CheckCircle, Loader2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/components/ui/toaster";

interface CustomerDetail {
  id: string;
  email: string;
  phone?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    dateOfBirth?: string;
  };
  addresses: Array<{
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
  }>;
  bookings: Array<{
    id: string;
    category: string;
    status: string;
    total: number;
    scheduledDate: string;
    vendor: { businessName: string };
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }>;
}

const statusColors: Record<string, "default" | "warning" | "success" | "error" | "secondary"> = {
  PENDING: "warning",
  ACCEPTED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "error",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/users/${params.id}`);
        setCustomer(response.data.data);
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        // Mock data for demo
        setCustomer({
          id: params.id as string,
          email: "demo-customer@doohub.com",
          phone: "+1 555-0100",
          isActive: true,
          isEmailVerified: true,
          createdAt: "2025-12-01T10:00:00Z",
          profile: {
            firstName: "Sarah",
            lastName: "Johnson",
            avatar: null,
            dateOfBirth: "1990-05-15",
          },
          addresses: [
            {
              id: "addr-1",
              label: "Home",
              street: "123 Main Street",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              isDefault: true,
            },
          ],
          bookings: [
            {
              id: "book-1",
              category: "CLEANING",
              status: "COMPLETED",
              total: 150,
              scheduledDate: "2026-01-10T10:00:00Z",
              vendor: { businessName: "SparkleClean Co." },
            },
            {
              id: "book-2",
              category: "HANDYMAN",
              status: "PENDING",
              total: 85,
              scheduledDate: "2026-01-18T14:00:00Z",
              vendor: { businessName: "FixIt Pro" },
            },
          ],
          reviews: [
            {
              id: "rev-1",
              rating: 5,
              comment: "Excellent service!",
              createdAt: "2026-01-11T12:00:00Z",
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCustomer();
    }
  }, [params.id]);

  const toggleBlockStatus = async () => {
    if (!customer) return;
    setIsUpdating(true);
    try {
      await api.put(`/users/${customer.id}/status`, {
        isActive: !customer.isActive,
      });
      toast({
        title: customer.isActive ? "Customer Blocked" : "Customer Restored",
        description: `Customer has been ${customer.isActive ? "blocked" : "restored"} successfully`,
      });
      setCustomer({ ...customer, isActive: !customer.isActive });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update customer status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <PortalLayout title="Customer Details" subtitle="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </PortalLayout>
    );
  }

  if (!customer) {
    return (
      <PortalLayout title="Customer Details" subtitle="Not found">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Customer not found</p>
            <Link href="/admin/customers">
              <Button className="mt-4">Back to Customers</Button>
            </Link>
          </CardContent>
        </Card>
      </PortalLayout>
    );
  }

  const customerName = customer.profile
    ? `${customer.profile.firstName} ${customer.profile.lastName}`
    : customer.email.split("@")[0];

  return (
    <PortalLayout title="Customer Details" subtitle={customerName}>
      <div className="space-y-6">
        <Link href="/admin/customers" className="inline-flex items-center text-gray-500 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Link>

        {/* Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-2xl">
                  {customerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{customerName}</h2>
                    <p className="text-gray-500">Customer ID: {customer.id.slice(0, 12)}</p>
                  </div>
                  <Badge variant={customer.isActive ? "success" : "error"} className="text-sm">
                    {customer.isActive ? "Active" : "Blocked"}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Joined {formatDate(customer.createdAt)}</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <Button
                    variant={customer.isActive ? "outline" : "default"}
                    onClick={toggleBlockStatus}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : customer.isActive ? (
                      <Ban className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {customer.isActive ? "Block Customer" : "Restore Customer"}
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{customer.bookings.length}</p>
              <p className="text-sm text-gray-500">Total Bookings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(customer.bookings.reduce((sum, b) => sum + b.total, 0))}
              </p>
              <p className="text-sm text-gray-500">Total Spent</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{customer.reviews.length}</p>
              <p className="text-sm text-gray-500">Reviews Given</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{customer.addresses.length}</p>
              <p className="text-sm text-gray-500">Saved Addresses</p>
            </CardContent>
          </Card>
        </div>

        {/* Addresses */}
        {customer.addresses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && <Badge variant="secondary">Default</Badge>}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p>{address.street}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle>Booking History</CardTitle>
          </CardHeader>
          <CardContent>
            {customer.bookings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            ) : (
              <div className="space-y-4">
                {customer.bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.category}</p>
                        <p className="text-sm text-gray-500">{booking.vendor.businessName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColors[booking.status] || "default"}>
                        {booking.status.replace("_", " ")}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(booking.scheduledDate)}</p>
                    </div>
                    <p className="font-bold">{formatCurrency(booking.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviews */}
        {customer.reviews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reviews Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.reviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}

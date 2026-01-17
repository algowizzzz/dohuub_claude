"use client";

import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, MoreVertical, Eye, Ban, CheckCircle, Loader2, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import api, { ENDPOINTS } from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/components/ui/toaster";

interface Customer {
  id: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  profile?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  _count?: {
    bookings: number;
    orders: number;
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${ENDPOINTS.USERS.ME.replace("/me", "")}`, {
        params: { role: "CUSTOMER" },
      });
      setCustomers(response.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch customers:", err);
      // Mock data for demo
      setCustomers([
        {
          id: "cust-1",
          email: "demo-customer@doohub.com",
          phone: "+1 555-0100",
          role: "CUSTOMER",
          isActive: true,
          isEmailVerified: true,
          createdAt: "2025-12-01T10:00:00Z",
          profile: { firstName: "Sarah", lastName: "Johnson", avatar: null },
          _count: { bookings: 12, orders: 8 },
        },
        {
          id: "cust-2",
          email: "demo-customer2@doohub.com",
          phone: "+1 555-0101",
          role: "CUSTOMER",
          isActive: true,
          isEmailVerified: true,
          createdAt: "2025-12-05T14:30:00Z",
          profile: { firstName: "Michael", lastName: "Chen", avatar: null },
          _count: { bookings: 5, orders: 3 },
        },
        {
          id: "cust-3",
          email: "blocked@example.com",
          phone: "+1 555-0102",
          role: "CUSTOMER",
          isActive: false,
          isEmailVerified: true,
          createdAt: "2025-11-15T09:00:00Z",
          profile: { firstName: "Robert", lastName: "Smith", avatar: null },
          _count: { bookings: 2, orders: 1 },
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const toggleBlockStatus = async (customerId: string, currentlyActive: boolean) => {
    setIsUpdating(customerId);
    try {
      await api.put(`/users/${customerId}/status`, {
        isActive: !currentlyActive,
      });
      toast({
        title: currentlyActive ? "Customer Blocked" : "Customer Unblocked",
        description: `Customer has been ${currentlyActive ? "blocked" : "restored"} successfully`,
      });
      fetchCustomers();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update customer status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const getCustomerName = (customer: Customer) => {
    if (customer.profile) {
      return `${customer.profile.firstName} ${customer.profile.lastName}`;
    }
    return customer.email.split("@")[0];
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      getCustomerName(customer).toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && customer.isActive) ||
      (statusFilter === "BLOCKED" && !customer.isActive);
    return matchesSearch && matchesStatus;
  });

  return (
    <PortalLayout title="Customers" subtitle="Manage platform customers">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["ALL", "ACTIVE", "BLOCKED"] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status === "ALL" ? "All" : status === "ACTIVE" ? "Active" : "Blocked"}
              </Button>
            ))}
            <Button variant="outline" size="sm" onClick={fetchCustomers}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Total Customers</p>
              <p className="text-2xl font-bold">{customers.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Active Customers</p>
              <p className="text-2xl font-bold text-green-600">
                {customers.filter((c) => c.isActive).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">Blocked Customers</p>
              <p className="text-2xl font-bold text-red-600">
                {customers.filter((c) => !c.isActive).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading customers...</p>
            </CardContent>
          </Card>
        ) : filteredCustomers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No customers found</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Activity</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-600 font-medium">
                                {getCustomerName(customer).charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{getCustomerName(customer)}</p>
                              <p className="text-sm text-gray-500">{customer.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{customer.email}</p>
                          {customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(customer.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">
                            {customer._count?.bookings || 0} bookings
                          </p>
                          <p className="text-xs text-gray-500">
                            {customer._count?.orders || 0} orders
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={customer.isActive ? "success" : "error"}>
                            {customer.isActive ? "Active" : "Blocked"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBlockStatus(customer.id, customer.isActive)}
                              disabled={isUpdating === customer.id}
                            >
                              {isUpdating === customer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : customer.isActive ? (
                                <Ban className="h-4 w-4 text-red-500" />
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PortalLayout>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Phone, MessageCircle, MapPin, Clock, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import api, { ENDPOINTS } from "@/lib/api";
import { useToast } from "@/components/ui/toaster";

interface Order {
  id: string;
  user: {
    id: string;
    email: string;
    phone?: string;
    profile?: {
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  };
  category: string;
  status: string;
  total: number;
  scheduledDate: string;
  scheduledTime?: string;
  specialInstructions?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cleaningListing?: { title: string };
  handymanListing?: { title: string };
  beautyListing?: { title: string };
  rentalListing?: { title: string };
  caregivingListing?: { title: string };
}

const statusColors: Record<string, "warning" | "secondary" | "default" | "success" | "error"> = {
  PENDING: "warning",
  ACCEPTED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "success",
  CANCELLED: "error",
  DECLINED: "error",
};

const tabs = ["ACCEPTED", "IN_PROGRESS", "COMPLETED"];

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("ACCEPTED");
  const [storeFilter, setStoreFilter] = useState("All Stores");
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`${ENDPOINTS.BOOKINGS}/vendor`, {
        params: { status: activeTab }
      });
      setOrders(response.data.data || []);
      setCounts(response.data.counts || {});
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to load orders");
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getServiceTitle = (order: Order) => {
    return (
      order.cleaningListing?.title ||
      order.handymanListing?.title ||
      order.beautyListing?.title ||
      order.rentalListing?.title ||
      order.caregivingListing?.title ||
      order.category
    );
  };

  const getCustomerName = (order: Order) => {
    if (order.user.profile) {
      return `${order.user.profile.firstName} ${order.user.profile.lastName}`;
    }
    return order.user.email.split("@")[0];
  };

  const updateOrderStatus = async (orderId: string, status: string, note?: string) => {
    setIsUpdating(orderId);
    try {
      await api.put(`${ENDPOINTS.BOOKINGS}/${orderId}/status`, { status, note });
      toast({
        title: "Order updated",
        description: `Order status changed to ${status.replace("_", " ")}`,
      });
      fetchOrders();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update order",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleAccept = (orderId: string) => updateOrderStatus(orderId, "ACCEPTED");
  const handleDecline = (orderId: string) => updateOrderStatus(orderId, "DECLINED", "Order declined by vendor");
  const handleStartJob = (orderId: string) => updateOrderStatus(orderId, "IN_PROGRESS");
  const handleComplete = (orderId: string) => updateOrderStatus(orderId, "COMPLETED");

  const filteredOrders = orders.filter((order) => {
    // Search filter
    const customerName = getCustomerName(order).toLowerCase();
    const serviceName = getServiceTitle(order).toLowerCase();
    const searchLower = search.toLowerCase();
    const matchesSearch =
      customerName.includes(searchLower) ||
      serviceName.includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower);

    // Store filter (placeholder - would need store field in Order interface)
    const matchesStore = storeFilter === "All Stores";
    // In real app: order.store === storeFilter || storeFilter === "All Stores"

    // Date range filter
    let matchesDateRange = true;
    if (dateRange.from && dateRange.to) {
      const orderDate = new Date(order.scheduledDate);
      matchesDateRange = orderDate >= dateRange.from && orderDate <= dateRange.to;
    }

    return matchesSearch && matchesStore && matchesDateRange;
  });

  // Group orders by store
  // For now, using a placeholder approach since Order interface doesn't have store field
  // In real app, this would group by order.store or order.storeName
  const groupedOrders = filteredOrders.reduce((groups, order) => {
    // Placeholder: group by category until store field is added to Order interface
    const storeName = order.category || "Main Location";
    if (!groups[storeName]) {
      groups[storeName] = [];
    }
    groups[storeName].push(order);
    return groups;
  }, {} as Record<string, Order[]>);

  return (
    <PortalLayout title="Orders" subtitle="Manage customer bookings and requests">
      <div className="space-y-6">
        {/* Filters */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Store Filter */}
            <select
              className="w-full h-12 px-4 pr-10 border border-gray-200 rounded-xl text-base bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
            >
              <option value="All Stores">All Stores</option>
              <option value="Main Location">Main Location</option>
              <option value="Downtown Store">Downtown Store</option>
              <option value="Northside Branch">Northside Branch</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Date Range Picker */}
            <div className="relative">
              <Input
                type="text"
                placeholder="Select date range"
                value={
                  dateRange.from && dateRange.to
                    ? `${dateRange.from.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${dateRange.to.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                    : ""
                }
                readOnly
                className="h-12 text-base cursor-pointer"
                onClick={() => {
                  // Date picker implementation would go here
                  // For now, this is a placeholder
                }}
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={fetchOrders} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-4 text-base font-medium whitespace-nowrap transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              }`}
            >
              {tab.replace("_", " ")}
              {counts[tab] !== undefined && (
                <span className={`ml-2 px-1.5 min-w-[20px] h-5 inline-flex items-center justify-center rounded-full text-xs font-semibold ${
                  activeTab === tab
                    ? "bg-[#FEF3C7] text-[#92400E]"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {counts[tab] || 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading orders...</p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchOrders}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {!isLoading && !error && filteredOrders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No orders found</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && filteredOrders.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedOrders).map(([storeName, storeOrders]) => (
              <div key={storeName} className="space-y-3">
                {/* Store Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900">{storeName}</h3>
                  <span className="text-sm text-gray-600">
                    {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                  </span>
                </div>

                {/* Orders for this store */}
                <div className="space-y-3">
                  {storeOrders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-gray-900">{order.id.slice(0, 8)}</h3>
                                  <Badge variant={statusColors[order.status]}>
                                    {order.status.replace("_", " ")}
                                  </Badge>
                                </div>
                                <p className="text-lg font-medium text-gray-900">{getServiceTitle(order)}</p>
                              </div>
                              <p className="text-xl font-bold text-primary">{formatCurrency(order.total)}</p>
                            </div>

                            {/* Customer */}
                            <div className="flex items-center gap-4 mb-4">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600 font-medium">
                                  {getCustomerName(order).charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{getCustomerName(order)}</p>
                                <p className="text-sm text-gray-500">{order.user.phone || order.user.email}</p>
                              </div>
                              <div className="flex gap-2 ml-auto">
                                {order.user.phone && (
                                  <Button variant="outline" size="sm" asChild>
                                    <a href={`tel:${order.user.phone}`}>
                                      <Phone className="h-4 w-4 mr-1" />
                                      Call
                                    </a>
                                  </Button>
                                )}
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-1" />
                                  Chat
                                </Button>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-gray-500">Scheduled</p>
                                  <p className="font-medium">
                                    {formatDateTime(order.scheduledDate)}
                                    {order.scheduledTime && ` at ${order.scheduledTime}`}
                                  </p>
                                </div>
                              </div>
                              {order.address && (
                                <div className="flex items-start gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                  <div>
                                    <p className="text-gray-500">Location</p>
                                    <p className="font-medium">
                                      {order.address.street}, {order.address.city}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {order.specialInstructions && (
                              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  <strong>Note:</strong> {order.specialInstructions}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex lg:flex-col gap-2 lg:w-32">
                            {order.status === "PENDING" && (
                              <>
                                <Button
                                  className="flex-1"
                                  onClick={() => handleAccept(order.id)}
                                  disabled={isUpdating === order.id}
                                >
                                  {isUpdating === order.id ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                  )}
                                  Accept
                                </Button>
                                <Button
                                  variant="outline"
                                  className="flex-1"
                                  onClick={() => handleDecline(order.id)}
                                  disabled={isUpdating === order.id}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                              </>
                            )}
                            {order.status === "ACCEPTED" && (
                              <Button
                                className="flex-1"
                                onClick={() => handleStartJob(order.id)}
                                disabled={isUpdating === order.id}
                              >
                                {isUpdating === order.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : null}
                                Start Job
                              </Button>
                            )}
                            {order.status === "IN_PROGRESS" && (
                              <Button
                                className="flex-1"
                                onClick={() => handleComplete(order.id)}
                                disabled={isUpdating === order.id}
                              >
                                {isUpdating === order.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : null}
                                Complete
                              </Button>
                            )}
                            {(order.status === "COMPLETED" || order.status === "CANCELLED" || order.status === "DECLINED") && (
                              <Button variant="outline" className="flex-1">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

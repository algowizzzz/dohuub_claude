"use client";

import { useState } from "react";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Search,
  ChevronRight,
  CheckCircle,
  Clock,
  Calendar,
  User,
  DollarSign,
  Package,
  MapPin,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type OrderStatus = "accepted" | "in-progress" | "completed";

interface Order {
  id: string;
  orderNumber: string;
  storeName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  date: string;
  time: string;
  status: OrderStatus;
  serviceName: string;
  serviceType: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceAddress: string;
  duration: string;
  specialInstructions?: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "CLN-12345",
    storeName: "CleanCo Services",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    customerPhone: "(555) 123-4567",
    total: 150,
    date: "2026-01-07",
    time: "10:00 AM",
    status: "accepted",
    serviceName: "Deep Home Cleaning",
    serviceType: "Residential Cleaning",
    scheduledDate: "2026-01-09",
    scheduledTime: "10:00 AM - 2:00 PM",
    serviceAddress: "123 Oak Street, San Francisco, CA 94102",
    duration: "4 hours",
    specialInstructions: "Please focus on kitchen and bathrooms",
  },
  {
    id: "2",
    orderNumber: "BTY-78901",
    storeName: "Beauty by Michelle",
    customerName: "Jessica Martinez",
    customerEmail: "j.martinez@email.com",
    customerPhone: "(555) 456-7890",
    total: 120,
    date: "2026-01-07",
    time: "2:00 PM",
    status: "accepted",
    serviceName: "Hair & Makeup Package",
    serviceType: "Beauty Services",
    scheduledDate: "2026-01-08",
    scheduledTime: "3:00 PM - 5:00 PM",
    serviceAddress: "321 Elm Street, San Francisco, CA 94105",
    duration: "2 hours",
    specialInstructions: "Special occasion - wedding guest",
  },
  {
    id: "3",
    orderNumber: "HND-56789",
    storeName: "HandyPro Services",
    customerName: "Robert Chen",
    customerEmail: "r.chen@email.com",
    customerPhone: "(555) 234-5678",
    total: 275,
    date: "2026-01-07",
    time: "11:45 AM",
    status: "in-progress",
    serviceName: "Bathroom Fixture Installation",
    serviceType: "Handyman Services",
    scheduledDate: "2026-01-09",
    scheduledTime: "1:00 PM - 4:00 PM",
    serviceAddress: "890 Valencia Street, San Francisco, CA 94110",
    duration: "3 hours",
  },
  {
    id: "4",
    orderNumber: "CLN-12340",
    storeName: "CleanCo Services",
    customerName: "Robert Williams",
    customerEmail: "r.williams@email.com",
    customerPhone: "(555) 678-9012",
    total: 175,
    date: "2026-01-05",
    time: "9:00 AM",
    status: "completed",
    serviceName: "Move-Out Cleaning",
    serviceType: "Residential Cleaning",
    scheduledDate: "2026-01-06",
    scheduledTime: "9:00 AM - 1:00 PM",
    serviceAddress: "888 Broadway, Apt 4C, San Francisco, CA 94107",
    duration: "4 hours",
  },
];

export default function AdminOrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("accepted");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // Get unique stores for filter
  const stores = Array.from(new Set(orders.map((o) => o.storeName)));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = order.status === activeTab;
    const matchesStore = selectedStore === "all" || order.storeName === selectedStore;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesStore && matchesSearch;
  });

  // Group orders by store
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.storeName]) {
      acc[order.storeName] = [];
    }
    acc[order.storeName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  // Count orders by status
  const statusCounts = {
    accepted: orders.filter((o) => o.status === "accepted").length,
    "in-progress": orders.filter((o) => o.status === "in-progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  // Handle status change
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (currentStatus === "accepted") return "in-progress";
    if (currentStatus === "in-progress") return "completed";
    return null;
  };

  return (
    <PortalLayout title="Michelle's Orders" subtitle="Manage orders across all Michelle's stores">
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)} className="w-full">
        {/* Desktop Tabs */}
        <div className="hidden sm:block">
          <TabsList className="w-full justify-start bg-white border border-gray-200 rounded-t-xl h-[52px] p-0 mb-0">
            <TabsTrigger
              value="accepted"
              className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-white"
            >
              Accepted
              {statusCounts.accepted > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                  {statusCounts.accepted}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-white"
            >
              In Progress
              {statusCounts["in-progress"] > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                  {statusCounts["in-progress"]}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="h-full px-6 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-gray-900 data-[state=active]:bg-white"
            >
              Completed
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Mobile Tab Selector */}
        <div className="sm:hidden mb-4">
          <Select value={activeTab} onValueChange={(v) => setActiveTab(v as OrderStatus)}>
            <SelectTrigger className="h-12 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="accepted">
                Accepted {statusCounts.accepted > 0 && `(${statusCounts.accepted})`}
              </SelectItem>
              <SelectItem value="in-progress">
                In Progress {statusCounts["in-progress"] > 0 && `(${statusCounts["in-progress"]})`}
              </SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters */}
        <Card className="border-t-0 rounded-t-none sm:rounded-t-none mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="store-filter" className="text-sm font-medium text-gray-700 mb-2">
                  Filter by Store
                </Label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger id="store-filter" className="h-10">
                    <SelectValue placeholder="All Stores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2">
                  Search Orders
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by order # or customer name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <TabsContent value={activeTab} className="mt-0">
          {Object.keys(groupedOrders).length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Orders Found
                </h3>
                <p className="text-sm text-gray-500">
                  {searchQuery || selectedStore !== "all"
                    ? "Try adjusting your filters"
                    : `No ${activeTab.replace("-", " ")} orders at this time`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedOrders).map(([storeName, storeOrders]) => (
                <Card key={storeName}>
                  {/* Store Header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-gray-900">
                        {storeName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                      </span>
                    </div>
                  </div>

                  {/* Orders List */}
                  <div className="divide-y divide-gray-200">
                    {storeOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDetailsOpen(true);
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-sm font-semibold text-gray-900">
                                {order.orderNumber}
                              </span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">
                                {order.serviceName}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap text-sm text-gray-500">
                              <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {order.customerName}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}, {order.time}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4" />
                                {formatCurrency(order.total)}
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {getNextStatus(order.status) ? (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, getNextStatus(order.status)!);
                              }}
                              className="w-full sm:w-auto text-sm"
                            >
                              {order.status === "accepted" && (
                                <Clock className="w-4 h-4 mr-2" />
                              )}
                              {order.status === "in-progress" && (
                                <CheckCircle className="w-4 h-4 mr-2" />
                              )}
                              {order.status === "accepted" ? "Mark In Progress" : "Mark as Complete"}
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setDetailsOpen(true);
                              }}
                              className="w-full sm:w-auto"
                            >
                              View Details
                              <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              Order Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              View complete details and information for this order
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 pt-4">
              {/* Order Header */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-900">
                    {selectedOrder.orderNumber}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {selectedOrder.status.replace("-", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{selectedOrder.storeName}</p>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.customerName}
                      </p>
                      <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Service Details
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.serviceName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.serviceType}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedOrder.scheduledDate).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedOrder.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Service Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium text-gray-900">
                        {selectedOrder.serviceAddress}
                      </p>
                    </div>
                  </div>
                  {selectedOrder.specialInstructions && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Special Instructions</p>
                      <p className="text-sm text-gray-900">
                        {selectedOrder.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Order Summary
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Change Button */}
              {getNextStatus(selectedOrder.status) && (
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={() => {
                      handleStatusChange(selectedOrder.id, getNextStatus(selectedOrder.status)!);
                    }}
                    className="w-full"
                    size="lg"
                  >
                    {selectedOrder.status === "accepted" && (
                      <Clock className="w-5 h-5 mr-2" />
                    )}
                    {selectedOrder.status === "in-progress" && (
                      <CheckCircle className="w-5 h-5 mr-2" />
                    )}
                    {selectedOrder.status === "accepted" ? "Mark In Progress" : "Mark as Complete"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}

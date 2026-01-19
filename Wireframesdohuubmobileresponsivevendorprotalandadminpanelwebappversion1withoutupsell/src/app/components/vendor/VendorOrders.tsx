import { useState } from "react";
import { Search, User, Calendar, DollarSign, Package, Clock, Check, ChevronRight } from "lucide-react";
import { parseISO, isWithinInterval } from "date-fns";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { VendorOrderDetailModal } from "./VendorOrderDetailModal";
import { DateRangePicker, DateRange } from "../ui/date-range-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type OrderStatus = "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ServiceDetails {
  service: string;
  category: string;
  scheduledDate: string;
  time: string;
  duration: string;
  serviceAddress: string;
  specialInstructions: string;
}

interface DeliveryDetails {
  items: OrderItem[];
  deliveryAddress: string;
  deliveryWindow: string;
  specialInstructions: string;
}

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
  itemCount?: number;
  type: "service" | "delivery";
  serviceDetails?: ServiceDetails;
  deliveryDetails?: DeliveryDetails;
}

export function VendorOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== "undefined" && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const [activeTab, setActiveTab] = useState<OrderStatus>("ACCEPTED");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Mock orders data - 9 entries, one for each category
  const [orders] = useState<Order[]>([
    // Cleaning Service (Accepted)
    {
      id: "1",
      orderNumber: "CLN-12345",
      storeName: "CleanCo Services",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "(555) 123-4567",
      total: 150.0,
      date: "2026-01-08",
      time: "10:00 AM",
      status: "ACCEPTED",
      serviceName: "Deep Home Cleaning",
      type: "service",
      serviceDetails: {
        service: "Deep Home Cleaning",
        category: "Residential Cleaning",
        scheduledDate: "January 8, 2026",
        time: "10:00 AM - 2:00 PM",
        duration: "4 hours",
        serviceAddress: "123 Oak Street, San Francisco, CA 94102",
        specialInstructions: "Please focus on kitchen and bathrooms",
      },
    },
    // Beauty Service (Accepted)
    {
      id: "2",
      orderNumber: "BTY-78901",
      storeName: "Beauty by Michelle",
      customerName: "Jessica Martinez",
      customerEmail: "j.martinez@email.com",
      customerPhone: "(555) 456-7890",
      total: 120.0,
      date: "2026-01-07",
      time: "3:00 PM",
      status: "ACCEPTED",
      serviceName: "Hair & Makeup Package",
      type: "service",
      serviceDetails: {
        service: "Hair & Makeup Package",
        category: "Beauty Services",
        scheduledDate: "January 7, 2026",
        time: "3:00 PM - 5:00 PM",
        duration: "2 hours",
        serviceAddress: "321 Elm Street, San Francisco, CA 94105",
        specialInstructions: "Special occasion – wedding guest",
      },
    },
    // Groceries (Accepted)
    {
      id: "3",
      orderNumber: "GRO-45678",
      storeName: "Fresh Market",
      customerName: "Emily Rodriguez",
      customerEmail: "emily.r@email.com",
      customerPhone: "(555) 345-6789",
      total: 89.5,
      date: "2026-01-08",
      time: "2:00 PM",
      status: "ACCEPTED",
      serviceName: "Grocery Delivery",
      itemCount: 5,
      type: "delivery",
      deliveryDetails: {
        items: [
          { name: "Organic Apples (2lb)", quantity: 1, price: 8.99 },
          { name: "Fresh Salmon Fillet", quantity: 2, price: 24.99 },
          { name: "Whole Grain Bread", quantity: 1, price: 5.99 },
          { name: "Greek Yogurt (6-pack)", quantity: 1, price: 7.99 },
          { name: "Mixed Salad Greens", quantity: 2, price: 6.99 },
        ],
        deliveryAddress: "789 Pine Avenue, San Francisco, CA 94104",
        deliveryWindow: "2:00 PM - 4:00 PM",
        specialInstructions: "Please leave at front door if no answer",
      },
    },
    // Handyman (In Progress)
    {
      id: "4",
      orderNumber: "HND-23456",
      storeName: "Handyman Services",
      customerName: "Michael Brown",
      customerEmail: "m.brown@email.com",
      customerPhone: "(555) 234-5678",
      total: 200.0,
      date: "2026-01-07",
      time: "9:00 AM",
      status: "IN_PROGRESS",
      serviceName: "Bathroom Faucet Repair",
      type: "service",
      serviceDetails: {
        service: "Bathroom Faucet Repair",
        category: "Handyman Services",
        scheduledDate: "January 7, 2026",
        time: "9:00 AM - 11:00 AM",
        duration: "2 hours",
        serviceAddress: "456 Downtown St, San Francisco, CA 94103",
        specialInstructions: "Leaking faucet in master bathroom",
      },
    },
    // Ride Assistance (In Progress)
    {
      id: "5",
      orderNumber: "RDE-89012",
      storeName: "Safe Rides Transport",
      customerName: "Robert Wilson",
      customerEmail: "r.wilson@email.com",
      customerPhone: "(555) 567-8901",
      total: 35.0,
      date: "2026-01-07",
      time: "11:30 AM",
      status: "IN_PROGRESS",
      serviceName: "Medical Appointment Transport",
      type: "service",
      serviceDetails: {
        service: "Medical Appointment Transport",
        category: "Ride Assistance",
        scheduledDate: "January 7, 2026",
        time: "11:30 AM - 1:00 PM",
        duration: "1.5 hours",
        serviceAddress: "Pick-up: 789 Market St, Drop-off: Medical Center",
        specialInstructions: "Patient requires wheelchair assistance",
      },
    },
    // Companionship (In Progress)
    {
      id: "6",
      orderNumber: "CMP-34567",
      storeName: "Caring Companions",
      customerName: "Linda Davis",
      customerEmail: "l.davis@email.com",
      customerPhone: "(555) 678-9012",
      total: 85.0,
      date: "2026-01-07",
      time: "2:00 PM",
      status: "IN_PROGRESS",
      serviceName: "Afternoon Companionship",
      type: "service",
      serviceDetails: {
        service: "Afternoon Companionship",
        category: "Companionship Support",
        scheduledDate: "January 7, 2026",
        time: "2:00 PM - 5:00 PM",
        duration: "3 hours",
        serviceAddress: "234 Sunset Blvd, San Francisco, CA 94122",
        specialInstructions: "Light conversation, reading, and assistance with puzzles",
      },
    },
    // Rental Property (Completed)
    {
      id: "7",
      orderNumber: "RNT-67890",
      storeName: "Prime Rentals",
      customerName: "James Taylor",
      customerEmail: "j.taylor@email.com",
      customerPhone: "(555) 789-0123",
      total: 2500.0,
      date: "2026-01-05",
      time: "10:00 AM",
      status: "COMPLETED",
      serviceName: "Monthly Apartment Rental",
      type: "service",
      serviceDetails: {
        service: "Monthly Apartment Rental",
        category: "Rental Properties",
        scheduledDate: "January 5, 2026",
        time: "10:00 AM - 11:00 AM",
        duration: "1 hour (viewing)",
        serviceAddress: "567 Bay Street, Apt 3B, San Francisco, CA 94111",
        specialInstructions: "First month plus deposit paid",
      },
    },
    // Food Delivery (Completed)
    {
      id: "8",
      orderNumber: "FOOD-12309",
      storeName: "Downtown Delivery",
      customerName: "Amanda Chen",
      customerEmail: "a.chen@email.com",
      customerPhone: "(555) 890-1234",
      total: 45.75,
      date: "2026-01-06",
      time: "7:00 PM",
      status: "COMPLETED",
      serviceName: "Restaurant Delivery",
      itemCount: 3,
      type: "delivery",
      deliveryDetails: {
        items: [
          { name: "Chicken Tikka Masala", quantity: 1, price: 16.99 },
          { name: "Garlic Naan (2pc)", quantity: 1, price: 4.99 },
          { name: "Mango Lassi", quantity: 2, price: 5.99 },
        ],
        deliveryAddress: "890 Mission Street, San Francisco, CA 94110",
        deliveryWindow: "7:00 PM - 7:30 PM",
        specialInstructions: "Please ring doorbell twice",
      },
    },
    // Beauty Products (Completed)
    {
      id: "9",
      orderNumber: "BPR-56789",
      storeName: "Beauty Essentials",
      customerName: "Sophie Anderson",
      customerEmail: "s.anderson@email.com",
      customerPhone: "(555) 901-2345",
      total: 127.50,
      date: "2026-01-05",
      time: "3:00 PM",
      status: "COMPLETED",
      serviceName: "Beauty Products Order",
      itemCount: 4,
      type: "delivery",
      deliveryDetails: {
        items: [
          { name: "Hydrating Face Serum", quantity: 1, price: 45.0 },
          { name: "Vitamin C Moisturizer", quantity: 1, price: 38.0 },
          { name: "Eye Cream", quantity: 1, price: 28.5 },
          { name: "Face Mask Set (3pc)", quantity: 1, price: 16.0 },
        ],
        deliveryAddress: "123 Valencia Street, San Francisco, CA 94107",
        deliveryWindow: "3:00 PM - 5:00 PM",
        specialInstructions: "Leave package with building concierge",
      },
    },
  ]);

  // Get unique stores
  const stores = Array.from(new Set(orders.map((order) => order.storeName)));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = order.status === activeTab;
    const matchesStore =
      selectedStore === "all" || order.storeName === selectedStore;
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range filtering
    let matchesDateRange = true;
    if (dateRange?.from) {
      const orderDate = parseISO(order.date);
      if (dateRange.to) {
        matchesDateRange = isWithinInterval(orderDate, {
          start: dateRange.from,
          end: dateRange.to,
        });
      } else {
        // Only start date selected
        matchesDateRange = orderDate >= dateRange.from;
      }
    }

    return matchesStatus && matchesStore && matchesSearch && matchesDateRange;
  });

  // Group orders by store name
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.storeName]) {
      acc[order.storeName] = [];
    }
    acc[order.storeName].push(order);
    return acc;
  }, {} as Record<string, Order[]>);

  const getCountsByStatus = () => {
    return {
      ACCEPTED: orders.filter((o) => o.status === "ACCEPTED").length,
      IN_PROGRESS: orders.filter((o) => o.status === "IN_PROGRESS").length,
      COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    };
  };

  const counts = getCountsByStatus();

  const handleMarkInProgress = (orderId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Handle mark in progress logic
    console.log("Mark in progress:", orderId);
  };

  return (
    <div className="min-h-screen bg-white">
      <VendorTopNav onMenuClick={handleSidebarToggle} vendorName="John Smith" />
      <VendorSidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => {
          if (typeof window !== "undefined" && window.innerWidth >= 1024) {
            setSidebarCollapsed(!sidebarCollapsed);
          } else {
            setSidebarOpen(false);
          }
        }}
        activeMenu="orders"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[280px]"}
        `}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              My Orders
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Manage orders across all your stores
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white border border-[#E5E7EB] rounded-t-2xl">
            <div className="flex border-b border-[#E5E7EB]">
              <button
                onClick={() => setActiveTab("ACCEPTED")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "ACCEPTED"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  Accepted
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "ACCEPTED"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.ACCEPTED}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("IN_PROGRESS")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "IN_PROGRESS"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  In Progress
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "IN_PROGRESS"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.IN_PROGRESS}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setActiveTab("COMPLETED")}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-4 text-sm font-semibold transition-colors relative ${
                  activeTab === "COMPLETED"
                    ? "text-[#1F2937] border-b-2 border-[#1F2937] -mb-[1px]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                <span className="flex items-center gap-2">
                  Completed
                  <span
                    className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold ${
                      activeTab === "COMPLETED"
                        ? "bg-[#FEF3C7] text-[#92400E]"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {counts.COMPLETED}
                  </span>
                </span>
              </button>
            </div>

            {/* Filters */}
            <div className="p-6 pb-4 border-b border-[#E5E7EB] flex flex-col sm:flex-row gap-4">
              {/* Store Filter */}
              <div className="w-full sm:w-[240px]">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Filter by Store
                </label>
                <Select value={selectedStore} onValueChange={setSelectedStore}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
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

              {/* Search */}
              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Search Orders
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type="text"
                    placeholder="Search by order # or customer name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Date Range Picker */}
              <div className="w-full sm:w-[240px]">
                <label className="block text-xs font-semibold text-[#6B7280] mb-2">
                  Filter by Date
                </label>
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                />
              </div>
            </div>

            {/* Orders Content */}
            <div className="p-6">
              {Object.keys(groupedOrders).length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
                  <p className="text-[#6B7280]">No orders found</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {Object.entries(groupedOrders).map(([storeName, storeOrders]) => (
                    <div key={storeName}>
                      {/* Store Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-[#1F2937]">
                          {storeName}
                        </h3>
                        <span className="text-sm text-[#6B7280]">
                          {storeOrders.length} {storeOrders.length === 1 ? "order" : "orders"}
                        </span>
                      </div>

                      {/* Orders List */}
                      <div className="space-y-3">
                        {storeOrders.map((order) => (
                          <div
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white border border-[#E5E7EB] rounded-xl p-4 hover:border-[#9CA3AF] transition-colors cursor-pointer"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                              {/* Order Info */}
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                {/* Order Number & Service */}
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-semibold text-[#1F2937]">
                                      {order.orderNumber}
                                    </p>
                                    <span className="text-[#D1D5DB]">•</span>
                                    <p className="text-sm text-[#6B7280] truncate">
                                      {order.serviceName}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-[#6B7280] flex-wrap">
                                    {/* Customer */}
                                    <div className="flex items-center gap-1.5">
                                      <User className="w-4 h-4" />
                                      <span>{order.customerName}</span>
                                    </div>
                                    {/* Date & Time */}
                                    <div className="flex items-center gap-1.5">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {new Date(order.date).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}, {order.time}
                                      </span>
                                    </div>
                                    {/* Price */}
                                    <div className="flex items-center gap-1.5">
                                      <DollarSign className="w-4 h-4" />
                                      <span className="font-semibold text-[#1F2937]">
                                        ${order.total.toFixed(2)}
                                      </span>
                                    </div>
                                    {/* Item Count (if applicable) */}
                                    {order.itemCount && (
                                      <div className="flex items-center gap-1.5">
                                        <Package className="w-4 h-4" />
                                        <span>{order.itemCount} items</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              {activeTab === "ACCEPTED" && (
                                <Button
                                  onClick={(e) => handleMarkInProgress(order.id, e)}
                                  className="bg-[#1F2937] hover:bg-[#111827] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Mark In Progress</span>
                                  <span className="sm:hidden">In Progress</span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                              {activeTab === "IN_PROGRESS" && (
                                <Button
                                  onClick={(e) => handleMarkInProgress(order.id, e)}
                                  className="bg-[#1F2937] hover:bg-[#111827] text-white h-10 px-4 shrink-0 w-full sm:w-auto text-sm"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  <span className="hidden sm:inline">Mark as Complete</span>
                                  <span className="sm:hidden">Complete</span>
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Order Detail Modal */}
      <VendorOrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onMarkInProgress={() => {
          if (selectedOrder) {
            handleMarkInProgress(selectedOrder.id);
            setSelectedOrder(null);
          }
        }}
      />
    </div>
  );
}
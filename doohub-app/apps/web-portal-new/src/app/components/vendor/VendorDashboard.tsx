import { useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Plus,
  Eye,
  User,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { VendorSidebar } from "./VendorSidebar";
import { VendorTopNav } from "./VendorTopNav";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export function VendorDashboard() {
  const navigate = useNavigate();
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

  // Mock data
  const stats = {
    earnings: 2450.0,
    orders: 34,
    listings: 8,
  };

  const recentOrders = [
    {
      id: "1",
      orderNumber: "ORD-12345",
      storeName: "John's Cleaning",
      customerName: "Sarah Johnson",
      total: 150.0,
      date: "2026-01-07",
      time: "10:00 AM",
      status: "ACCEPTED" as const,
    },
    {
      id: "2",
      orderNumber: "ORD-12344",
      storeName: "John's Handyman",
      customerName: "Michael Chen",
      total: 275.0,
      date: "2026-01-07",
      time: "9:30 AM",
      status: "IN_PROGRESS" as const,
    },
    {
      id: "3",
      orderNumber: "ORD-12343",
      storeName: "John's Cleaning",
      customerName: "Emily Davis",
      total: 120.0,
      date: "2026-01-06",
      time: "2:00 PM",
      status: "IN_PROGRESS" as const,
    },
    {
      id: "4",
      orderNumber: "ORD-12342",
      storeName: "John's Handyman",
      customerName: "David Wilson",
      total: 350.0,
      date: "2026-01-06",
      time: "11:00 AM",
      status: "COMPLETED" as const,
    },
    {
      id: "5",
      orderNumber: "ORD-12341",
      storeName: "John's Cleaning",
      customerName: "Lisa Anderson",
      total: 180.0,
      date: "2026-01-05",
      time: "3:00 PM",
      status: "COMPLETED" as const,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-[#DBEAFE] text-[#1E40AF]";
      case "IN_PROGRESS":
        return "bg-[#FEF3C7] text-[#92400E]";
      case "COMPLETED":
        return "bg-[#D1FAE5] text-[#065F46]";
      default:
        return "bg-[#F3F4F6] text-[#6B7280]";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
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
        activeMenu="overview"
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-[28px] lg:text-[32px] font-bold text-[#1F2937] mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-sm sm:text-[15px] text-[#6B7280]">
              Here's what's happening with your business today
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Earnings */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-[#065F46]" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#059669] bg-[#D1FAE5] px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-semibold">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-[#1F2937]">
                  ${stats.earnings.toLocaleString()}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-[#1E40AF]" />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#1E40AF] bg-[#DBEAFE] px-2 py-1 rounded-lg">
                  <TrendingUp className="w-3 h-3" />
                  <span className="font-semibold">+8%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Total Orders</p>
                <p className="text-2xl font-bold text-[#1F2937]">{stats.orders}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">This month</p>
              </div>
            </div>

            {/* Active Listings */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#92400E]" />
                </div>
                <div className="w-8 h-8"></div>
              </div>
              <div>
                <p className="text-sm text-[#6B7280] mb-1">Active Listings</p>
                <p className="text-2xl font-bold text-[#1F2937]">{stats.listings}</p>
                <p className="text-xs text-[#9CA3AF] mt-1">Across all stores</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
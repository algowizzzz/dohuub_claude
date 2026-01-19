import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AdminSidebarRetractable } from "./AdminSidebarRetractable";
import { AdminTopNav } from "./AdminTopNav";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

function MetricCard({ label, value, change, isPositive }: MetricCardProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[140px] flex flex-col justify-between hover:translate-y-[-2px] transition-transform cursor-pointer">
      <p className="text-sm text-[#6B7280] mb-2">{label}</p>
      <div>
        <p className="text-4xl font-bold text-[#1F2937] mb-1">{value}</p>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-[#10B981]" />
          ) : (
            <TrendingDown className="w-3 h-3 text-[#DC2626]" />
          )}
          <span className={`text-[13px] ${isPositive ? 'text-[#10B981]' : 'text-[#DC2626]'}`}>
            {change}
          </span>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    typeof window !== 'undefined' && window.innerWidth >= 1024 ? false : true
  );

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminTopNav onMenuClick={handleSidebarToggle} />
      <AdminSidebarRetractable
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        activeMenu="dashboard"
      />

      {/* Main Content */}
      <main
        className={`
          mt-[72px] min-h-[calc(100vh-72px)] p-4 sm:p-6 lg:p-8
          transition-all duration-300
          ${sidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-[280px]'}
        `}
      >
        <div className="w-full max-w-[1600px]">
          <h1 className="text-2xl sm:text-[32px] font-bold text-[#1F2937] mb-6 sm:mb-8">Dashboard Overview</h1>

          {/* Primary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <MetricCard
              label="Total Users"
              value="12,543"
              change="+12% from last month"
              isPositive={true}
            />
            <MetricCard
              label="Active Vendors"
              value="287"
              change="+8% from last month"
              isPositive={true}
            />
            <MetricCard
              label="Revenue (This Month)"
              value="$45,234"
              change="+23% from last month"
              isPositive={true}
            />
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
              <p className="text-sm text-[#6B7280] mb-2">Active Orders Today</p>
              <p className="text-2xl font-bold text-[#1F2937]">156</p>
            </div>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 h-[120px]">
              <p className="text-sm text-[#6B7280] mb-2">New Vendors This Week</p>
              <p className="text-2xl font-bold text-[#1F2937]">12</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
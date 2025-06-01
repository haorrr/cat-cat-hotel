// src/components/hooks/dashboard/useDashboardOverview.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy tổng quan dashboard (chỉ admin)
 * Bao gồm: stats tổng quan, recent bookings, monthly revenue, popular rooms
 */
export function useDashboardOverview() {
  const fetchDashboardOverview = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/dashboard/overview", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch dashboard overview");
      }
      
      return data.data;
    } catch (err) {
      console.error("Error fetching dashboard overview:", err);
      throw err;
    }
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: fetchDashboardOverview,
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data can be slightly stale
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refresh when user comes back to tab
    refetchInterval: 5 * 60 * 1000, // Auto refresh every 5 minutes
  });

  return { 
    overview: data?.overview,
    recentBookings: data?.recent_bookings,
    monthlyRevenue: data?.monthly_revenue,
    popularRooms: data?.popular_rooms,
    isLoading, 
    isError, 
    error, 
    refetch 
  };
}

// Helper functions for dashboard data processing
export const DashboardOverviewUtils = {
  // Calculate growth percentage
  calculateGrowth: (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
  },
  
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  },
  
  // Format large numbers
  formatNumber: (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  },
  
  // Get month name
  getMonthName: (monthNumber) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[monthNumber - 1] || '';
  },
  
  // Process monthly revenue for charts
  processMonthlyRevenueForChart: (monthlyRevenue) => {
    return monthlyRevenue?.map(item => ({
      ...item,
      monthName: DashboardOverviewUtils.getMonthName(item.month),
      formattedRevenue: DashboardOverviewUtils.formatCurrency(item.revenue),
      period: `${item.year}-${item.month.toString().padStart(2, '0')}`
    })) || [];
  },
  
  // Get status color for bookings
  getBookingStatusColor: (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked_in': 'bg-green-100 text-green-800',
      'checked_out': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },
  
  // Calculate occupancy rate
  calculateOccupancyRate: (totalRooms, checkedInBookings) => {
    if (!totalRooms || totalRooms === 0) return 0;
    return ((checkedInBookings / totalRooms) * 100).toFixed(1);
  },
  
  // Get trend indicator
  getTrendIndicator: (current, previous) => {
    const growth = DashboardOverviewUtils.calculateGrowth(current, previous);
    if (growth > 0) return { direction: 'up', color: 'text-green-600', icon: '↗' };
    if (growth < 0) return { direction: 'down', color: 'text-red-600', icon: '↘' };
    return { direction: 'stable', color: 'text-gray-600', icon: '→' };
  }
};
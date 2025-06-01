// src/components/hooks/dashboard/useDashboardRevenue.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy dữ liệu revenue analytics (chỉ admin)
 * @param {object} params - Tham số lọc
 * @param {string} params.period - Khoảng thời gian ('day', 'month', 'year')
 * @param {number} params.year - Năm (bắt buộc khi period = 'day')
 * @param {number} params.month - Tháng (bắt buộc khi period = 'day')
 */
export function useDashboardRevenue(params = {}) {
  const { period = 'month', year, month } = params;

  const fetchDashboardRevenue = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams();

      // Add query parameters
      if (period) queryParams.append("period", period);
      if (year) queryParams.append("year", year);
      if (month) queryParams.append("month", month);

      const queryString = queryParams.toString();
      const url = `http://localhost:5000/api/dashboard/revenue${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch revenue data");
      }
      
      return data.data;
    } catch (err) {
      console.error("Error fetching dashboard revenue:", err);
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
    queryKey: ["dashboardRevenue", { period, year, month }],
    queryFn: fetchDashboardRevenue,
    staleTime: 3 * 60 * 1000, // 3 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: !(period === 'day' && (!year || !month)), // Don't run if day period without year/month
  });

  return { 
    revenueData: data?.revenue_data,
    serviceRevenue: data?.service_revenue,
    isLoading, 
    isError, 
    error, 
    refetch 
  };
}

// Helper functions for revenue data processing
export const DashboardRevenueUtils = {
  // Format revenue data for different chart libraries
  formatForChart: (revenueData, period) => {
    if (!revenueData) return [];
    
    return revenueData.map(item => {
      let label = '';
      
      if (period === 'day') {
        label = `${item.day}/${item.month}/${item.year}`;
      } else if (period === 'month') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        label = `${monthNames[item.month - 1]} ${item.year}`;
      } else if (period === 'year') {
        label = item.year.toString();
      }
      
      return {
        ...item,
        label,
        value: item.revenue || 0,
        formattedValue: DashboardRevenueUtils.formatCurrency(item.revenue),
        bookingCount: item.booking_count || 0,
        avgBookingValue: item.avg_booking_value || 0,
        formattedAvgValue: DashboardRevenueUtils.formatCurrency(item.avg_booking_value)
      };
    });
  },
  
  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  },
  
  // Calculate total revenue
  calculateTotalRevenue: (revenueData) => {
    return revenueData?.reduce((total, item) => total + (item.revenue || 0), 0) || 0;
  },
  
  // Calculate average booking value
  calculateAvgBookingValue: (revenueData) => {
    const totalRevenue = DashboardRevenueUtils.calculateTotalRevenue(revenueData);
    const totalBookings = revenueData?.reduce((total, item) => total + (item.booking_count || 0), 0) || 0;
    
    return totalBookings > 0 ? totalRevenue / totalBookings : 0;
  },
  
  // Get revenue growth between periods
  calculateRevenueGrowth: (revenueData) => {
    if (!revenueData || revenueData.length < 2) return null;
    
    const latest = revenueData[0]?.revenue || 0;
    const previous = revenueData[1]?.revenue || 0;
    
    if (previous === 0) return latest > 0 ? 100 : 0;
    
    return ((latest - previous) / previous * 100).toFixed(1);
  },
  
  // Process service revenue for pie chart
  processServiceRevenueForPieChart: (serviceRevenue) => {
    if (!serviceRevenue) return [];
    
    const totalRevenue = serviceRevenue.reduce((sum, service) => sum + (service.revenue || 0), 0);
    
    return serviceRevenue.map(service => ({
      name: service.name,
      category: service.category,
      value: service.revenue || 0,
      formattedValue: DashboardRevenueUtils.formatCurrency(service.revenue),
      percentage: totalRevenue > 0 ? ((service.revenue / totalRevenue) * 100).toFixed(1) : 0,
      serviceCount: service.service_count || 0
    }));
  },
  
  // Get period display name
  getPeriodDisplayName: (period) => {
    const names = {
      'day': 'Daily',
      'month': 'Monthly', 
      'year': 'Yearly'
    };
    return names[period] || 'Monthly';
  },
  
  // Validate period parameters
  validatePeriodParams: (period, year, month) => {
    const errors = [];
    
    if (period === 'day') {
      if (!year) errors.push('Year is required for daily period');
      if (!month) errors.push('Month is required for daily period');
      if (month && (month < 1 || month > 12)) errors.push('Month must be between 1 and 12');
    }
    
    if (year && (year < 2020 || year > new Date().getFullYear() + 1)) {
      errors.push('Year must be between 2020 and next year');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Generate period options for dropdowns
  generatePeriodOptions: () => {
    const currentYear = new Date().getFullYear();
    
    return {
      periods: [
        { value: 'day', label: 'Daily' },
        { value: 'month', label: 'Monthly' },
        { value: 'year', label: 'Yearly' }
      ],
      years: Array.from({ length: 5 }, (_, i) => ({
        value: currentYear - i,
        label: (currentYear - i).toString()
      })),
      months: [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
      ]
    };
  }
};

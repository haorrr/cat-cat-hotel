// src/components/hooks/dashboard/useDashboardActions.jsx
"use client";

import { useDashboardOverview } from "./useDashboardOverview";
import { useDashboardRevenue } from "./useDashboardRevenue";

/**
 * Hook tổng hợp tất cả các actions liên quan đến dashboard
 * Giúp việc import và sử dụng đơn giản hơn
 * 
 * @example
 * const dashboardActions = useDashboardActions();
 * const { useDashboardOverview, useDashboardRevenue } = dashboardActions;
 */
export function useDashboardActions() {
  return {
    useDashboardOverview,
    useDashboardRevenue,
  };
}

// Export individual hooks for direct import
export {
  useDashboardOverview,
  useDashboardRevenue,
};

// Dashboard constants
export const DASHBOARD_CONSTANTS = {
  REFRESH_INTERVALS: {
    OVERVIEW: 5 * 60 * 1000, // 5 minutes
    REVENUE: 10 * 60 * 1000, // 10 minutes
  },
  
  CACHE_TIMES: {
    OVERVIEW: 5 * 60 * 1000, // 5 minutes
    REVENUE: 10 * 60 * 1000, // 10 minutes
  },
  
  STALE_TIMES: {
    OVERVIEW: 2 * 60 * 1000, // 2 minutes
    REVENUE: 3 * 60 * 1000, // 3 minutes
  },
  
  REVENUE_PERIODS: {
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
  },
  
  BOOKING_STATUSES: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CHECKED_IN: 'checked_in',
    CHECKED_OUT: 'checked_out',
    CANCELLED: 'cancelled'
  }
};

// Dashboard utility functions
export const DashboardUtils = {
  // Format numbers with locale
  formatNumber: (num, locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale).format(num || 0);
  },
  
  // Format currency
  formatCurrency: (amount, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount || 0);
  },
  
  // Format percentage
  formatPercentage: (value, decimals = 1) => {
    return `${Number(value || 0).toFixed(decimals)}%`;
  },
  
  // Calculate percentage change
  calculatePercentageChange: (current, previous) => {
    if (!previous || previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous * 100);
  },
  
  // Get trend data
  getTrend: (current, previous) => {
    const change = DashboardUtils.calculatePercentageChange(current, previous);
    
    return {
      value: change,
      formatted: DashboardUtils.formatPercentage(Math.abs(change)),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      isPositive: change > 0,
      isNegative: change < 0,
      isStable: change === 0,
      color: change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600',
      bgColor: change > 0 ? 'bg-green-50' : change < 0 ? 'bg-red-50' : 'bg-gray-50',
      icon: change > 0 ? '↗' : change < 0 ? '↘' : '→'
    };
  },
  
  // Convert data for different chart types
  formatDataForCharts: {
    // Line chart format
    lineChart: (data, xKey, yKey) => {
      return data?.map(item => ({
        x: item[xKey],
        y: item[yKey] || 0
      })) || [];
    },
    
    // Bar chart format
    barChart: (data, labelKey, valueKey) => {
      return data?.map(item => ({
        label: item[labelKey],
        value: item[valueKey] || 0
      })) || [];
    },
    
    // Pie chart format
    pieChart: (data, labelKey, valueKey) => {
      const total = data?.reduce((sum, item) => sum + (item[valueKey] || 0), 0) || 0;
      
      return data?.map(item => ({
        name: item[labelKey],
        value: item[valueKey] || 0,
        percentage: total > 0 ? ((item[valueKey] || 0) / total * 100).toFixed(1) : 0
      })) || [];
    }
  },
  
  // Date utilities
  dateUtils: {
    // Get current period info
    getCurrentPeriod: () => {
      const now = new Date();
      return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        quarter: Math.ceil((now.getMonth() + 1) / 3)
      };
    },
    
    // Format date for API
    formatForAPI: (date) => {
      return date.toISOString().split('T')[0];
    },
    
    // Get date range for periods
    getDateRange: (period, year, month) => {
      const ranges = {
        day: {
          start: new Date(year, month - 1, 1),
          end: new Date(year, month, 0)
        },
        month: {
          start: new Date(new Date().getFullYear() - 1, new Date().getMonth(), 1),
          end: new Date()
        },
        year: {
          start: new Date(new Date().getFullYear() - 5, 0, 1),
          end: new Date()
        }
      };
      
      return ranges[period] || ranges.month;
    }
  },
  
  // Validation utilities
  validation: {
    // Validate dashboard access (admin only)
    validateAdminAccess: (userRole) => {
      return userRole === 'admin';
    },
    
    // Validate revenue period params
    validateRevenuePeriod: (period, year, month) => {
      const errors = [];
      
      if (!['day', 'month', 'year'].includes(period)) {
        errors.push('Invalid period. Must be day, month, or year.');
      }
      
      if (period === 'day') {
        if (!year || year < 2020 || year > new Date().getFullYear() + 1) {
          errors.push('Invalid year for daily period.');
        }
        if (!month || month < 1 || month > 12) {
          errors.push('Invalid month for daily period.');
        }
      }
      
      return {
        isValid: errors.length === 0,
        errors
      };
    }
  }
};

// Color schemes for dashboard components
export const DASHBOARD_COLORS = {
  // Status colors
  STATUS: {
    pending: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200'
    },
    confirmed: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200'
    },
    checked_in: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200'
    },
    checked_out: {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      border: 'border-gray-200'
    },
    cancelled: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200'
    }
  },
  
  // Chart colors
  CHART: {
    primary: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    secondary: ['#93C5FD', '#86EFAC', '#FCD34D', '#FCA5A5', '#C4B5FD'],
    gradient: [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-purple-500 to-purple-600'
    ]
  },
  
  // Trend colors
  TREND: {
    positive: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      icon: 'text-green-500'
    },
    negative: {
      bg: 'bg-red-50',
      text: 'text-red-600',
      icon: 'text-red-500'
    },
    stable: {
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      icon: 'text-gray-500'
    }
  }
};
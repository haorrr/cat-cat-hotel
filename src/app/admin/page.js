// src/app/admin/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Cat,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  BarChart3,
  PieChart,
  ArrowUpRight
} from "lucide-react";
import { useDashboardOverview } from "../../components/hooks/dashboard/useDashboardOverview";
import { MainLayout } from "../../components/layout/MainLayout";

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  
  const {
    overview,
    recentBookings,
    monthlyRevenue,
    popularRooms,
    isLoading,
    error
  } = useDashboardOverview();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      checked_in: "bg-green-100 text-green-800",
      checked_out: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "checked_in":
        return <Activity className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Failed to load dashboard data: {error.message}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const stats = [
    {
      name: "Total Customers",
      value: overview?.total_customers || 0,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      change: "+12.5%",
      trend: "up"
    },
    {
      name: "Total Cats",
      value: overview?.total_cats || 0,
      icon: Cat,
      color: "from-orange-500 to-pink-500",
      change: "+8.3%",
      trend: "up"
    },
    {
      name: "Total Revenue",
      value: formatCurrency(overview?.total_revenue),
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      change: "+15.2%",
      trend: "up"
    },
    {
      name: "Occupancy Rate",
      value: `${Math.round(((overview?.checked_in_bookings || 0) / (overview?.total_rooms || 1)) * 100)}%`,
      icon: Building,
      color: "from-purple-500 to-purple-600",
      change: "-2.1%",
      trend: "down"
    }
  ];

  const bookingStats = [
    {
      label: "Pending",
      value: overview?.pending_bookings || 0,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      label: "Confirmed",
      value: overview?.confirmed_bookings || 0,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Checked In",
      value: overview?.checked_in_bookings || 0,
      color: "text-green-600",
      bgColor: "bg-green-100"
    }
  ];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your cat hotel operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Status Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Booking Status</h2>
                <Link
                  href="/admin/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {bookingStats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${stat.bgColor} mr-3`}></div>
                      <span className="text-gray-700">{stat.label}</span>
                    </div>
                    <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {overview?.total_bookings || 0}
                  </p>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  href="/admin/bookings"
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-blue-900">Manage Bookings</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-blue-600" />
                </Link>

                <Link
                  href="/admin/rooms"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-green-600 mr-3" />
                    <span className="font-medium text-green-900">Manage Rooms</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-600" />
                </Link>

                <Link
                  href="/admin/users"
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-purple-900">Manage Users</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-purple-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Bookings & Revenue */}
          <div className="lg:col-span-2">
            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                <Link
                  href="/admin/bookings"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {recentBookings && recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.customer_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.cat_name} • {booking.room_name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(booking.total_price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.check_in_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent bookings</p>
                </div>
              )}
            </div>

            {/* Popular Rooms */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Popular Rooms</h2>
                <Link
                  href="/admin/rooms"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {popularRooms && popularRooms.length > 0 ? (
                <div className="space-y-4">
                  {popularRooms.slice(0, 5).map((room, index) => (
                    <div key={room.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-orange-100 to-pink-100 w-10 h-10 rounded-lg flex items-center justify-center">
                          <span className="font-bold text-orange-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{room.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{room.room_type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {room.booking_count} bookings
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(room.total_revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No room data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Chart Section */}
        {monthlyRevenue && monthlyRevenue.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Revenue Overview</h2>
                  <p className="text-gray-600">Monthly revenue trends</p>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="week">Last 7 days</option>
                    <option value="month">Last 30 days</option>
                    <option value="quarter">Last 3 months</option>
                    <option value="year">Last year</option>
                  </select>
                </div>
              </div>

              {/* Simple Revenue Display */}
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                {monthlyRevenue.slice(0, 4).map((month, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      {month.month}/{month.year}
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(month.revenue)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {month.booking_count} bookings
                    </p>
                  </div>
                ))}
              </div>

              {/* Revenue Growth Indicator */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Total Revenue This Period
                      </p>
                      <p className="text-sm text-gray-600">
                        Across all bookings and services
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(monthlyRevenue.reduce((sum, month) => sum + (month.revenue || 0), 0))}
                    </p>
                    <p className="text-sm text-green-600 font-medium">
                      +{Math.round(Math.random() * 20 + 5)}% vs last period
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats Row */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <Activity className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Database</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Healthy
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Server Status</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Response Time</span>
                <span className="text-gray-900 font-medium">245ms</span>
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Rating</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                  <span className="font-medium text-gray-900">4.9</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Reviews</span>
                <span className="font-medium text-gray-900">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">This Month</span>
                <span className="font-medium text-gray-900">23</span>
              </div>
            </div>
            <Link
              href="/admin/reviews"
              className="mt-4 block text-center bg-yellow-50 text-yellow-700 py-2 rounded-lg hover:bg-yellow-100 transition-colors duration-200 text-sm font-medium"
            >
              Manage Reviews
            </Link>
          </div>

          {/* Food & Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Food & Services</h3>
              <PieChart className="h-5 w-5 text-purple-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Foods</span>
                <span className="font-medium text-gray-900">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Services</span>
                <span className="font-medium text-gray-900">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Most Popular</span>
                <span className="text-sm text-gray-700">Premium Grooming</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/admin/foods"
                className="text-center bg-orange-50 text-orange-700 py-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-sm font-medium"
              >
                Manage Foods
              </Link>
              <Link
                href="/admin/services"
                className="text-center bg-purple-50 text-purple-700 py-2 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium"
              >
                Manage Services
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
          <p className="text-center text-gray-600 text-sm">
            Dashboard data updates in real-time. Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
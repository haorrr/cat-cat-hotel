// src/app/dashboard/bookings/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Edit,
  Eye,
  Cat,
  Building,
  DollarSign,
  MoreVertical,
  ArrowUpRight
} from "lucide-react";
import { useGetBooking } from "../../../components/hooks/booking/useGetBooking";
import { useCancelBooking } from "../../../components/hooks/booking/useCancelBooking";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { bookings, isLoading, refetch } = useGetBooking({
    search: searchTerm,
    status: selectedStatus,
    start_date: dateRange.start,
    end_date: dateRange.end
  });

  const { cancelBookingMutation, isLoading: isCancelling } = useCancelBooking();

  const bookingStatuses = [
    { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    { value: "confirmed", label: "Confirmed", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    { value: "checked_in", label: "Checked In", color: "bg-green-100 text-green-800", icon: CheckCircle },
    { value: "checked_out", label: "Checked Out", color: "bg-gray-100 text-gray-800", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800", icon: X }
  ];

  const getStatusInfo = (status) => {
    return bookingStatuses.find(s => s.value === status) || 
           { label: status, color: "bg-gray-100 text-gray-800", icon: AlertTriangle };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const canCancelBooking = (booking) => {
    return ['pending', 'confirmed'].includes(booking.status) && 
           new Date(booking.check_in_date) > new Date();
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      cancelBookingMutation(bookingId, {
        onSuccess: () => {
          refetch();
          setSelectedBooking(null);
        }
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setDateRange({ start: "", end: "" });
  };

  const upcomingBookings = bookings?.filter(booking => 
    ['confirmed', 'pending'].includes(booking.status) && 
    new Date(booking.check_in_date) >= new Date()
  ) || [];

  const pastBookings = bookings?.filter(booking => 
    ['checked_out', 'cancelled'].includes(booking.status) ||
    (booking.status === 'checked_in' && new Date(booking.check_out_date) < new Date())
  ) || [];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">
              Manage your cat's hotel reservations and stays
            </p>
          </div>
          <Link
            href="/dashboard/bookings/new"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Booking
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings?.length || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-blue-900">{upcomingBookings.length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-900">{pastBookings.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-purple-900">
                  {formatCurrency(bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, cat name, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    {bookingStatuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-200 h-6 w-32 rounded"></div>
                  <div className="bg-gray-200 h-6 w-20 rounded"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const statusInfo = getStatusInfo(booking.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="p-6">
                    {/* Booking Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${statusInfo.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{statusInfo.label}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Booking #{booking.id}</h3>
                          <p className="text-sm text-gray-600">
                            Created {new Date(booking.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Actions Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setSelectedBooking(selectedBooking === booking.id ? null : booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <MoreVertical className="h-5 w-5 text-gray-400" />
                        </button>

                        {selectedBooking === booking.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                              <Link
                                href={`/dashboard/bookings/${booking.id}`}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setSelectedBooking(null)}
                              >
                                <Eye className="h-4 w-4 mr-3" />
                                View Details
                              </Link>
                              
                              {canCancelBooking(booking) && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={isCancelling}
                                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                  <X className="h-4 w-4 mr-3" />
                                  Cancel Booking
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Cat className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Cat</p>
                          <p className="font-medium text-gray-900">{booking.cat_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Room</p>
                          <p className="font-medium text-gray-900">{booking.room_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Stay Period</p>
                          <p className="font-medium text-gray-900">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <DollarSign className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Price</p>
                          <p className="font-medium text-gray-900">{formatCurrency(booking.total_price)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-900">
                          <strong>Special Requests:</strong> {booking.special_requests}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>

                      {booking.status === 'checked_out' && (
                        <Link
                          href={`/dashboard/reviews/new?booking_id=${booking.id}`}
                          className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Link>
                      )}

                      {['confirmed', 'pending'].includes(booking.status) && new Date(booking.check_in_date) > new Date() && (
                        <Link
                          href={`/dashboard/bookings/new?cat_id=${booking.cat_id}&room_id=${booking.room_id}`}
                          className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Book Again
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedStatus || dateRange.start || dateRange.end
                ? "Try adjusting your search filters to find your bookings."
                : "You haven't made any bookings yet. Start by booking your first cat stay!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/bookings/new"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Make Your First Booking
              </Link>
              {(searchTerm || selectedStatus || dateRange.start || dateRange.end) && (
                <button
                  onClick={clearFilters}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Bookings Alert */}
        {upcomingBookings.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 p-2 rounded-lg mr-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Upcoming Stays ({upcomingBookings.length})
                  </h3>
                  <p className="text-blue-700">
                    Next check-in: {new Date(upcomingBookings[0]?.check_in_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
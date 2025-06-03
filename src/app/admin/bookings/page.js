// src/app/admin/bookings/page.js
"use client";

import { useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Calendar, Search, Filter, Eye, CheckCircle, XCircle } from "lucide-react";
import { useGetBooking } from "../../../components/hooks/booking/useGetBooking";
import { useUpdateBooking } from "../../../components/hooks/booking/useUpdateBooking";
import { useCancelBooking } from "../../../components/hooks/booking/useCancelBooking";

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "",
    start_date: "",
    end_date: ""
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { bookings, pagination, isLoading, error, refetch } = useGetBooking(filters);
  const updateMutation = useUpdateBooking();
  const cancelMutation = useCancelBooking();

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateMutation.mutateAsync({ bookingId, status: newStatus });
      refetch();
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelMutation.mutateAsync(bookingId);
        refetch();
      } catch (error) {
        console.error("Error cancelling booking:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'checked_in': 'bg-green-100 text-green-800',
      'checked_out': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
            <p className="text-gray-600">View and manage all customer bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="End Date"
            />

            <button
              onClick={() => setFilters({
                page: 1,
                limit: 10,
                status: "",
                start_date: "",
                end_date: ""
              })}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error loading bookings: {error.message}</p>
            </div>
          ) : bookings?.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600">No bookings match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings?.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{booking.id}</div>
                        <div className="text-sm text-gray-500">{formatDate(booking.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.user?.full_name}</div>
                        <div className="text-sm text-gray-500">{booking.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.cat?.name}</div>
                        <div className="text-sm text-gray-500">{booking.cat?.breed}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Room {booking.room?.room_number}</div>
                        <div className="text-sm text-gray-500">{booking.room?.room_type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(booking.check_in_date)} - {formatDate(booking.check_out_date)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.ceil((new Date(booking.check_out_date) - new Date(booking.check_in_date)) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${booking.total_amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => showBookingDetails(booking)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                              title="Confirm"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {['pending', 'confirmed'].includes(booking.status) && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Cancel"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && (
            <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  disabled={pagination.current_page === pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Booking Details #{selectedBooking.id}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.user?.full_name}</p>
                    <p><span className="font-medium">Email:</span> {selectedBooking.user?.email}</p>
                    <p><span className="font-medium">Phone:</span> {selectedBooking.user?.phone}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Cat Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedBooking.cat?.name}</p>
                    <p><span className="font-medium">Breed:</span> {selectedBooking.cat?.breed}</p>
                    <p><span className="font-medium">Age:</span> {selectedBooking.cat?.age} years</p>
                    <p><span className="font-medium">Weight:</span> {selectedBooking.cat?.weight} kg</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Room Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Room:</span> {selectedBooking.room?.room_number}</p>
                    <p><span className="font-medium">Type:</span> {selectedBooking.room?.room_type}</p>
                    <p><span className="font-medium">Daily Rate:</span> ${selectedBooking.room?.daily_rate}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Booking Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Check-in:</span> {formatDate(selectedBooking.check_in_date)}</p>
                    <p><span className="font-medium">Check-out:</span> {formatDate(selectedBooking.check_out_date)}</p>
                    <p><span className="font-medium">Total Amount:</span> ${selectedBooking.total_amount}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.replace('_', ' ')}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {selectedBooking.special_requests && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.special_requests}</p>
                </div>
              )}
              
              {selectedBooking.services?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Services</h3>
                  <div className="space-y-2">
                    {selectedBooking.services.map((service, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{service.name}</span>
                        <span>${service.price} x {service.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedBooking.foods?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Food Orders</h3>
                  <div className="space-y-2">
                    {selectedBooking.foods.map((food, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{food.name}</span>
                        <span>${food.price_per_serving} x {food.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'confirmed');
                      setShowDetailsModal(false);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Confirm Booking
                  </button>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'checked_in');
                      setShowDetailsModal(false);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Check In
                  </button>
                )}
                {selectedBooking.status === 'checked_in' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedBooking.id, 'checked_out');
                      setShowDetailsModal(false);
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Check Out
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
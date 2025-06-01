// src/components/hooks/booking/useCancelBooking.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để hủy booking
 * Chỉ owner hoặc admin mới có thể hủy
 * Chỉ có thể hủy booking ở trạng thái 'pending' hoặc 'confirmed'
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  const cancelBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      if (!bookingId) {
        throw new Error("Booking ID is required");
      }

      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to cancel booking");
      }
      
      return data;
    } catch (err) {
      console.error("Error cancelling booking:", err);
      throw err;
    }
  };

  const {
    mutate: cancelBookingMutation,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: (data, bookingId) => {
      // Invalidate bookings list để refresh data
      queryClient.invalidateQueries(["bookings"]);
      
      // Remove specific booking from cache hoặc update status
      queryClient.removeQueries(["booking", bookingId]);
      
      // Có thể invalidate rooms list để update availability
      queryClient.invalidateQueries(["rooms"]);
      
      console.log("Booking cancelled successfully:", data);
    },
    onError: (error) => {
      console.error("Booking cancellation failed:", error);
    },
  });

  return { 
    cancelBookingMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess 
  };
}
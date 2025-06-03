"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để hủy booking (admin hoặc chủ sở hữu)
 * Chỉ có thể hủy khi trạng thái là 'pending' hoặc 'confirmed'
 */
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId) => {
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

      // Trả về booking nếu có, hoặc null
      return data.data?.booking || null;
    },

    onSuccess: (booking, bookingId) => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.removeQueries(["booking", bookingId]);
      queryClient.invalidateQueries(["rooms"]);

      if (booking) {
        console.log("✅ Booking cancelled:", booking);
      } else {
        console.log("✅ Booking cancelled (no booking object returned)");
      }
    },

    onError: (error) => {
      console.error("❌ Booking cancellation failed:", error.message);
    },
  });
}

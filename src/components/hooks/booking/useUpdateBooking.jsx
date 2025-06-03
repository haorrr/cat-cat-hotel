"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để cập nhật trạng thái hoặc ghi chú booking (dùng cho admin)
 * Cách dùng:
 * const updateBooking = useUpdateBooking();
 * await updateBooking.mutateAsync({ bookingId: 123, status: 'confirmed' });
 */
export function useUpdateBooking() {
  const queryClient = useQueryClient();

  const updateBooking = async ({ bookingId, ...updateData }) => {
    if (!bookingId || typeof bookingId !== "number") {
      throw new Error("Invalid booking ID");
    }

    const token = localStorage.getItem("token");

    // Lọc các trường hợp lệ để update
    const validFields = ['status', 'notes'];
    const filteredData = {};

    Object.keys(updateData).forEach((key) => {
      if (validFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error("No valid fields to update");
    }

    const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
      body: JSON.stringify(filteredData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to update booking");
    }

    return data.data.booking;
  };

  return useMutation({
    mutationFn: updateBooking,
    onSuccess: (booking) => {
      queryClient.invalidateQueries(["bookings"]);
      queryClient.setQueryData(["booking", booking.id], booking);
      console.log("✅ Booking updated:", booking);
    },
    onError: (error) => {
      console.error("❌ Booking update failed:", error.message);
    },
  });
}

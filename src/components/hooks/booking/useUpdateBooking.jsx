// src/components/hooks/booking/useUpdateBooking.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để cập nhật booking (chỉ admin)
 * @param {number} bookingId - ID của booking cần cập nhật
 */
export function useUpdateBooking(bookingId) {
  const queryClient = useQueryClient();

  const updateBooking = async (updateData) => {
    try {
      const token = localStorage.getItem("token");

      // Validate updateData
      const validFields = ['status', 'notes'];
      const filteredData = {};
      
      Object.keys(updateData).forEach(key => {
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
    } catch (err) {
      console.error("Error updating booking:", err);
      throw err;
    }
  };

  const {
    mutate: updateBookingMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: updatedBooking,
  } = useMutation({
    mutationFn: updateBooking,
    onSuccess: (booking) => {
      // Invalidate và update cache
      queryClient.invalidateQueries(["bookings"]);
      queryClient.setQueryData(["booking", bookingId], booking);
      
      console.log("Booking updated successfully:", booking);
    },
    onError: (error) => {
      console.error("Booking update failed:", error);
    },
  });

  return { 
    updateBookingMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    updatedBooking 
  };
}
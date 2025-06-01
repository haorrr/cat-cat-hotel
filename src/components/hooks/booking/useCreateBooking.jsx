// src/components/hooks/booking/useCreateBooking.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để tạo booking mới
 * @param {object} bookingData - Dữ liệu booking
 * @param {number} bookingData.cat_id - ID mèo
 * @param {number} bookingData.room_id - ID phòng
 * @param {string} bookingData.check_in_date - Ngày check in (YYYY-MM-DD)
 * @param {string} bookingData.check_out_date - Ngày check out (YYYY-MM-DD)
 * @param {Array} bookingData.services - Danh sách dịch vụ [{ service_id, quantity, service_date, notes }]
 * @param {Array} bookingData.foods - Danh sách thức ăn [{ food_id, quantity, feeding_date, meal_time, notes }]
 * @param {string} bookingData.special_requests - Yêu cầu đặc biệt
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  const createBooking = async (bookingData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create booking");
      }
      
      return data.data.booking;
    } catch (err) {
      console.error("Error creating booking:", err);
      throw err;
    }
  };

  const {
    mutate: createBookingMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: newBooking,
  } = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      // Invalidate bookings list để refresh data
      queryClient.invalidateQueries(["bookings"]);
      
      // Có thể invalidate rooms list để update availability
      queryClient.invalidateQueries(["rooms"]);
      
      console.log("Booking created successfully:", booking);
    },
    onError: (error) => {
      console.error("Booking creation failed:", error);
    },
  });

  return { 
    createBookingMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    newBooking 
  };
}
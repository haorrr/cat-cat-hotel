// src/components/hooks/booking/useGetBookingById.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy thông tin chi tiết của một booking theo ID
 * @param {number} bookingId - ID của booking
 * @param {object} options - Các tùy chọn cho useQuery
 */
export function useGetBookingById(bookingId, options = {}) {
  const fetchBookingById = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch booking");
      }
      
      return data.data.booking;
    } catch (err) {
      console.error("Error fetching booking:", err);
      throw err;
    }
  };

  const {
    data: booking,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: fetchBookingById,
    enabled: !!bookingId, // Chỉ chạy khi có bookingId
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });

  return { booking, isLoading, isError, error, refetch };
}
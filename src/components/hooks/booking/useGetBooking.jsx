"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * filters: {
 *   page?: number,
 *   limit?: number,
 *   status?: string,
 *   start_date?: string,  // format YYYY-MM-DD
 *   end_date?: string,    // format YYYY-MM-DD
 *   room_id?: number,
 *   cat_id?: number,
 *   user_id?: number      // only for admin
 * }
 */
export function useGetBooking(filters = {}) {
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.status) params.append("status", filters.status);
      if (filters.start_date) params.append("start_date", filters.start_date);
      if (filters.end_date) params.append("end_date", filters.end_date);
      if (filters.room_id) params.append("room_id", filters.room_id);
      if (filters.cat_id) params.append("cat_id", filters.cat_id);
      if (filters.user_id) params.append("user_id", filters.user_id);

      const queryString = params.toString();
      const url = `http://localhost:5000/api/bookings${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }
      // Expected response: { success: true, data: { bookings, pagination } }
      return data.data;
    } catch (err) {
      console.error("Error fetching bookings:", err);
      throw err;
    }
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["bookings", filters],
    queryFn: fetchBookings,
    keepPreviousData: true,
  });

  return { bookings: data?.bookings, pagination: data?.pagination, isLoading, isError, error, refetch };
}

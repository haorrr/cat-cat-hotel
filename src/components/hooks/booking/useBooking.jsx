"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * bookingData: {
 *   cat_id: number,
 *   room_id: number,
 *   check_in_date: string,  // YYYY-MM-DD
 *   check_out_date: string, // YYYY-MM-DD
 *   services?: [ { service_id: number, quantity?: number, service_date?: string, notes?: string } ],
 *   foods?: [ { food_id: number, quantity?: number, feeding_date?: string, meal_time?: string, notes?: string } ],
 *   special_requests?: string
 * }
 */
export function useBooking() {
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
    mutate: bookingMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: newBooking,
  } = useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      // Invalidate bookings list so it can be refetched
      queryClient.invalidateQueries(["bookings"]);
    },
  });

  return { bookingMutation, isLoading, isError, error, isSuccess, newBooking };
}

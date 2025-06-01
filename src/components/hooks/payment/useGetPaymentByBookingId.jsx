"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetPaymentByBookingId(bookingId) {
  const fetchPayment = async () => {
    if (!bookingId) throw new Error("Booking ID is required");

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/payments/${bookingId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch payment");
    return data.data.payment;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payment", bookingId],
    queryFn: fetchPayment,
    enabled: !!bookingId,
  });

  return { data, isLoading, isError, error, refetch };
}

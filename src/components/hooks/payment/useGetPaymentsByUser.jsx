"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetPaymentsByUser(userId) {
  const fetchUserPayments = async () => {
    if (!userId) throw new Error("User ID is required");

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/payments/user/${userId}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user payments");
    return data.data.payments;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["userPayments", userId],
    queryFn: fetchUserPayments,
    enabled: !!userId,
  });

  return { data, isLoading, isError, error, refetch };
}

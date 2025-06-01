"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetAllPayments(params = {}) {
  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    const url = new URL("http://localhost:5000/api/payments");
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url, {
      method: "GET",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch payments");
    return data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["payments", params],
    queryFn: fetchPayments,
  });

  return { data, isLoading, isError, error, refetch };
}

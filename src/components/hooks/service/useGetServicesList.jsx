"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetServicesList(params = {}) {
  const fetchServices = async () => {
    const url = new URL("http://localhost:5000/api/services");
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const res = await fetch(url, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch services");
    return data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["servicesList", params],
    queryFn: fetchServices,
  });

  return { data, isLoading, isError, error, refetch };
}

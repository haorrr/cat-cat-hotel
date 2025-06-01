// src/components/hooks/cat/useGetCatBreeds.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy danh sách các giống mèo
 */
export function useGetCatBreeds() {
  const fetchBreeds = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cats/meta/breeds", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch breeds");
      }
      return data.data.breeds;
    } catch (err) {
      console.error("Error fetching breeds:", err);
      throw err;
    }
  };

  const {
    data: breeds,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["catBreeds"],
    queryFn: fetchBreeds,
    staleTime: 5 * 60 * 1000, // 5 phút
    cacheTime: 10 * 60 * 1000, // 10 phút
  });

  return { breeds, isLoading, isError, error, refetch };
}
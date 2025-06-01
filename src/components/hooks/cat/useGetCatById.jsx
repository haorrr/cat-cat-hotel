"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy thông tin chi tiết của một con mèo theo ID
 * @param {number} catId - ID của con mèo
 * @param {object} options - Các tùy chọn cho useQuery
 */
export function useGetCatById(catId, options = {}) {
  const fetchCatById = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/cats/${catId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch cat");
      }
      return data.data.cat;
    } catch (err) {
      console.error("Error fetching cat:", err);
      throw err;
    }
  };

  const {
    data: cat,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["cat", catId],
    queryFn: fetchCatById,
    enabled: !!catId, // Chỉ chạy khi có catId
    ...options,
  });

  return { cat, isLoading, isError, error, refetch };
}
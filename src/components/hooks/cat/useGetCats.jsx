"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * filters: {
 *   page?: number,
 *   limit?: number,
 *   search?: string,
 *   breed?: string,
 *   gender?: string,
 *   active_only?: boolean,
 *   user_id?: number    // only for admin
 * }
 */
export function useGetCats(filters = {}) {
  const fetchCats = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();

      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.search) params.append("search", filters.search);
      if (filters.breed) params.append("breed", filters.breed);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.active_only !== undefined) params.append("active_only", filters.active_only);
      if (filters.user_id) params.append("user_id", filters.user_id);

      const queryString = params.toString();
      const url = `http://localhost:5000/api/cats${queryString ? `?${queryString}` : ""}`;

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
        throw new Error(data.message || "Failed to fetch cats");
      }
      // Expected response: { success: true, data: { cats, pagination } }
      return data.data;
    } catch (err) {
      console.error("Error fetching cats:", err);
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
    queryKey: ["cats", filters],
    queryFn: fetchCats,
    keepPreviousData: true,
  });

  return { cats: data?.cats, pagination: data?.pagination, isLoading, isError, error, refetch };
}

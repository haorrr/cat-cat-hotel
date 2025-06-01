"use client";

import { useQuery } from "@tanstack/react-query";

export function useReviewStats() {
  const fetchStats = async () => {
    const res = await fetch("http://localhost:5000/api/reviews/stats", {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch stats");
    return data.data.stats;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["reviewStats"],
    queryFn: fetchStats,
  });

  return { data, isLoading, isError, error, refetch };
}

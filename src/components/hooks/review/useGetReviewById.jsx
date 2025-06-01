"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetReviewById(id) {
  const fetchReview = async () => {
    if (!id) throw new Error("Review ID is required");

    const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch review");
    return data.data.review;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["review", id],
    queryFn: fetchReview,
    enabled: !!id,
  });

  return { data, isLoading, isError, error, refetch };
}

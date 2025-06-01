"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetSingleNews(id) {
  const fetchNews = async () => {
    if (!id) throw new Error("Missing ID or slug");

    const res = await fetch(`http://localhost:5000/api/news/${id}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch article");

    return data.data.article;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["singleNews", id],
    queryFn: fetchNews,
    enabled: !!id,
  });

  return { data, isLoading, isError, error, refetch };
}

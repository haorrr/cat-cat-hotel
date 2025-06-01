"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetNewsList(params = {}) {
  const fetchNewsList = async () => {
    const url = new URL("http://localhost:5000/api/news");
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch news list");

    return data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["newsList", params],
    queryFn: fetchNewsList,
  });

  return { data, isLoading, isError, error, refetch };
}

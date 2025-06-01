"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetUsersList(params = {}) {
  const fetchUsers = async () => {
    const url = new URL("http://localhost:5000/api/users");
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value);
      }
    });

    const token = localStorage.getItem("token");

    const res = await fetch(url, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");
    return data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["usersList", params],
    queryFn: fetchUsers,
  });

  return { data, isLoading, isError, error, refetch };
}

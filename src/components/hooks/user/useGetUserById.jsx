"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetUserById(id) {
  const fetchUser = async () => {
    if (!id) throw new Error("User ID is required");

    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/users/${id}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    return data.data.user;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["user", id],
    queryFn: fetchUser,
    enabled: !!id,
  });

  return { data, isLoading, isError, error, refetch };
}

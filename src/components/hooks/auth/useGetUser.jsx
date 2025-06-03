"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetUser() {
  const fetchUser = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      throw new Error("Access token is required");
    }

    const res = await fetch("http://localhost:5000/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // nếu server dùng cookie để xác thực
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data.data.user;
  };

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    enabled: !!token, // chỉ gọi khi có token
    retry: false,
  });

  return { user, isLoading, isError, error, refetch };
}

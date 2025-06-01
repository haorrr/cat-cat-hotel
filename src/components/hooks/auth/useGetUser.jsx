"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetUser() {
  const fetchUser = async () => {
    try {
      // Lấy token từ localStorage (nếu lưu token ở đó) hoặc sử dụng cookie tự động gửi kèm
      const token = localStorage.getItem("token");
      
      const res = await fetch("http://localhost:5000/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include", // nếu backend dùng cookie
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }
      return data.data.user;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  };

  // Sử dụng React Query để fetch và cache thông tin user
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchUser,
    retry: false,
  });

  return { user, isLoading, isError, error, refetch };
}

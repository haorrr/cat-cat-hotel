"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter()

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }
      return data;
    } catch (err) {
      console.error("Error during logout:", err);
      throw err;
    }
  };

  const {
    mutate: logoutMutation,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      queryClient.removeQueries(["currentUser"]);
      router.refresh()
    },
  });

  return { logoutMutation, isLoading, isError, error, isSuccess };
}

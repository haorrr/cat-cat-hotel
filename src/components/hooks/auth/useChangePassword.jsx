"use client";

import { useMutation } from "@tanstack/react-query";

export function useChangePassword() {
  const changePassword = async ({ current_password, new_password }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ current_password, new_password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      return data;
    } catch (err) {
      console.error("Error changing password:", err);
      throw err;
    }
  };

  const {
    mutate: changePasswordMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: changePassword,
  });

  return { changePasswordMutation, isPending, isError, error, isSuccess };
}

"use client";

import { useMutation } from "@tanstack/react-query";

export function useResetUserPassword() {
  return useMutation({
    mutationFn: async ({ id, new_password }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/${id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ new_password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      return data;
    },
  });
}

"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");
      return data.data.user;
    },
  });
}

"use client";

import { useMutation } from "@tanstack/react-query";

export function useDeleteUser() {
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      return data;
    }
  });
}

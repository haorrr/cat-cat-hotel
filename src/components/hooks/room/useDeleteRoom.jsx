"use client";

import { useMutation } from "@tanstack/react-query";

export function useDeleteRoom() {
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete room");
      return data;
    },
  });
}

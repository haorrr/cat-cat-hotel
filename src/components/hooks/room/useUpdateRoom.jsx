"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdateRoom() {
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update room");
      return data.data.room;
    },
  });
}

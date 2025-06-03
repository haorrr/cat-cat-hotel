// useDeleteRoomImage.jsx - Fixed version
"use client";

import { useMutation } from "@tanstack/react-query";

export function useDeleteRoomImage() {
  return useMutation({
    mutationFn: async ({ roomId, imageId }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete image");
      return data;
    },
  });
}
// useSetPrimaryImage.jsx - Fixed version
"use client";

import { useMutation } from "@tanstack/react-query";

export function useSetPrimaryImage() {
  return useMutation({
    mutationFn: async ({ roomId, imageId }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/images/set-primary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ imageId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to set primary image");
      return data;
    },
  });
}
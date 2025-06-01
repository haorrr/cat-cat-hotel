"use client";

import { useMutation } from "@tanstack/react-query";

export function useDeleteNews() {
  const mutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete article");

      return data;
    },
  });

  return mutation;
}

"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdateNews() {
  const mutation = useMutation({
    mutationFn: async ({ id, formData }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update article");

      return data.data.article;
    },
  });

  return mutation;
}

"use client";

import { useMutation } from "@tanstack/react-query";

export function useCreateNews() {
  const mutation = useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create article");

      return data.data.article;
    },
  });

  return mutation;
}

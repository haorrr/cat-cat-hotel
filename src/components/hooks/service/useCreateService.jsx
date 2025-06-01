"use client";

import { useMutation } from "@tanstack/react-query";

export function useCreateService() {
  return useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create service");
      return data.data.service;
    },
  });
}

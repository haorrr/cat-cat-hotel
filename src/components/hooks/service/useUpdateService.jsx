"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const token = localStorage.getItem("token");

      if (!id || typeof id !== "number") {
        throw new Error("Invalid service ID");
      }

      const res = await fetch(`http://localhost:5000/api/services/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Update error response:", data);
        throw new Error(data.message || "Failed to update service");
      }

      return data.data?.service || null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["services"]);
    },
    onError: (error) => {
      console.error("❌ Update failed:", error.message);
    },
  });
}

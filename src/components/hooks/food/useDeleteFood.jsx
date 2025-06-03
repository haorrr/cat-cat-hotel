
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để xóa một food item (admin)
 */
export function useDeleteFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodId) => {
      if (!foodId) throw new Error("Food ID is required");

      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete food");

      return data.data?.food || null;
    },

    onSuccess: (_, foodId) => {
      queryClient.invalidateQueries(["foods"]);
      queryClient.removeQueries(["food", foodId]);
      console.log("✅ Food deleted:", foodId);
    },

    onError: (err) => {
      console.error("❌ Delete food failed:", err.message);
    },
  });
}

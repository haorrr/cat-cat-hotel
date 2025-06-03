
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để tạo food mới (chỉ admin)
 */
export function useCreateFood() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foodData) => {
      const token = localStorage.getItem("token");

      if (!foodData.name || !foodData.price_per_serving || !foodData.category) {
        throw new Error("Name, price_per_serving, and category are required");
      }

      const validCategories = ["dry", "wet", "treats", "prescription"];
      if (!validCategories.includes(foodData.category)) {
        throw new Error("Invalid category");
      }

      if (foodData.price_per_serving < 0) {
        throw new Error("Price must be a positive number");
      }

      const res = await fetch("http://localhost:5000/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(foodData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create food");

      return data.data.food;
    },

    onSuccess: (food) => {
      queryClient.invalidateQueries(["foods"]);
      console.log("✅ Food created:", food);
    },

    onError: (err) => {
      console.error("❌ Food creation failed:", err.message);
    },
  });
}

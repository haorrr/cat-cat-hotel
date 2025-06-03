
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để cập nhật food (chỉ admin)
 */
export function useUpdateFood(foodId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData) => {
      if (!foodId) throw new Error("Invalid food ID");

      const token = localStorage.getItem("token");

      const filteredData = {};
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] !== undefined && updateData[key] !== "") {
          filteredData[key] = updateData[key];
        }
      });

      const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(filteredData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update food");

      return data.data.food;
    },

    onSuccess: (food) => {
      queryClient.invalidateQueries(["foods"]);
      queryClient.setQueryData(["food", foodId], food);
    },

    onError: (err) => {
      console.error("Update failed:", err.message);
    },
  });
}

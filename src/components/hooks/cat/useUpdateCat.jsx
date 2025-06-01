// src/components/hooks/cat/useUpdateCat.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để cập nhật thông tin mèo
 * @param {number} catId - ID của con mèo cần cập nhật
 */
export function useUpdateCat(catId) {
  const queryClient = useQueryClient();

  const updateCat = async (catData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/cats/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(catData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update cat");
      }
      return data.data.cat;
    } catch (err) {
      console.error("Error updating cat:", err);
      throw err;
    }
  };

  const {
    mutate: updateCatMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: updatedCat,
  } = useMutation({
    mutationFn: updateCat,
    onSuccess: (cat) => {
      // Invalidate và update cache
      queryClient.invalidateQueries(["cats"]);
      queryClient.setQueryData(["cat", catId], cat);
    },
  });

  return { updateCatMutation, isLoading, isError, error, isSuccess, updatedCat };
}

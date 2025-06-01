// src/components/hooks/cat/useDeleteCat.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để xóa mèo (soft delete)
 */
export function useDeleteCat() {
  const queryClient = useQueryClient();

  const deleteCat = async (catId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/cats/${catId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete cat");
      }
      return data;
    } catch (err) {
      console.error("Error deleting cat:", err);
      throw err;
    }
  };

  const {
    mutate: deleteCatMutation,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: deleteCat,
    onSuccess: () => {
      // Invalidate cats list để refresh data
      queryClient.invalidateQueries(["cats"]);
    },
  });

  return { deleteCatMutation, isLoading, isError, error, isSuccess };
}

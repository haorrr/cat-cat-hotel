"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * catData: {
 *   name: string,
 *   breed?: string,
 *   age?: number,
 *   weight?: number,
 *   gender: string,
 *   color?: string,
 *   medical_notes?: string,
 *   special_requirements?: string,
 *   vaccination_status?: string
 * }
 */
export function useCreateCat() {
  const queryClient = useQueryClient();

  const createCat = async (catData) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(catData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add cat");
      }
      return data.data.cat;
    } catch (err) {
      console.error("Error creating cat:", err);
      throw err;
    }
  };

  const {
    mutate: createCatMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: newCat,
  } = useMutation({
    mutationFn: createCat,
    onSuccess: (cat) => {
      // Invalidate cats list so it can be refetched
      queryClient.invalidateQueries(["cats"]);
    },
  });

  return { createCatMutation, isLoading, isError, error, isSuccess, newCat };
}

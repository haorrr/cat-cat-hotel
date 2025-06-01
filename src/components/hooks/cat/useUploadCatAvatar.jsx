"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để upload avatar cho mèo
 * @param {number} catId - ID của con mèo
 */
export function useUploadCatAvatar(catId) {
  const queryClient = useQueryClient();

  const uploadAvatar = async (file) => {
    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`http://localhost:5000/api/cats/${catId}/avatar`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload avatar");
      }
      return data.data;
    } catch (err) {
      console.error("Error uploading avatar:", err);
      throw err;
    }
  };

  const {
    mutate: uploadAvatarMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: avatarData,
  } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      // Invalidate cat data để refresh avatar
      queryClient.invalidateQueries(["cat", catId]);
      queryClient.invalidateQueries(["cats"]);
    },
  });

  return { uploadAvatarMutation, isLoading, isError, error, isSuccess, avatarData };
}

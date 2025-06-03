// src/components/hooks/room/useUploadRoomImages.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để upload ảnh cho room
 * @param {number} roomId - ID của room
 */
export function useUploadRoomImages(roomId) {
  const queryClient = useQueryClient();

  const uploadImages = async (files) => {
    try {
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      
      // Add multiple files
      if (Array.isArray(files)) {
        files.forEach((file) => {
          formData.append("images", file);
        });
      } else {
        formData.append("images", files);
      }

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/images`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to upload images");
      }
      
      return data.data;
    } catch (err) {
      console.error("Error uploading images:", err);
      throw err;
    }
  };

  const {
    mutate: uploadImagesMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: uploadedImages,
  } = useMutation({
    mutationFn: uploadImages,
    onSuccess: () => {
      // Invalidate room data để refresh images
      queryClient.invalidateQueries(["room", roomId]);
      queryClient.invalidateQueries(["roomsList"]);
    },
  });

  return { 
    uploadImagesMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    uploadedImages 
  };
}

// Hook để xóa ảnh room
export function useDeleteRoomImage() {
  const queryClient = useQueryClient();

  const deleteImage = async ({ roomId, imageId }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/images/${imageId}`, {
        method: "DELETE",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete image");
      }
      
      return data;
    } catch (err) {
      console.error("Error deleting image:", err);
      throw err;
    }
  };

  const {
    mutate: deleteImageMutation,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: deleteImage,
    onSuccess: (data, variables) => {
      // Invalidate room data để refresh images
      queryClient.invalidateQueries(["room", variables.roomId]);
      queryClient.invalidateQueries(["roomsList"]);
    },
  });

  return { 
    deleteImageMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess 
  };
}

// Hook để set ảnh chính cho room
export function useSetRoomMainImage() {
  const queryClient = useQueryClient();

  const setMainImage = async ({ roomId, imageId }) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/rooms/${roomId}/images/${imageId}/main`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to set main image");
      }
      
      return data;
    } catch (err) {
      console.error("Error setting main image:", err);
      throw err;
    }
  };

  const {
    mutate: setMainImageMutation,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: setMainImage,
    onSuccess: (data, variables) => {
      // Invalidate room data để refresh images
      queryClient.invalidateQueries(["room", variables.roomId]);
      queryClient.invalidateQueries(["roomsList"]);
    },
  });

  return { 
    setMainImageMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess 
  };
}
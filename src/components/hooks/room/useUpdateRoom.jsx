// useUpdateRoom.jsx - Fixed version
"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdateRoom() {
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const token = localStorage.getItem("token");

      // Create FormData for file upload
      const form = new FormData();
      
      // Add room data
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && key !== 'removeImages') {
          if (key === 'amenities' && Array.isArray(formData[key])) {
            // Send amenities as JSON string
            form.append(key, JSON.stringify(formData[key]));
          } else if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
            form.append(key, formData[key]);
          }
        }
      });

      // Add images to remove
      if (formData.removeImages && formData.removeImages.length > 0) {
        form.append('remove_images', JSON.stringify(formData.removeImages));
      }

      // Add new images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file, index) => {
          form.append('images', file);
        });
      }

      const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
        method: "PUT",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData, let browser set it
        },
        credentials: "include",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update room");
      return data.data.room;
    },
  });
}

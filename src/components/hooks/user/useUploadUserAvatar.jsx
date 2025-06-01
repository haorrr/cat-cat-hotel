"use client";

import { useMutation } from "@tanstack/react-query";

export function useUploadUserAvatar() {
  return useMutation({
    mutationFn: async ({ id, file }) => {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch(`http://localhost:5000/api/users/${id}/avatar`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");
      return data.data;
    },
  });
}

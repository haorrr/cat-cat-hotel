"use client";

import { useMutation } from "@tanstack/react-query";

export function useCreatePayment() {
  return useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create payment");
      return data.data.payment;
    },
  });
}

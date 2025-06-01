"use client";

import { useMutation } from "@tanstack/react-query";

export function useUpdatePaymentStatus() {
  return useMutation({
    mutationFn: async ({ id, status, notes }) => {
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:5000/api/payments/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify({ payment_status: status, notes }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update payment status");
      return data.data.payment;
    },
  });
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRegister() {
//   const router = useRouter();
//   const queryClient = useQueryClient();

  const {
    mutate: registerMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, email, password, full_name, phone, address }) => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({username, email, password, full_name, phone, address}),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Đăng ký thành công");
    },
  });
  return { registerMutation, isError, error, isPending };
};



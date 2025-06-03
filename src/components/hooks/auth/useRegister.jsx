"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useRegister() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: registerMutation,
    isPending,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: async ({ username, email, password, full_name, phone, address }) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ 
            username, 
            email, 
            password, 
            full_name, 
            phone: phone || null, 
            address: address || null 
          }),
        });

        const data = await res.json();
        console.log("Register response:", data);

        if (!res.ok) {
          throw new Error(data.message || data.error || "Registration failed");
        }

        return data;
      } catch (err) {
        console.error("Register error:", err);
        throw err;
      }
    },

    onSuccess: (data) => {
      console.log("Registration successful:", data);
      
      // Save token if available
      if (data?.data?.token) {
        localStorage.setItem("token", data.data.token);
        // Update user cache
        if (data.data.user) {
          queryClient.setQueryData(["currentUser"], data.data.user);
        }
      }

      // Redirect to login page or dashboard
      router.push("/auth/login?registered=true");
    },

    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  return { 
    registerMutation, 
    isError, 
    error, 
    isPending, 
    isSuccess 
  };
}
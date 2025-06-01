"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ email, password }) => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }

        return data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    onSuccess: (data) => {
      // Giả sử response trả về { success, message, data: { user, token } }
      const { token, user } = data.data;

      // Lưu token vào localStorage (hoặc cookie tùy nhu cầu)
      localStorage.setItem("token", token);

      // Cập nhật cache user nếu có query tương ứng
      queryClient.setQueryData(["currentUser"], user);

      // Chuyển hướng sau khi login thành công
      router.refresh()
    },
  });

  return { loginMutation, isError, error, isPending };
}

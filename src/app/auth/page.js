// src/app/auth/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Login } from "../../components/auth/Login";
import { Register } from "../../components/auth/Register";
import { useGetUser } from "../../components/hooks/auth/useGetUser";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { user, isLoading } = useGetUser();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render auth forms if user is already logged in
  if (user) {
    return null;
  }

  return isLogin ? (
    <Login onToggleMode={toggleMode} />
  ) : (
    <Register onToggleMode={toggleMode} />
  );
}
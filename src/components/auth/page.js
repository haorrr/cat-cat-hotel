// src/app/auth/page.js
"use client";

import { useState } from "react";
import { Login } from "../../components/auth/Login";
import { Register } from "../../components/auth/Register";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
  };

  return isLogin ? (
    <Login onToggleMode={toggleMode} />
  ) : (
    <Register onToggleMode={toggleMode} />
  );
}
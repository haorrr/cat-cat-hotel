"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "../hooks/auth/useLogout";

export default function LogoutButton() {
  const { logoutMutation, isLoading, isError, error, isSuccess } = useLogout();

  const handleLogout = () => {
    logoutMutation();
  };

  return (
    <div className="flex flex-col items-center">
      <Button onClick={handleLogout} disabled={isLoading} className="bg-red-500 text-white">
        {isLoading ? "Logging out..." : "Logout"}
      </Button>

      {isError && <p className="mt-2 text-red-600">Error: {error.message}</p>}

      {isSuccess && <p className="mt-2 text-green-600">Logged out successfully.</p>}
    </div>
  );
}

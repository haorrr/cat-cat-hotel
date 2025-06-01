"use client";

import React from "react";
import { useGetUser } from "../hooks/auth/useGetUser";

export default function GetUser() {
  const { user, isLoading, isError, error, refetch } = useGetUser();

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (isError) {
    return (
      <div>
        <p className="text-red-600">Error: {error.message}</p>
        <button onClick={() => refetch()} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="text-semibold text-2xl" >Chưa đăng nhâp</div>;
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-2">User Profile</h2>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Full Name:</strong> {user.full_name}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone || "N/A"}
      </p>
      <p>
        <strong>Address:</strong> {user.address || "N/A"}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Avatar URL:</strong> {user.avatar || "N/A"}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong> {new Date(user.updated_at).toLocaleString()}
      </p>
    </div>
  );
}

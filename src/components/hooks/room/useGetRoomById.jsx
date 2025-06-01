"use client";

import { useQuery } from "@tanstack/react-query";

export function useGetRoomById(id) {
  const fetchRoom = async () => {
    if (!id) throw new Error("Room ID is required");

    const res = await fetch(`http://localhost:5000/api/rooms/${id}`, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch room");
    return data.data.room;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["room", id],
    queryFn: fetchRoom,
    enabled: !!id,
  });

  return { data, isLoading, isError, error, refetch };
}

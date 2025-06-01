"use client";

import { useQuery } from "@tanstack/react-query";

export function useCheckRoomAvailability(id, startDate, endDate) {
  const fetchAvailability = async () => {
    if (!id || !startDate || !endDate) throw new Error("Missing parameters");

    const url = new URL(`http://localhost:5000/api/rooms/${id}/availability`);
    url.searchParams.append("start_date", startDate);
    url.searchParams.append("end_date", endDate);

    const res = await fetch(url, {
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to check availability");
    return data.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["roomAvailability", id, startDate, endDate],
    queryFn: fetchAvailability,
    enabled: !!id && !!startDate && !!endDate,
  });

  return { data, isLoading, isError, error, refetch };
}

"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetBooking } from "../hooks/booking/useGetBooking";

export default function GetBookings() {
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const { bookings, pagination, isLoading, isError, error, refetch } = useGetBooking(filters);

  const handleNext = () => {
    if (pagination?.current_page < pagination?.total_pages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrev = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const onFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách đặt phòng</h2>

      <div className="flex space-x-2 mb-4">
        <Input
          name="status"
          placeholder="Status"
          onChange={onFilterChange}
          value={filters.status || ""}
          className="w-32"
        />
        <Input
          name="start_date"
          type="date"
          onChange={onFilterChange}
          value={filters.start_date || ""}
        />
        <Input
          name="end_date"
          type="date"
          onChange={onFilterChange}
          value={filters.end_date || ""}
        />
        <Button onClick={() => refetch()}>Áp dụng bộ lọc</Button>
      </div>

      {isLoading && <div>Loading bookings...</div>}

      {isError && (
        <div>
          <p className="text-red-600">Error: {error.message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isLoading && !isError && bookings?.length === 0 && <div>Không có booking nào.</div>}

      {!isLoading && !isError && bookings?.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Cat</th>
              <th className="border p-2">Room</th>
              <th className="border p-2">Check In</th>
              <th className="border p-2">Check Out</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="border p-2">{b.id}</td>
                <td className="border p-2">{b.customer_name}</td>
                <td className="border p-2">{b.cat_name}</td>
                <td className="border p-2">{b.room_name}</td>
                <td className="border p-2">{new Date(b.check_in_date).toLocaleDateString()}</td>
                <td className="border p-2">{new Date(b.check_out_date).toLocaleDateString()}</td>
                <td className="border p-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {!isLoading && !isError && pagination && (
        <div className="flex justify-between items-center mt-4">
          <Button onClick={handlePrev} disabled={filters.page === 1}>
            Previous
          </Button>
          <span>
            Page {pagination.current_page} of {pagination.total_pages}
          </span>
          <Button onClick={handleNext} disabled={filters.page === pagination.total_pages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

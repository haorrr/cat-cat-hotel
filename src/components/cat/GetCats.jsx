"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useGetCats } from "../hooks/cat/useGetCats";

export default function GetCats() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, active_only: false });
  const { cats, pagination, isLoading, isError, error, refetch } = useGetCats(filters);

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
    const { name, value, type, checked } = e.target;
    let val = value;
    if (type === "checkbox") val = checked;
    setFilters((prev) => ({ ...prev, [name]: val, page: 1 }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Danh sách mèo</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          name="search"
          placeholder="Search name or breed"
          value={filters.search || ""}
          onChange={onFilterChange}
          className="w-40"
        />
        <Input
          name="breed"
          placeholder="Breed"
          value={filters.breed || ""}
          onChange={onFilterChange}
          className="w-32"
        />
        <Select
          onValueChange={(value) => onFilterChange({ target: { name: 'gender', value } })}
          value={filters.gender || ""}
          defaultValue=""
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            name="active_only"
            checked={!!filters.active_only}
            onChange={onFilterChange}
          />
          <span>Active Only</span>
        </label>
        <Button onClick={() => refetch()}>Áp dụng bộ lọc</Button>
      </div>

      {isLoading && <div>Loading cats...</div>}

      {isError && (
        <div>
          <p className="text-red-600">Error: {error.message}</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isLoading && !isError && cats?.length === 0 && <div>Không có mèo nào.</div>}

      {!isLoading && !isError && cats?.length > 0 && (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Breed</th>
              <th className="border p-2">Gender</th>
              <th className="border p-2">Owner</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.id}</td>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">{c.breed}</td>
                <td className="border p-2">{c.gender}</td>
                <td className="border p-2">{c.owner_name}</td>
                <td className="border p-2">{c.owner_email}</td>
                <td className="border p-2">{c.owner_phone}</td>
                <td className="border p-2">{c.is_active ? "Yes" : "No"}</td>
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

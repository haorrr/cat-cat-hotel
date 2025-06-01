// src/components/cat/CatBreeds.jsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetCatBreeds } from "../hooks/cat/useGetCatBreeds";

export default function CatBreeds() {
  const [searchTerm, setSearchTerm] = useState("");
  const { breeds, isLoading, isError, error, refetch } = useGetCatBreeds();

  // Filter breeds based on search term
  const filteredBreeds = breeds?.filter(breed =>
    breed.breed.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Sort breeds by count (most popular first)
  const sortedBreeds = filteredBreeds.sort((a, b) => b.count - a.count);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-purple-700">Cat Breeds Management</h2>
        <Button onClick={() => refetch()} variant="outline">
          Refresh Breeds
        </Button>
      </div>

      <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-2">📊 Breed Statistics</h3>
        <p className="text-purple-700 text-sm">
          View all cat breeds in your database with the number of cats for each breed. 
          This data is automatically updated when cats are added or modified.
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading cat breeds...</p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-8">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 mb-4">Error: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* No Breeds */}
      {!isLoading && !isError && breeds?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No breeds found. Add some cats with breed information first.</p>
        </div>
      )}

      {/* Breeds Found but No Results After Filter */}
      {!isLoading && !isError && breeds?.length > 0 && filteredBreeds.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-gray-600">No breeds found matching "{searchTerm}"</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchTerm("")}
            className="mt-2"
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Breeds Statistics Summary */}
      {!isLoading && !isError && breeds?.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <h4 className="font-semibold text-blue-800">Total Breeds</h4>
            <p className="text-2xl font-bold text-blue-600">{breeds.length}</p>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <h4 className="font-semibold text-green-800">Total Cats</h4>
            <p className="text-2xl font-bold text-green-600">
              {breeds.reduce((sum, breed) => sum + breed.count, 0)}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-yellow-50">
            <h4 className="font-semibold text-yellow-800">Most Popular</h4>
            <p className="text-lg font-bold text-yellow-600">
              {breeds.length > 0 ? breeds.sort((a, b) => b.count - a.count)[0].breed : "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Breeds List */}
      {!isLoading && !isError && sortedBreeds.length > 0 && (
        <div className="space-y-4">
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedBreeds.map((breed, index) => (
              <div 
                key={breed.breed}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{breed.breed}</h3>
                    <p className="text-sm text-gray-600">
                      {breed.count} cat{breed.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold text-purple-600">
                      {breed.count}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(breed.count / Math.max(...breeds.map(b => b.count))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Table View Toggle */}
          <div className="mt-8">
            <details className="border rounded-lg">
              <summary className="p-4 cursor-pointer font-semibold bg-gray-50 hover:bg-gray-100">
                View as Table (Click to expand)
              </summary>
              <div className="p-4 overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-3 text-left">Rank</th>
                      <th className="border border-gray-300 p-3 text-left">Breed Name</th>
                      <th className="border border-gray-300 p-3 text-center">Cat Count</th>
                      <th className="border border-gray-300 p-3 text-center">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBreeds.map((breed, index) => {
                      const totalCats = breeds.reduce((sum, b) => sum + b.count, 0);
                      const percentage = ((breed.count / totalCats) * 100).toFixed(1);
                      
                      return (
                        <tr key={breed.breed} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-3 font-medium">
                            #{index + 1}
                          </td>
                          <td className="border border-gray-300 p-3 font-medium">
                            {breed.breed}
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                              {breed.count}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-3 text-center">
                            {percentage}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {searchTerm && filteredBreeds.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredBreeds.length} breed{filteredBreeds.length !== 1 ? 's' : ''} 
          matching "{searchTerm}" out of {breeds?.length || 0} total breeds
        </div>
      )}
    </div>
  );
}
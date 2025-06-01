// src/app/dashboard/cats/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cat,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Heart,
  Calendar,
  Info,
  Camera,
  MoreVertical
} from "lucide-react";
import { useGetCats } from "../../../components/hooks/cat/useGetCats";
import { useDeleteCat } from "../../../components/hooks/cat/useDeleteCat";
import { useGetCatBreeds } from "../../../components/hooks/cat/useGetCatBreeds";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function CatsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);

  const { cats, isLoading, refetch } = useGetCats({
    search: searchTerm,
    breed: selectedBreed,
    gender: selectedGender,
    active_only: true
  });

  const { breeds } = useGetCatBreeds();
  const { deleteCatMutation, isLoading: isDeleting } = useDeleteCat();

  const handleDeleteCat = (catId) => {
    if (window.confirm("Are you sure you want to remove this cat? This action cannot be undone.")) {
      deleteCatMutation(catId, {
        onSuccess: () => {
          refetch();
          setSelectedCat(null);
        }
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedBreed("");
    setSelectedGender("");
  };

  const filteredCats = cats || [];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Cats</h1>
            <p className="text-gray-600">
              Manage your furry family members and their information
            </p>
          </div>
          <Link
            href="/dashboard/cats/new"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Cat
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cats by name or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <select
                    value={selectedBreed}
                    onChange={(e) => setSelectedBreed(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Breeds</option>
                    {breeds?.map((breed) => (
                      <option key={breed.breed} value={breed.breed}>
                        {breed.breed} ({breed.count})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Genders</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cats Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gray-200 rounded-full h-16 w-16"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 h-6 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-200 h-4 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCats.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                {/* Cat Avatar and Basic Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {cat.avatar ? (
                          <img
                            src={cat.avatar}
                            alt={cat.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="bg-gradient-to-r from-orange-400 to-pink-400 h-16 w-16 rounded-full flex items-center justify-center">
                            <Cat className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 bg-green-500 h-5 w-5 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                        <p className="text-gray-600">{cat.breed || "Mixed breed"}</p>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-400" />
                      </button>

                      {selectedCat === cat.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <Link
                              href={`/dashboard/cats/${cat.id}`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setSelectedCat(null)}
                            >
                              <Info className="h-4 w-4 mr-3" />
                              View Details
                            </Link>
                            <Link
                              href={`/dashboard/cats/${cat.id}/edit`}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setSelectedCat(null)}
                            >
                              <Edit className="h-4 w-4 mr-3" />
                              Edit Info
                            </Link>
                            <button
                              onClick={() => handleDeleteCat(cat.id)}
                              disabled={isDeleting}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4 mr-3" />
                              Remove Cat
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cat Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Age:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {cat.age ? `${cat.age} years` : "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="ml-2 font-medium text-gray-900 capitalize">
                          {cat.gender}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {cat.weight ? `${cat.weight} kg` : "Unknown"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {cat.color || "Not specified"}
                        </span>
                      </div>
                    </div>

                    {cat.medical_notes && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                          <strong>Medical Notes:</strong> {cat.medical_notes}
                        </p>
                      </div>
                    )}

                    {cat.special_requirements && (
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          <strong>Special Requirements:</strong> {cat.special_requirements}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-3">
                    <Link
                      href={`/dashboard/bookings/new?cat_id=${cat.id}`}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 text-center"
                    >
                      Book Stay
                    </Link>
                    <Link
                      href={`/dashboard/cats/${cat.id}`}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200 text-center"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Cat className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cats found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedBreed || selectedGender
                ? "Try adjusting your search filters to find your cats."
                : "Start by adding your first furry family member to get started with bookings."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/cats/new"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Your First Cat
              </Link>
              {(searchTerm || selectedBreed || selectedGender) && (
                <button
                  onClick={clearFilters}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
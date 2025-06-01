// src/app/dashboard/rooms/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Search,
  Filter,
  MapPin,
  Users,
  DollarSign,
  Star,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Heart,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useGetRoomsList } from "../../../components/hooks/room/useGetRoomsList";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const { data: roomsData, isLoading } = useGetRoomsList({
    search: searchTerm,
    room_type: selectedRoomType,
    min_price: priceRange.min,
    max_price: priceRange.max,
    available_only: availabilityFilter === "available"
  });

  const rooms = roomsData?.rooms || [];

  const roomTypes = [
    { value: "standard", label: "Standard Room", color: "bg-blue-100 text-blue-800" },
    { value: "deluxe", label: "Deluxe Room", color: "bg-purple-100 text-purple-800" },
    { value: "suite", label: "Suite", color: "bg-yellow-100 text-yellow-800" },
    { value: "presidential", label: "Presidential Suite", color: "bg-red-100 text-red-800" }
  ];

  const getAmenityIcon = (amenity) => {
    const amenityMap = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      tv: Tv,
      ac: Wind,
      default: Heart
    };
    return amenityMap[amenity.toLowerCase()] || amenityMap.default;
  };

  const getRoomTypeInfo = (type) => {
    return roomTypes.find(rt => rt.value === type) || { 
      label: type, 
      color: "bg-gray-100 text-gray-800" 
    };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRoomType("");
    setPriceRange({ min: "", max: "" });
    setAvailabilityFilter("all");
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Rooms & Suites</h1>
            <p className="text-gray-600">
              Discover our comfortable accommodations for your feline friends
            </p>
          </div>
          <Link
            href="/dashboard/bookings/new"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 inline-flex items-center"
          >
            <Calendar className="h-5 w-5 mr-2" />
            Book a Room
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
                placeholder="Search rooms by name or description..."
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
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Type
                  </label>
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {roomTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">All Rooms</option>
                    <option value="available">Available Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="$999"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Rooms Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-200"></div>
                <div className="p-6 space-y-4">
                  <div className="bg-gray-200 h-6 rounded"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => {
              const roomTypeInfo = getRoomTypeInfo(room.room_type);
              
              return (
                <div key={room.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.images?.[0]?.url || "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=400&h=300&fit=crop"}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roomTypeInfo.color}`}>
                        {roomTypeInfo.label}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      {room.is_available ? (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </div>
                      ) : (
                        <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <XCircle className="h-3 w-3 mr-1" />
                          Occupied
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-lg">
                      <span className="text-lg font-bold">${room.price_per_day}</span>
                      <span className="text-sm">/night</span>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{room.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{room.description}</p>
                    </div>

                    {/* Room Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Up to {room.capacity} cats</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{room.size_sqm || "N/A"} sq ft</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-2">
                          {room.amenities.slice(0, 4).map((amenity, index) => {
                            const IconComponent = getAmenityIcon(amenity);
                            return (
                              <div
                                key={index}
                                className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs"
                              >
                                <IconComponent className="h-3 w-3 mr-1" />
                                <span className="capitalize">{amenity}</span>
                              </div>
                            );
                          })}
                          {room.amenities.length > 4 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{room.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-900">4.8</span>
                        <span className="text-sm text-gray-500 ml-1">(24 reviews)</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {room.popularity_score || 0} bookings this month
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Link
                        href={`/dashboard/rooms/${room.id}`}
                        className="block w-full text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                      >
                        View Details
                      </Link>
                      {room.is_available && (
                        <Link
                          href={`/dashboard/bookings/new?room_id=${room.id}`}
                          className="block w-full text-center bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 font-medium"
                        >
                          Book This Room
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Building className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedRoomType || priceRange.min || priceRange.max
                ? "Try adjusting your search filters to find available rooms."
                : "No rooms are currently available. Please check back later."}
            </p>
            {(searchTerm || selectedRoomType || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {roomsData?.pagination && roomsData.pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {roomsData.pagination.current_page} of {roomsData.pagination.total_pages}
              </span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
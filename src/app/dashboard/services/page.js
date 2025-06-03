// src/app/dashboard/services/page.js
"use client";

import { useState } from "react";
import {
  Scissors,
  Heart,
  PlayCircle,
  GraduationCap,
  Star,
  Search,
  Filter,
  DollarSign,
  Clock,
  Info,
  Calendar,
  CheckCircle
} from "lucide-react";
import { useGetServicesList } from "../../../components/hooks/service/useGetServicesList";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  const { data: servicesData, isLoading } = useGetServicesList({
    search: searchTerm,
    category: selectedCategory,
    min_price: priceRange.min,
    max_price: priceRange.max,
    active_only: true
  });

  const services = servicesData?.services || [];

  const serviceCategories = [
    { value: "grooming", label: "Grooming", icon: Scissors, color: "bg-pink-100 text-pink-800" },
    { value: "medical", label: "Medical Care", icon: Heart, color: "bg-red-100 text-red-800" },
    { value: "play", label: "Play & Exercise", icon: PlayCircle, color: "bg-green-100 text-green-800" },
    { value: "training", label: "Training", icon: GraduationCap, color: "bg-blue-100 text-blue-800" },
    { value: "special", label: "Special Care", icon: Star, color: "bg-yellow-100 text-yellow-800" }
  ];

  const getCategoryInfo = (category) => {
    return serviceCategories.find(cat => cat.value === category) || 
           { label: category, icon: Star, color: "bg-gray-100 text-gray-800" };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cat Care Services</h1>
            <p className="text-gray-600">
              Premium services to keep your cat happy and healthy
            </p>
          </div>
          <div className="mt-4 lg:mt-0 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Book Services</p>
                <p className="text-xs text-blue-700">Add services when booking a room</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {serviceCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

        {/* Service Categories Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {serviceCategories.map((category) => {
            const categoryServices = services.filter(s => s.category === category.value);
            const Icon = category.icon;
            
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(selectedCategory === category.value ? "" : category.value)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.value
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`inline-flex p-2 rounded-lg ${category.color} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.label}</h3>
                <p className="text-xs text-gray-600">{categoryServices.length} services</p>
              </button>
            );
          })}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="bg-gray-200 h-12 w-12 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-4"></div>
                <div className="bg-gray-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const categoryInfo = getCategoryInfo(service.category);
              const Icon = categoryInfo.icon;
              
              return (
                <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    {/* Service Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-xl ${categoryInfo.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                    </div>

                    {/* Service Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{service.description}</p>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className="text-sm">Price</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(service.price)}
                        </span>
                      </div>

                      {service.duration && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">Duration</span>
                          </div>
                          <span className="text-sm text-gray-900">
                            {service.duration} minutes
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">Availability</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          service.is_active ? "text-green-600" : "text-red-600"
                        }`}>
                          {service.is_active ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="space-y-3">
                      <button
                        disabled={!service.is_active}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Add to Booking
                      </button>
                      
                      <div className="text-center">
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Scissors className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory || priceRange.min || priceRange.max
                ? "Try adjusting your search filters to find available services."
                : "No services are currently available. Please check back later."}
            </p>
            {(searchTerm || selectedCategory || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* How to Book Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How to Book Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Your Room</h3>
              <p className="text-gray-600 text-sm">
                Start by booking a room for your cat's stay
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Services</h3>
              <p className="text-gray-600 text-sm">
                Select additional services during the booking process
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Enjoy & Relax</h3>
              <p className="text-gray-600 text-sm">
                Let our professionals take care of your cat
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
// src/app/dashboard/foods/page.js
"use client";

import { useState } from "react";
import {
  Coffee,
  Droplets,
  Cookie,
  Heart,
  Search,
  Filter,
  DollarSign,
  Info,
  Calendar,
  CheckCircle,
  Award,
  Star
} from "lucide-react";
import { useGetFoods } from "../../../components/hooks/food/useGetFoods";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function FoodsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [showFilters, setShowFilters] = useState(false);

  const { foods, isLoading } = useGetFoods({
    search: searchTerm,
    category: selectedCategory,
    brand: selectedBrand,
    active_only: true
  });

  const foodCategories = [
    { 
      value: "dry", 
      label: "Dry Food", 
      icon: Coffee, 
      color: "bg-amber-100 text-amber-800",
      description: "Complete nutrition in convenient kibble form"
    },
    { 
      value: "wet", 
      label: "Wet Food", 
      icon: Droplets, 
      color: "bg-blue-100 text-blue-800",
      description: "Moisture-rich meals for hydration"
    },
    { 
      value: "treats", 
      label: "Treats", 
      icon: Cookie, 
      color: "bg-pink-100 text-pink-800",
      description: "Delicious rewards and snacks"
    },
    { 
      value: "prescription", 
      label: "Prescription", 
      icon: Heart, 
      color: "bg-red-100 text-red-800",
      description: "Specialized diets for health conditions"
    }
  ];

  const getCategoryInfo = (category) => {
    return foodCategories.find(cat => cat.value === category) || 
           { label: category, icon: Coffee, color: "bg-gray-100 text-gray-800" };
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
    setSelectedBrand("");
    setPriceRange({ min: "", max: "" });
  };

  // Get unique brands
  const uniqueBrands = [...new Set(foods?.map(food => food.brand).filter(Boolean))].sort();

  const filteredFoods = foods?.filter(food => {
    if (priceRange.min && food.price_per_serving < parseFloat(priceRange.min)) return false;
    if (priceRange.max && food.price_per_serving > parseFloat(priceRange.max)) return false;
    return true;
  }) || [];

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Premium Cat Foods</h1>
            <p className="text-gray-600">
              Nutritious and delicious meals for every cat's needs
            </p>
          </div>
          <div className="mt-4 lg:mt-0 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center">
              <Info className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">Special Diets</p>
                <p className="text-xs text-green-700">Add food preferences when booking</p>
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
                placeholder="Search foods by name, brand, or ingredients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {foodCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
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
                    step="0.01"
                    placeholder="$0.00"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="$99.99"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

        {/* Food Categories Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {foodCategories.map((category) => {
            const categoryFoods = foods?.filter(f => f.category === category.value) || [];
            const Icon = category.icon;
            
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(selectedCategory === category.value ? "" : category.value)}
                className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedCategory === category.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className={`inline-flex p-3 rounded-xl ${category.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.label}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-xs text-gray-500">{categoryFoods.length} options available</p>
              </button>
            );
          })}
        </div>

        {/* Foods Grid */}
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
        ) : filteredFoods.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => {
              const categoryInfo = getCategoryInfo(food.category);
              const Icon = categoryInfo.icon;
              
              return (
                <div key={food.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
                  <div className="p-6">
                    {/* Food Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex p-3 rounded-xl ${categoryInfo.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                        {categoryInfo.label}
                      </span>
                    </div>

                    {/* Food Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{food.name}</h3>
                      {food.brand && (
                        <p className="text-sm text-gray-600 mb-2">{food.brand}</p>
                      )}
                      {food.description && (
                        <p className="text-gray-600 text-sm line-clamp-2">{food.description}</p>
                      )}
                    </div>

                    {/* Food Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span className="text-sm">Per Serving</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(food.price_per_serving)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-600">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="text-sm">Availability</span>
                        </div>
                        <span className={`text-sm font-medium ${
                          food.is_active ? "text-green-600" : "text-red-600"
                        }`}>
                          {food.is_active ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      {food.category === "prescription" && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 text-red-500 mr-2" />
                            <p className="text-xs text-red-700">
                              Requires veterinary prescription
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Nutritional Info */}
                    {food.nutritional_info && Object.keys(food.nutritional_info).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Nutritional Highlights</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(food.nutritional_info).slice(0, 4).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-2">
                              <p className="text-xs text-gray-600 capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <p className="text-sm font-medium text-gray-900">{value}%</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ingredients Preview */}
                    {food.ingredients && (
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Key Ingredients</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {food.ingredients}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button
                        disabled={!food.is_active}
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Calendar className="h-5 w-5 mr-2" />
                        Add to Booking
                      </button>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 text-green-600 hover:text-green-700 text-sm font-medium py-2 border border-green-300 rounded-lg hover:bg-green-50 transition-colors duration-200">
                          View Details
                        </button>
                        <button className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          Nutrition Facts
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
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Coffee className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No foods found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory || selectedBrand || priceRange.min || priceRange.max
                ? "Try adjusting your search filters to find available foods."
                : "No foods are currently available. Please check back later."}
            </p>
            {(searchTerm || selectedCategory || selectedBrand || priceRange.min || priceRange.max) && (
              <button
                onClick={clearFilters}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Feeding Guidelines Section */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Feeding Guidelines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality First</h3>
              <p className="text-gray-600 text-sm">
                All our foods are premium quality with high-grade ingredients
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Proper Portions</h3>
              <p className="text-gray-600 text-sm">
                We follow feeding guidelines based on your cat's weight and age
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Special Diets</h3>
              <p className="text-gray-600 text-sm">
                Prescription and specialized foods available for health conditions
              </p>
            </div>
          </div>
        </div>

        {/* Food Safety Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <Info className="h-5 w-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-yellow-900 mb-1">Food Safety & Allergies</h3>
              <p className="text-sm text-yellow-700">
                Please inform us of any food allergies or dietary restrictions your cat may have. 
                We'll ensure your cat receives appropriate nutrition during their stay. 
                Prescription foods require valid veterinary authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
// src/app/dashboard/reviews/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Cat,
  Building,
  MessageSquare,
  ThumbsUp,
  Award,
  TrendingUp
} from "lucide-react";
import { useGetReviewsList } from "../../../components/hooks/review/useGetReviewsList";
import { useDeleteReview } from "../../../components/hooks/review/useDeleteReview";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: reviewsData, isLoading, refetch } = useGetReviewsList({
    search: searchTerm,
    rating: selectedRating,
    page: 1,
    limit: 20
  });

  const { mutate: deleteReview, isLoading: isDeleting } = useDeleteReview();

  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination || {};

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) {
      deleteReview(reviewId, {
        onSuccess: () => {
          refetch();
        }
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedRating("");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating, size = "h-4 w-4") => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? "text-yellow-400 fill-current" 
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reviews</h1>
            <p className="text-gray-600">
              Share your experience and read feedback from other customers
            </p>
          </div>
          <Link
            href="/dashboard/reviews/new"
            className="mt-4 lg:mt-0 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Write Review
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-yellow-600">{getAverageRating()}</p>
                  <Star className="h-6 w-6 text-yellow-400 fill-current" />
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-green-900">{ratingDistribution[5]}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-purple-900">
                  {reviews.filter(r => {
                    const reviewDate = new Date(r.created_at);
                    const now = new Date();
                    return reviewDate.getMonth() === now.getMonth() && 
                           reviewDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating];
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 w-20">
                    <span className="text-sm font-medium text-gray-900">{rating}</span>
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
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
                placeholder="Search reviews by comment, cat name, or room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
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

        {/* Reviews List */}
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gray-200 h-12 w-12 rounded-full"></div>
                  <div className="flex-1">
                    <div className="bg-gray-200 h-4 w-32 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 w-24 rounded"></div>
                  </div>
                </div>
                <div className="bg-gray-200 h-20 rounded mb-4"></div>
                <div className="bg-gray-200 h-4 w-48 rounded"></div>
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                <div className="p-6">
                  {/* Review Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-12 w-12 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-white fill-current" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          {renderStars(review.rating, "h-5 w-5")}
                          <span className="text-sm font-medium text-gray-600">
                            ({review.rating}/5)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Reviewed on {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/reviews/${review.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={isDeleting}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>

                  {/* Booking Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <Cat className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Cat</p>
                          <p className="font-medium text-gray-900">{review.cat_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Building className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Room</p>
                          <p className="font-medium text-gray-900">{review.room_name}</p>
                        </div>
                      </div>
                    </div>

                    {review.stay_duration && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Stay Duration</p>
                            <p className="font-medium text-gray-900">{review.stay_duration} days</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Review Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/reviews/${review.id}`}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Link>
                    <Link
                      href={`/dashboard/reviews/${review.id}/edit`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Review
                    </Link>
                    {review.booking_id && (
                      <Link
                        href={`/dashboard/bookings/${review.booking_id}`}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors duration-200 text-sm font-medium inline-flex items-center"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        View Booking
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Star className="h-12 w-12 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No reviews yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedRating
                ? "Try adjusting your search filters to find reviews."
                : "Share your experience by writing your first review after a stay."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard/reviews/new"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 inline-flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Write Your First Review
              </Link>
              {(searchTerm || selectedRating) && (
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

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50">
                Previous
              </button>
              <span className="px-4 py-2 text-gray-600">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Review Guidelines */}
        <div className="mt-12 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Review Guidelines</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Honest</h3>
              <p className="text-gray-600 text-sm">
                Share your genuine experience to help other cat parents
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Specific</h3>
              <p className="text-gray-600 text-sm">
                Include details about the service, staff, and facilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Be Respectful</h3>
              <p className="text-gray-600 text-sm">
                Maintain a respectful tone in your feedback
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
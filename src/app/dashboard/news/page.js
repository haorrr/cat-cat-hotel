// src/app/dashboard/news/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Newspaper,
  Calendar,
  User,
  Eye,
  MessageSquare,
  Search,
  Filter,
  Clock,
  TrendingUp,
  Heart,
  Share2,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { useGetNewsList } from "../../../components/hooks/news/useGetNewsList";
import { MainLayout } from "../../../components/layout/MainLayout";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: newsData, isLoading } = useGetNewsList({
    search: searchTerm,
    category: selectedCategory,
    status: "published", // Only show published articles to regular users
    page: 1,
    limit: 20
  });

  const news = newsData?.articles || [];
  const pagination = newsData?.pagination || {};

  const newsCategories = [
    { value: "general", label: "General", color: "bg-blue-100 text-blue-800" },
    { value: "health", label: "Health & Care", color: "bg-red-100 text-red-800" },
    { value: "nutrition", label: "Nutrition", color: "bg-green-100 text-green-800" },
    { value: "events", label: "Events", color: "bg-purple-100 text-purple-800" },
    { value: "promotions", label: "Promotions", color: "bg-yellow-100 text-yellow-800" },
    { value: "tips", label: "Tips & Advice", color: "bg-pink-100 text-pink-800" }
  ];

  const getCategoryInfo = (category) => {
    return newsCategories.find(c => c.value === category) || 
           { label: category, color: "bg-gray-100 text-gray-800" };
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffTime = Math.abs(now - articleDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return formatDate(date);
  };

  const featuredArticles = news.filter(article => article.featured).slice(0, 3);
  const regularArticles = news.filter(article => !article.featured);

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cat Hotel News</h1>
          <p className="text-gray-600">
            Stay updated with the latest news, tips, and stories from our cat hotel
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Stories</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <div key={article.id} className={`${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 h-full">
                    {article.featured_image && (
                      <div className={`relative ${index === 0 ? "h-64" : "h-48"}`}>
                        <img
                          src={article.featured_image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-2 mb-3">
                        {article.category && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryInfo(article.category).color}`}>
                            {getCategoryInfo(article.category).label}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{getRelativeTime(article.published_at)}</span>
                      </div>
                      
                      <h3 className={`font-bold text-gray-900 mb-3 ${index === 0 ? "text-2xl" : "text-lg"} line-clamp-2`}>
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className={`text-gray-600 mb-4 ${index === 0 ? "text-base" : "text-sm"} line-clamp-3`}>
                          {article.excerpt}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            <span>{article.author_name || 'Admin'}</span>
                          </div>
                          {article.views && (
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              <span>{article.views}</span>
                            </div>
                          )}
                        </div>
                        
                        <Link
                          href={`/dashboard/news/${article.slug || article.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                        >
                          Read More
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
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
              Categories
            </button>
          </div>

          {/* Category Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === "" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>
                {newsCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.value 
                        ? "bg-blue-500 text-white" 
                        : `${category.color} hover:opacity-80`
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Regular Articles */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 w-24 rounded mb-3"></div>
                  <div className="bg-gray-200 h-6 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-4"></div>
                  <div className="bg-gray-200 h-3 w-32 rounded"></div>
                </div>
              ))}
            </div>
          ) : regularArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
                  {article.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      {article.category && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryInfo(article.category).color}`}>
                          {getCategoryInfo(article.category).label}
                        </span>
                      )}
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{getRelativeTime(article.published_at)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <span>{article.author_name || 'Admin'}</span>
                        </div>
                        {article.views && (
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{article.views}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={`/dashboard/news/${article.slug || article.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                      >
                        Read More
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Newspaper className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {searchTerm || selectedCategory
                  ? "Try adjusting your search filters to find articles."
                  : "No articles have been published yet. Check back soon for updates!"}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={clearFilters}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

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

        {/* Newsletter Signup */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
            <p className="text-blue-100 mb-6 max-w-md mx-auto">
              Get the latest news, tips, and special offers delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Explore Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsCategories.map((category) => {
              const categoryArticles = news.filter(article => article.category === category.value);
              
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedCategory === category.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full mb-3 ${category.color}`}>
                    <BookOpen className="h-4 w-4" />
                    <span className="font-medium">{category.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''} available
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Care Tips</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Learn how to keep your cat healthy and happy
                </p>
                <button
                  onClick={() => setSelectedCategory('health')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center"
                >
                  Browse Health Articles
                  <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-center">
              <Share2 className="h-8 w-8 text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Special Offers</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Don't miss out on our latest promotions and deals
                </p>
                <button
                  onClick={() => setSelectedCategory('promotions')}
                  className="text-yellow-600 hover:text-yellow-700 font-medium text-sm inline-flex items-center"
                >
                  View Promotions
                  <ArrowRight className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
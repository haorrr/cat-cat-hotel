// src/app/news/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  User,
  Clock,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Heart,
  Share2,
  Tag
} from "lucide-react";
import { useGetNewsList } from "../../components/hooks/news/useGetNewsList";

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: newsData, isLoading } = useGetNewsList({
    search: searchTerm,
    category: selectedCategory,
    page: currentPage,
    limit: 12,
    published_only: "true"
  });

  const news = newsData?.news || [];
  const pagination = newsData?.pagination;

  const categories = [
    { value: "", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "health", label: "Health & Wellness" },
    { value: "care_tips", label: "Care Tips" },
    { value: "announcements", label: "Announcements" },
    { value: "events", label: "Events" },
    { value: "promotions", label: "Promotions" }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      general: "bg-gray-100 text-gray-800",
      health: "bg-red-100 text-red-800",
      care_tips: "bg-blue-100 text-blue-800",
      announcements: "bg-purple-100 text-purple-800",
      events: "bg-green-100 text-green-800",
      promotions: "bg-orange-100 text-orange-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const featuredArticle = news[0];
  const regularArticles = news.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Cat Hotel</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-colors">
                Home
              </Link>
              <Link href="/rooms" className="text-gray-700 hover:text-orange-600 transition-colors">
                Rooms
              </Link>
              <Link href="/news" className="text-orange-600 font-medium">
                News
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-orange-600 transition-colors">
                Contact
              </Link>
              <Link 
                href="/auth"
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Cat Care News & Tips
          </h1>
          <p className="text-xl text-orange-100 max-w-3xl mx-auto">
            Stay updated with the latest news, health tips, and expert advice for your feline friends
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          /* Loading State */
          <div className="space-y-8">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 rounded-2xl mb-8"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 h-64 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        ) : news.length > 0 ? (
          <div>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-16">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-64 lg:h-auto">
                      <img
                        src={featuredArticle.featured_image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=400&fit=crop"}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredArticle.category)}`}>
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredArticle.category)}`}>
                          {featuredArticle.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                      
                      <h2 className="text-3xl font-bold text-gray-900 mb-4 line-clamp-2">
                        {featuredArticle.title}
                      </h2>
                      
                      <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{featuredArticle.author_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{calculateReadingTime(featuredArticle.content || "")} min read</span>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href={`/news/${featuredArticle.slug || featuredArticle.id}`}
                        className="mt-6 inline-flex items-center bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
                      >
                        Read Full Article
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Regular Articles Grid */}
            {regularArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularArticles.map((article) => (
                    <article key={article.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.featured_image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop"}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                            {article.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            <span>{article.author_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(article.published_at || article.created_at)}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{calculateReadingTime(article.content || "")} min read</span>
                            <Eye className="h-4 w-4 ml-3 mr-1" />
                            <span>{article.views || 0}</span>
                          </div>
                          
                          <Link
                            href={`/news/${article.slug || article.id}`}
                            className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center"
                          >
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                            currentPage === page
                              ? "bg-orange-500 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                    disabled={currentPage === pagination.total_pages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No Articles Found */
          <div className="text-center py-16">
            <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Search className="h-12 w-12 text-orange-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No articles found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory
                ? "Try adjusting your search terms or category filter."
                : "Check back soon for the latest cat care news and tips!"}
            </p>
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                }}
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-orange-500 to-pink-500 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Cat Care Tips
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Subscribe to our newsletter for the latest news and expert advice
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg sm:rounded-r-none border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-r-lg sm:rounded-l-none font-medium hover:bg-gray-50 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-gradient-to-r from-orange-400 to-pink-400 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="ml-2 text-xl font-bold">Cat Hotel</span>
          </div>
          <p className="text-gray-400">
            © 2024 Cat Hotel. All rights reserved. Made with ❤️ for cats.
          </p>
        </div>
      </footer>
    </div>
  );
}
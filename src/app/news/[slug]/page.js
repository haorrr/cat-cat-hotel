// src/app/news/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  User,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Facebook,
  Twitter,
  MessageCircle,
  BookOpen,
  Tag
} from "lucide-react";
import { useGetSingleNews } from "../../../components/hooks/news/useGetSingleNews";
import { useGetNewsList } from "../../../components/hooks/news/useGetNewsList";

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const [liked, setLiked] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const { data: article, isLoading, isError } = useGetSingleNews(slug);
  const { data: relatedNewsData } = useGetNewsList({
    category: article?.category,
    limit: 3,
    published_only: "true"
  });

  const relatedArticles = relatedNewsData?.news?.filter(a => a.id !== article?.id) || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = (content || "").split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || "";
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      copy: () => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    };

    if (platform === 'copy') {
      shareUrls.copy();
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShareMenuOpen(false);
  };

  const formatContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() && (
        <p key={index} className="mb-6 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      )
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 rounded w-24 mb-6"></div>
            <div className="bg-gray-200 h-64 rounded-2xl mb-8"></div>
            <div className="bg-gray-200 h-8 rounded w-3/4 mb-4"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-200 h-4 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            href="/news"
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

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
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to News
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Featured Image */}
          {article.featured_image && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <img
                src={article.featured_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                  {article.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
            </div>
          )}

          <div className="p-8 lg:p-12">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(article.published_at || article.created_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{calculateReadingTime(article.content)} min read</span>
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                <span>{article.views || 0} views</span>
              </div>
            </div>

            {/* Article Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Article Excerpt */}
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed italic">
                {article.excerpt}
              </p>
            )}

            {/* Social Actions */}
            <div className="flex items-center justify-between border-y border-gray-200 py-4 mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    liked
                      ? "bg-red-50 text-red-600 hover:bg-red-100"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                  <span>Like</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>

                  {shareMenuOpen && (
                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Facebook className="h-4 w-4 mr-3 text-blue-600" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Twitter className="h-4 w-4 mr-3 text-blue-400" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <Share2 className="h-4 w-4 mr-3 text-gray-600" />
                        Copy Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{article.content?.length || 0} characters</span>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {formatContent(article.content || "")}
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                    {article.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  Published {formatDate(article.published_at || article.created_at)}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  href={`/news/${relatedArticle.slug || relatedArticle.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={relatedArticle.featured_image || "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=200&fit=crop"}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  
                  <div className="p-6">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 ${getCategoryColor(relatedArticle.category)}`}>
                      {relatedArticle.category?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                      {relatedArticle.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {relatedArticle.excerpt}
                    </p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{formatDate(relatedArticle.published_at || relatedArticle.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-8 lg:p-12 text-center text-white">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Don't Miss Our Latest Cat Care Tips
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get expert advice, health tips, and special offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-l-lg sm:rounded-r-none text-gray-900 border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500"
            />
            <button className="bg-white text-orange-600 px-6 py-3 rounded-r-lg sm:rounded-l-none font-medium hover:bg-gray-50 transition-colors duration-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/app/admin/news/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Image as ImageIcon,
  AlertTriangle,
  FileText,
  Globe,
  Clock
} from "lucide-react";
import { useCreateNews } from "../../../../components/hooks/news/useCreateNews";
import { MainLayout } from "../../../../components/layout/MainLayout";

export default function NewsEditorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    featured_image: "",
    category: "general",
    status: "draft" // default status
  });
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const { mutate: createNews, isLoading, isError, error, isSuccess } = useCreateNews();

  const categories = [
    { value: "general", label: "General" },
    { value: "health", label: "Health & Wellness" },
    { value: "care_tips", label: "Care Tips" },
    { value: "announcements", label: "Announcements" },
    { value: "events", label: "Events" },
    { value: "promotions", label: "Promotions" }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, featured_image: url }));
    setImagePreview(url);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 200) {
      newErrors.title = "Title must be less than 200 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.length < 50) {
      newErrors.content = "Content must be at least 50 characters";
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
    } else if (formData.excerpt.length > 500) {
      newErrors.excerpt = "Excerpt must be less than 500 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (isDraft = false) => {
  const submitData = {
    ...formData,
    is_published: !isDraft // gửi true nếu publish, false nếu draft
  };

  if (!isDraft && !validateForm()) {
    return;
  }

  createNews(submitData, {
    onSuccess: () => {
      router.push("/admin/news");
    }
  });
};


  const handleSaveDraft = () => {
    handleSubmit(true);
  };

  const handlePublish = () => {
    handleSubmit(false);
  };

  const formatPreviewContent = (content) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() && <p key={index} className="mb-4">{paragraph}</p>
    ));
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create News Article</h1>
              <p className="text-gray-600 mt-1">
                Share updates and news with your customers
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="h-5 w-5 mr-2" />
              {previewMode ? "Edit" : "Preview"}
            </button>
            
            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <Clock className="h-5 w-5 mr-2" />
              Save Draft
            </button>

            <button
              onClick={handlePublish}
              disabled={isLoading}
              className="flex items-center bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-5 w-5 mr-2" />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {isError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error?.message || "Failed to save article"}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2">
            {previewMode ? (
              /* Preview Mode */
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      formData.is_published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {formData.is_published ? "Published" : "Draft"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                  </div>
                  
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Featured"
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {formData.title || "Article Title"}
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-6 italic">
                    {formData.excerpt || "Article excerpt..."}
                  </p>
                </div>

                <div className="prose max-w-none">
                  {formatPreviewContent(formData.content || "Article content...")}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Title */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className={`w-full px-4 py-3 text-lg border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.title ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter a compelling title..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.title && (
                      <p className="text-sm text-red-600">{errors.title}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.title.length}/200 characters
                    </p>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt", e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                      errors.excerpt ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Write a brief summary of your article..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.excerpt && (
                      <p className="text-sm text-red-600">{errors.excerpt}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.excerpt.length}/500 characters
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange("content", e.target.value)}
                    rows={20}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono ${
                      errors.content ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Write your article content here. Use line breaks to separate paragraphs..."
                  />
                  <div className="flex justify-between mt-2">
                    {errors.content && (
                      <p className="text-sm text-red-600">{errors.content}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.content.length} characters
                    </p>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Tip:</strong> Use line breaks to separate paragraphs. Keep your content engaging and easy to read for cat owners.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publish Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.category ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => handleChange("is_published", e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Publish immediately
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    Uncheck to save as draft
                  </p>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.featured_image}
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Add a compelling image to make your article stand out
                  </p>
                </div>

                {/* Image Preview */}
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={() => setImagePreview("")}
                    />
                    <button
                      onClick={() => {
                        setImagePreview("");
                        setFormData(prev => ({ ...prev, featured_image: "" }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No image selected</p>
                  </div>
                )}
              </div>
            </div>

            {/* Article Stats Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium text-gray-900">
                    {formData.content.split(/\s+/).filter(word => word.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Reading Time:</span>
                  <span className="font-medium text-gray-900">
                    {Math.max(1, Math.ceil(formData.content.split(/\s+/).filter(word => word.length > 0).length / 200))} min
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Character Count:</span>
                  <span className="font-medium text-gray-900">
                    {formData.content.length.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Writing Tips */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-200 p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Writing Tips</h3>
              
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Keep your title under 60 characters for better SEO
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Use cat-related keywords naturally in your content
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Include practical tips that cat owners will find valuable
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Break up long paragraphs for better readability
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Add a high-quality featured image to grab attention
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Floating Save Indicator */}
        {isLoading && (
          <div className="fixed bottom-6 right-6 bg-white shadow-lg border border-gray-200 rounded-xl p-4 z-10">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500 mr-3"></div>
              <span className="text-gray-700 font-medium">Saving article...</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <div className="fixed bottom-6 right-6 bg-green-50 border border-green-200 rounded-xl p-4 z-10">
            <div className="flex items-center">
              <div className="bg-green-500 rounded-full p-1 mr-3">
                <Save className="h-3 w-3 text-white" />
              </div>
              <span className="text-green-800 font-medium">Article saved successfully!</span>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
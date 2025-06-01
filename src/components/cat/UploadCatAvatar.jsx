// src/components/cat/UploadCatAvatar.jsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetCats } from "../hooks/cat/useGetCats";
import { useUploadCatAvatar } from "../hooks/cat/useUploadCatAvatar";

export default function UploadCatAvatar() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, active_only: false });
  const [selectedCat, setSelectedCat] = useState(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const { cats, pagination, isLoading, isError, error, refetch } = useGetCats(filters);
  const { 
    uploadAvatarMutation, 
    isLoading: isUploading, 
    isError: uploadError, 
    error: uploadErrorMsg, 
    isSuccess,
    avatarData
  } = useUploadCatAvatar(selectedCat?.id);

  // Handle pagination
  const handleNext = () => {
    if (pagination?.current_page < pagination?.total_pages) {
      setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrev = () => {
    if (filters.page > 1) {
      setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  // Handle filter changes
  const onFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = value;
    if (type === "checkbox") val = checked;
    setFilters((prev) => ({ ...prev, [name]: val, page: 1 }));
  };

  // Handle upload avatar
  const handleUploadClick = (cat) => {
    setSelectedCat(cat);
    setShowUploadDialog(true);
    setSelectedFile(null);
    setPreview(null);
  };

  const handleCloseUploadDialog = () => {
    setShowUploadDialog(false);
    setSelectedCat(null);
    setSelectedFile(null);
    setPreview(null);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // File type validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPEG, PNG and WebP files are allowed');
        return;
      }

      // File size validation (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (selectedFile && selectedCat) {
      uploadAvatarMutation(selectedFile);
    }
  };

  // Close dialog and show success message when upload succeeds
  React.useEffect(() => {
    if (isSuccess) {
      setShowUploadDialog(false);
      alert(`Avatar for "${selectedCat?.name}" has been uploaded successfully!`);
      setSelectedCat(null);
      setSelectedFile(null);
      setPreview(null);
      refetch();
    }
  }, [isSuccess, selectedCat?.name, refetch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-green-700">Upload Cat Avatar</h2>
        <Button onClick={() => refetch()} variant="outline">
          Refresh List
        </Button>
      </div>

      <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">📸 Avatar Upload</h3>
        <p className="text-green-700 text-sm">
          Select a cat from the list below to upload or change its avatar. 
          Supported formats: JPEG, PNG, WebP. Maximum size: 5MB.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Input
          name="search"
          placeholder="Search name or breed"
          value={filters.search || ""}
          onChange={onFilterChange}
          className="w-40"
        />
        <Input
          name="breed"
          placeholder="Breed"
          value={filters.breed || ""}
          onChange={onFilterChange}
          className="w-32"
        />
        <Select
          onValueChange={(value) => onFilterChange({ target: { name: 'gender', value } })}
          value={filters.gender || ""}
          defaultValue=""
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Genders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
        <label className="flex items-center space-x-1">
          <input
            type="checkbox"
            name="active_only"
            checked={!!filters.active_only}
            onChange={onFilterChange}
          />
          <span>Active Only</span>
        </label>
        <Button onClick={() => refetch()}>Apply Filters</Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Loading cats...</p>
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

      {/* No Cats */}
      {!isLoading && !isError && cats?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            {filters.search || filters.breed || filters.gender ? 
              "No cats found matching your filters." : 
              "No cats found."
            }
          </p>
        </div>
      )}

      {/* Cats Grid with Avatars */}
      {!isLoading && !isError && cats?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {cats.map((cat) => (
            <div 
              key={cat.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleUploadClick(cat)}
            >
              {/* Avatar Display */}
              <div className="flex justify-center mb-3">
                {cat.avatar ? (
                  <img 
                    src={`http://localhost:5000${cat.avatar}`} 
                    alt={`${cat.name}'s avatar`}
                    className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                    <span className="text-gray-500 text-xs text-center">No Avatar</span>
                  </div>
                )}
              </div>
              
              {/* Cat Info */}
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-600 mb-1">ID: {cat.id}</p>
                <p className="text-sm text-gray-600 mb-2">
                  {cat.breed || "Unknown"} • {cat.gender}
                </p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cat.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {cat.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              
              {/* Upload Button */}
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-3 text-green-600 border-green-300 hover:bg-green-50"
                disabled={isUploading}
              >
                {cat.avatar ? "Change Avatar" : "Upload Avatar"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && pagination && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <Button 
            onClick={handlePrev} 
            disabled={filters.page === 1} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <div className="text-center">
            <span className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <br />
            <span className="text-xs text-gray-500">
              {pagination.total_records} total cats
            </span>
          </div>
          <Button 
            onClick={handleNext} 
            disabled={filters.page === pagination.total_pages} 
            variant="outline"
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-green-800">📸 Upload Avatar for {selectedCat?.name}</DialogTitle>
            <DialogDescription>
              Choose a new avatar for this cat. Accepted formats: JPEG, PNG, WebP. Max size: 5MB.
            </DialogDescription>
          </DialogHeader>

          {selectedCat && (
            <div className="my-4 p-4 border rounded-lg bg-green-50">
              <h4 className="font-semibold mb-3 text-green-800">Cat Information:</h4>
              <div className="flex items-center gap-4">
                {/* Current Avatar */}
                <div className="flex-shrink-0">
                  {selectedCat.avatar ? (
                    <img 
                      src={`http://localhost:5000${selectedCat.avatar}`} 
                      alt={`${selectedCat.name}'s current avatar`}
                      className="w-16 h-16 object-cover rounded-full border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                      <span className="text-gray-500 text-xs">No Avatar</span>
                    </div>
                  )}
                </div>
                {/* Cat Details */}
                <div className="flex-1">
                  <p><strong>Name:</strong> {selectedCat.name}</p>
                  <p><strong>ID:</strong> {selectedCat.id}</p>
                  <p><strong>Breed:</strong> {selectedCat.breed || "Unknown"}</p>
                  <p><strong>Gender:</strong> {selectedCat.gender}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Choose Avatar File:</label>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>

            {/* Preview */}
            {preview && (
              <div>
                <label className="block text-sm font-medium mb-2">Preview:</label>
                <div className="flex justify-center">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-200"
                  />
                </div>
              </div>
            )}

            {/* Upload Guidelines */}
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
              <strong>Guidelines:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Supported formats: JPEG, PNG, WebP</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Recommended: Square images for best results</li>
                <li>• Images will be automatically resized and cropped</li>
              </ul>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 border border-red-300 rounded bg-red-50">
                <p className="text-red-800 text-sm">
                  <strong>❌ Upload Failed:</strong> {uploadErrorMsg?.message || "Failed to upload avatar"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleCloseUploadDialog}
              disabled={isUploading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                "Upload Avatar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
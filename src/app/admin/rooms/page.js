// src/app/admin/rooms/page.js - Fixed with Suspense
"use client";

import { useState, useRef, Suspense } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Building, Plus, Edit, Trash2, Eye, Search, Filter, Upload, Star, X, Camera, Image as ImageIcon } from "lucide-react";
import { useGetRoomsList } from "../../../components/hooks/room/useGetRoomsList";
import { useCreateRoom } from "../../../components/hooks/room/useCreateRoom";
import { useUpdateRoom } from "../../../components/hooks/room/useUpdateRoom";
import { useDeleteRoom } from "../../../components/hooks/room/useDeleteRoom";
import { useSetPrimaryImage } from "../../../components/hooks/room/useSetPrimaryImage";
import { useDeleteRoomImage } from "../../../components/hooks/room/useDeleteRoomImage";

// Loading component
function RoomsTableSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading rooms...</p>
      </div>
    </div>
  );
}

// Main rooms content component
function RoomsContent() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    room_type: "",
    available_only: false
  });

  const fileInputRef = useRef(null);

  const { data, isLoading, error, refetch } = useGetRoomsList(filters);
  const createMutation = useCreateRoom();
  const updateMutation = useUpdateRoom();
  const deleteMutation = useDeleteRoom();
  const setPrimaryImageMutation = useSetPrimaryImage();
  const deleteImageMutation = useDeleteRoomImage();

  const [formData, setFormData] = useState({
    name: "",
    room_type: "standard",
    capacity: 1,
    price_per_day: "",
    description: "",
    amenities: [],
    size_sqm: "",
    is_available: true
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const amenityOptions = [
    'WiFi', 'Air Conditioning', 'TV', 'Mini Fridge', 
    'Pet Bed', 'Food Bowl', 'Water Bowl', 'Toys', 
    'Grooming Tools', 'Exercise Area', 'Outdoor Access',
    'Play Area', 'Camera Monitoring', 'Temperature Control'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        price_per_day: parseFloat(formData.price_per_day),
        capacity: parseInt(formData.capacity),
        size_sqm: parseFloat(formData.size_sqm) || null,
        images: selectedImages
      };

      if (editingRoom) {
        await updateMutation.mutateAsync({ 
          id: editingRoom.id, 
          formData: {
            ...submitData,
            removeImages: imagesToRemove
          }
        });
        setEditingRoom(null);
      } else {
        await createMutation.mutateAsync(submitData);
        setShowCreateModal(false);
      }
      
      resetForm();
      refetch();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An error occurred");
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      room_type: room.room_type,
      capacity: room.capacity,
      price_per_day: room.price_per_day.toString(),
      description: room.description || "",
      amenities: room.amenities || [],
      size_sqm: room.size_sqm?.toString() || "",
      is_available: room.is_available
    });
    setExistingImages(room.images?.map(img => ({
      id: img.id,
      url: img.url,
      is_primary: img.is_primary
    })) || []);
    setSelectedImages([]);
    setImagesToRemove([]);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room? This will also delete all associated images.")) {
      try {
        await deleteMutation.mutateAsync(roomId);
        refetch();
      } catch (error) {
        console.error("Error deleting room:", error);
        alert(error.message || "Failed to delete room");
      }
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 10) {
      alert("Maximum 10 images allowed");
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForRemoval = (imageId) => {
    setImagesToRemove(prev => [...prev, imageId]);
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const restoreImage = (imageId) => {
    setImagesToRemove(prev => prev.filter(id => id !== imageId));
    // Restore from original room data
    const originalImage = editingRoom.images.find(img => img.id === imageId);
    if (originalImage) {
      setExistingImages(prev => [...prev, originalImage]);
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      await setPrimaryImageMutation.mutateAsync({ 
        roomId: editingRoom.id, 
        imageId 
      });
      
      setExistingImages(prev => 
        prev.map(img => ({ 
          ...img, 
          is_primary: img.id === imageId 
        }))
      );
      
      refetch();
    } catch (error) {
      console.error('Error setting primary image:', error);
      alert(error.message || "Failed to set primary image");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await deleteImageMutation.mutateAsync({ 
          roomId: editingRoom.id, 
          imageId 
        });
        
        setExistingImages(prev => prev.filter(img => img.id !== imageId));
        refetch();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert(error.message || "Failed to delete image");
      }
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      room_type: "standard",
      capacity: 1,
      price_per_day: "",
      description: "",
      amenities: [],
      size_sqm: "",
      is_available: true
    });
    setSelectedImages([]);
    setImagesToRemove([]);
    setExistingImages([]);
    setEditingRoom(null);
    setShowCreateModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Show loading state without hydration issues
  if (isLoading && !data) {
    return <RoomsTableSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <p className="text-red-600">Error loading rooms: {error.message}</p>
        <button 
          onClick={() => refetch()} 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-gray-600">Add, edit, and manage pet care rooms</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms..."
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value, page: 1})}
              className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <select
            value={filters.room_type}
            onChange={(e) => setFilters({...filters, room_type: e.target.value, page: 1})}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="premium">Premium</option>
          </select>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.available_only}
              onChange={(e) => setFilters({...filters, available_only: e.target.checked, page: 1})}
              className="mr-2"
            />
            Available only
          </label>
        </div>
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {data?.rooms?.length === 0 ? (
          <div className="p-8 text-center">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-600">Start by adding your first room.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Images</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.rooms?.map((room) => (
                  <tr key={`room-${room.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{room.name}</div>
                        <div className="text-sm text-gray-500">{room.size_sqm ? `${room.size_sqm} sqm` : 'Size not specified'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
                        {room.room_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.capacity} pets
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${room.price_per_day}/day
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{room.image_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        room.is_available 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {room.is_available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit room"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data?.pagination && data.pagination.total_pages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {((data.pagination.current_page - 1) * data.pagination.per_page) + 1} to{' '}
              {Math.min(data.pagination.current_page * data.pagination.per_page, data.pagination.total_records)} of{' '}
              {data.pagination.total_records} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilters({...filters, page: filters.page - 1})}
                disabled={data.pagination.current_page === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {data.pagination.current_page} of {data.pagination.total_pages}
              </span>
              <button
                onClick={() => setFilters({...filters, page: filters.page + 1})}
                disabled={data.pagination.current_page === data.pagination.total_pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingRoom) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                  {editingRoom ? 'Edit Room' : 'Add New Room'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Deluxe Cat Suite A1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Room Type *
                    </label>
                    <select
                      value={formData.room_type}
                      onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="standard">Standard</option>
                      <option value="deluxe">Deluxe</option>
                      <option value="suite">Suite</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity (pets) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per Day ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData({...formData, price_per_day: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size (sq m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={formData.size_sqm}
                      onChange={(e) => setFormData({...formData, size_sqm: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {editingRoom && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 block text-sm text-gray-700">
                        Available for booking
                      </label>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Describe the room features, environment, etc."
                  />
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {amenityOptions.map((amenity, index) => (
                      <label key={`amenity-${index}-${amenity}`} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityChange(amenity)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Existing Images (for editing) */}
                {editingRoom && existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {existingImages.map((image, index) => (
                        <div key={`existing-image-${image.id}-${index}`} className="relative group">
                          <img
                            src={`http://localhost:5000${image.url}`}
                            alt="Room"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          {image.is_primary && (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center">
                              <Star className="h-3 w-3 mr-1" />
                              Primary
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                            {!image.is_primary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(image.id)}
                                className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                                disabled={setPrimaryImageMutation.isPending}
                              >
                                Set Primary
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(image.id)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                              disabled={deleteImageMutation.isPending}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingRoom ? 'Add More Images' : 'Room Images'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Click to upload images
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      Maximum 10 images, 5MB each. Supported formats: JPG, PNG, WEBP
                    </p>
                  </div>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Images ({selectedImages.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={`selected-image-${index}-${file.name}-${file.lastModified}`} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : (editingRoom ? 'Update Room' : 'Create Room')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main export component with Suspense wrapper
export default function AdminRoomsPage() {
  return (
    <MainLayout>
      <div className="p-6">
        <Suspense fallback={<RoomsTableSkeleton />}>
          <RoomsContent />
        </Suspense>
      </div>
    </MainLayout>
  );
}
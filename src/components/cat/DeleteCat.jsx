// src/components/cat/DeleteCat.jsx
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
import { useDeleteCat } from "../hooks/cat/useDeleteCat";

export default function DeleteCat() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, active_only: false });
  const [selectedCat, setSelectedCat] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { cats, pagination, isLoading, isError, error, refetch } = useGetCats(filters);
  const { 
    deleteCatMutation, 
    isLoading: isDeleting, 
    isError: deleteError, 
    error: deleteErrorMsg, 
    isSuccess 
  } = useDeleteCat();

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

  // Handle delete cat
  const handleDeleteClick = (cat) => {
    setSelectedCat(cat);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCat) {
      deleteCatMutation(selectedCat.id);
    }
  };

  const handleCloseDeleteDialog = () => {
    setShowDeleteDialog(false);
    setSelectedCat(null);
  };

  // Close dialog and show success message when delete succeeds
  React.useEffect(() => {
    if (isSuccess) {
      setShowDeleteDialog(false);
      alert(`Cat "${selectedCat?.name}" has been deleted successfully!`);
      setSelectedCat(null);
      // Optionally refetch data to update the list
      refetch();
    }
  }, [isSuccess, selectedCat?.name, refetch]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-red-700">Delete Cat Management</h2>
        <Button onClick={() => refetch()} variant="outline">
          Refresh List
        </Button>
      </div>

      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">⚠️ Warning</h3>
        <p className="text-red-700 text-sm">
          Deleting a cat will set it as inactive (soft delete). The cat data will be preserved but marked as inactive.
          Cats with active bookings cannot be deleted.
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

      {/* Cats Table */}
      {!isLoading && !isError && cats?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3">ID</th>
                <th className="border border-gray-300 p-3">Name</th>
                <th className="border border-gray-300 p-3">Breed</th>
                <th className="border border-gray-300 p-3">Gender</th>
                <th className="border border-gray-300 p-3">Owner</th>
                <th className="border border-gray-300 p-3">Email</th>
                <th className="border border-gray-300 p-3">Phone</th>
                <th className="border border-gray-300 p-3">Status</th>
                <th className="border border-gray-300 p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">{cat.id}</td>
                  <td className="border border-gray-300 p-3 font-medium">{cat.name}</td>
                  <td className="border border-gray-300 p-3">{cat.breed || "Unknown"}</td>
                  <td className="border border-gray-300 p-3 capitalize">{cat.gender}</td>
                  <td className="border border-gray-300 p-3">{cat.owner_name}</td>
                  <td className="border border-gray-300 p-3">{cat.owner_email}</td>
                  <td className="border border-gray-300 p-3">{cat.owner_phone || "N/A"}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cat.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {cat.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(cat)}
                      disabled={isDeleting || !cat.is_active}
                      className="w-full"
                    >
                      {!cat.is_active ? "Already Deleted" : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-800">⚠️ Delete Cat Confirmation</DialogTitle>
            <DialogDescription>
              This action will set the cat as inactive (soft delete). The cat data will be preserved but marked as inactive.
              This action cannot be undone through this interface.
            </DialogDescription>
          </DialogHeader>

          {selectedCat && (
            <div className="my-4 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3 text-gray-800">Cat to be deleted:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>ID:</strong> {selectedCat.id}</div>
                <div><strong>Name:</strong> {selectedCat.name}</div>
                <div><strong>Breed:</strong> {selectedCat.breed || "Unknown"}</div>
                <div><strong>Gender:</strong> {selectedCat.gender}</div>
                <div><strong>Owner:</strong> {selectedCat.owner_name}</div>
                <div><strong>Email:</strong> {selectedCat.owner_email}</div>
                <div className="col-span-2">
                  <strong>Current Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    selectedCat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedCat.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Delete Error Display */}
          {deleteError && (
            <div className="p-3 border border-red-300 rounded bg-red-50">
              <p className="text-red-800 text-sm">
                <strong>❌ Delete Failed:</strong> {deleteErrorMsg?.message || "Failed to delete cat"}
              </p>
              <p className="text-red-600 text-xs mt-1">
                This might be due to active bookings or permission issues.
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={handleCloseDeleteDialog}
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
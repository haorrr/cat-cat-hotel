// src/components/cat/UpdateCat.jsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGetCats } from "../hooks/cat/useGetCats";
import { useUpdateCat } from "../hooks/cat/useUpdateCat";

// Schema for update form
const updateCatSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  breed: z.string().optional(),
  age: z.number().min(0, "Age must be non-negative").optional(),
  weight: z.number().min(0, "Weight must be non-negative").optional(),
  gender: z.enum(["male", "female"]).optional(),
  color: z.string().optional(),
  medical_notes: z.string().optional(),
  special_requirements: z.string().optional(),
  vaccination_status: z.string().optional(),
  is_active: z.boolean().optional(),
});

export default function UpdateCat() {
  const [filters, setFilters] = useState({ page: 1, limit: 10, active_only: false });
  const [selectedCat, setSelectedCat] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const { cats, pagination, isLoading, isError, error, refetch } = useGetCats(filters);
  const { 
    updateCatMutation, 
    isLoading: isUpdating, 
    isError: updateError, 
    error: updateErrorMsg, 
    isSuccess 
  } = useUpdateCat(selectedCat?.id);

  // Form setup
  const form = useForm({
    resolver: zodResolver(updateCatSchema),
    defaultValues: {
      name: "",
      breed: "",
      age: undefined,
      weight: undefined,
      gender: "",
      color: "",
      medical_notes: "",
      special_requirements: "",
      vaccination_status: "",
      is_active: true,
    },
  });

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

  // Handle update cat
  const handleUpdateClick = (cat) => {
    setSelectedCat(cat);
    // Pre-fill form with current cat data
    form.reset({
      name: cat.name || "",
      breed: cat.breed || "",
      age: cat.age || undefined,
      weight: cat.weight || undefined,
      gender: cat.gender || "",
      color: cat.color || "",
      medical_notes: cat.medical_notes || "",
      special_requirements: cat.special_requirements || "",
      vaccination_status: cat.vaccination_status || "",
      is_active: cat.is_active ?? true,
    });
    setShowUpdateDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setShowUpdateDialog(false);
    setSelectedCat(null);
    form.reset();
  };

  // Handle form submit
  const onSubmit = (data) => {
    // Only send changed/non-empty fields
    const filteredData = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== "") {
        filteredData[key] = data[key];
      }
    });
    
    if (Object.keys(filteredData).length === 0) {
      alert("No changes detected. Please modify at least one field.");
      return;
    }
    
    updateCatMutation(filteredData);
  };

  // Close dialog and show success message when update succeeds
  React.useEffect(() => {
    if (isSuccess) {
      setShowUpdateDialog(false);
      alert(`Cat "${selectedCat?.name}" has been updated successfully!`);
      setSelectedCat(null);
      form.reset();
      refetch();
    }
  }, [isSuccess, selectedCat?.name, refetch, form]);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-700">Update Cat Management</h2>
        <Button onClick={() => refetch()} variant="outline">
          Refresh List
        </Button>
      </div>

      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Information</h3>
        <p className="text-blue-700 text-sm">
          Select a cat from the list below to update its information. Only the fields you modify will be updated.
          Empty fields will not be changed.
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
                <th className="border border-gray-300 p-3">Age</th>
                <th className="border border-gray-300 p-3">Gender</th>
                <th className="border border-gray-300 p-3">Owner</th>
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
                  <td className="border border-gray-300 p-3">{cat.age || "Unknown"}</td>
                  <td className="border border-gray-300 p-3 capitalize">{cat.gender}</td>
                  <td className="border border-gray-300 p-3">{cat.owner_name}</td>
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
                      variant="outline"
                      onClick={() => handleUpdateClick(cat)}
                      disabled={isUpdating}
                      className="w-full text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Update
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

      {/* Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-800">🐱 Update Cat Information</DialogTitle>
            <DialogDescription>
              Modify the fields you want to update. Empty fields will not be changed.
            </DialogDescription>
          </DialogHeader>

          {selectedCat && (
            <div className="my-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold mb-3 text-blue-800">Current Cat Information:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><strong>ID:</strong> {selectedCat.id}</div>
                <div><strong>Name:</strong> {selectedCat.name}</div>
                <div><strong>Breed:</strong> {selectedCat.breed || "Unknown"}</div>
                <div><strong>Age:</strong> {selectedCat.age || "Unknown"}</div>
                <div><strong>Gender:</strong> {selectedCat.gender}</div>
                <div><strong>Weight:</strong> {selectedCat.weight || "Unknown"}</div>
                <div><strong>Color:</strong> {selectedCat.color || "Unknown"}</div>
                <div><strong>Vaccination:</strong> {selectedCat.vaccination_status || "Unknown"}</div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Row 1: Name, Breed, Age */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Cat name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="Breed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (years)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Age" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Weight, Gender, Color */}
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="Weight" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="Color" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3: Vaccination Status, Active Status */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="vaccination_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaccination Status</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active Status</FormLabel>
                      <FormControl>
                        <Select 
                          onValueChange={(value) => field.onChange(value === "true")} 
                          value={field.value?.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 4: Medical Notes */}
              <FormField
                control={form.control}
                name="medical_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Medical notes..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Row 5: Special Requirements */}
              <FormField
                control={form.control}
                name="special_requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Special Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Special requirements..." 
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Update Error Display */}
              {updateError && (
                <div className="p-3 border border-red-300 rounded bg-red-50">
                  <p className="text-red-800 text-sm">
                    <strong>❌ Update Failed:</strong> {updateErrorMsg?.message || "Failed to update cat"}
                  </p>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={handleCloseUpdateDialog}
                  disabled={isUpdating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Cat"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
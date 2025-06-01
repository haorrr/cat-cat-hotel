// src/app/dashboard/cats/new/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Cat,
  ArrowLeft,
  Save,
  Upload,
  X,
  Heart,
  Info,
  AlertTriangle
} from "lucide-react";
import { useCreateCat } from "../../../../components/hooks/cat/useCreateCat";
import { MainLayout } from "../../../../components/layout/MainLayout";

export default function AddCatPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    color: "",
    medical_notes: "",
    special_requirements: "",
    vaccination_status: "none"
  });
  const [errors, setErrors] = useState({});

  const { createCatMutation, isLoading, isError, error, isSuccess } = useCreateCat();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Cat name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select a gender";
    }

    if (formData.age && (isNaN(formData.age) || formData.age < 0 || formData.age > 30)) {
      newErrors.age = "Please enter a valid age (0-30 years)";
    }

    if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0 || formData.weight > 20)) {
      newErrors.weight = "Please enter a valid weight (0.1-20 kg)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Clean data before submission
    const cleanedData = {
      name: formData.name.trim(),
      gender: formData.gender,
      ...(formData.breed.trim() && { breed: formData.breed.trim() }),
      ...(formData.age && { age: parseInt(formData.age) }),
      ...(formData.weight && { weight: parseFloat(formData.weight) }),
      ...(formData.color.trim() && { color: formData.color.trim() }),
      ...(formData.medical_notes.trim() && { medical_notes: formData.medical_notes.trim() }),
      ...(formData.special_requirements.trim() && { special_requirements: formData.special_requirements.trim() }),
      vaccination_status: formData.vaccination_status
    };

    createCatMutation(cleanedData, {
      onSuccess: () => {
        router.push("/dashboard/cats");
      }
    });
  };

  const commonBreeds = [
    "Persian", "Maine Coon", "British Shorthair", "Ragdoll", "Siamese",
    "Russian Blue", "American Shorthair", "Scottish Fold", "Sphynx",
    "Bengal", "Abyssinian", "Norwegian Forest Cat", "Mixed Breed"
  ];

  const vaccinationOptions = [
    { value: "none", label: "Not vaccinated" },
    { value: "partial", label: "Partially vaccinated" },
    { value: "complete", label: "Fully vaccinated" },
    { value: "unknown", label: "Unknown" }
  ];

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Cat</h1>
            <p className="text-gray-600 mt-1">
              Add your furry family member to start booking stays
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit}>
            {/* Form Header */}
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-3 rounded-xl mr-4">
                  <Cat className="h-8 w-8 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cat Information</h2>
                  <p className="text-gray-600">Please provide details about your cat</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6">
              {/* Error Display */}
              {isError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-red-700">{error?.message || "Failed to add cat"}</p>
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cat Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter your cat's name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.gender ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    list="breeds"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter or select breed"
                  />
                  <datalist id="breeds">
                    {commonBreeds.map(breed => (
                      <option key={breed} value={breed} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Orange tabby, Black, White"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="30"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.age ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter age"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0.1"
                    max="20"
                    step="0.1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.weight ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter weight"
                  />
                  {errors.weight && (
                    <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                  )}
                </div>
              </div>

              {/* Health Information */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Health Information</h3>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vaccination Status
                  </label>
                  <select
                    name="vaccination_status"
                    value={formData.vaccination_status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {vaccinationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Notes
                  </label>
                  <textarea
                    name="medical_notes"
                    value={formData.medical_notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Any medical conditions, allergies, or medications..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    name="special_requirements"
                    value={formData.special_requirements}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Special dietary needs, behavioral notes, preferences..."
                  />
                </div>
              </div>

              {/* Information Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      Important Information
                    </h4>
                    <p className="text-sm text-blue-700">
                      Providing accurate information helps us give your cat the best possible care. 
                      You can always update this information later from your cat's profile.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
              <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Cat...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Add Cat
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
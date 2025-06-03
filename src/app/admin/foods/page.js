"use client";

import { useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { Utensils, Plus, Edit, Trash2 } from "lucide-react";
import { useGetFoods } from "../../../components/hooks/food/useGetFoods";
import { useCreateFood } from "../../../components/hooks/food/useCreateFood";
import { useUpdateFood } from "../../../components/hooks/food/useUpdateFood";
import { useDeleteFood } from "../../../components/hooks/food/useDeleteFood";

export default function AdminFoodsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: "",
    brand: "",
    active_only: true,
  });

  const { foods, pagination, isLoading, error, refetch } = useGetFoods(filters);
  const createMutation = useCreateFood();
  const updateMutation = useUpdateFood(editingFood?.id || null);
  const deleteMutation = useDeleteFood();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "dry",
    price_per_serving: "",
    description: "",
    ingredients: "",
    nutritional_info: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const foodData = {
        ...formData,
        price_per_serving: parseFloat(formData.price_per_serving),
        nutritional_info:
          Object.keys(formData.nutritional_info).length > 0
            ? formData.nutritional_info
            : undefined,
      };

      if (editingFood) {
        await updateMutation.mutateAsync(foodData);
        setEditingFood(null);
      } else {
        await createMutation.mutateAsync(foodData);
        setShowCreateModal(false);
      }

      resetForm();
      refetch();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (food) => {
    setEditingFood(food);
    setFormData({
      name: food.name,
      brand: food.brand || "",
      category: food.category,
      price_per_serving: food.price_per_serving.toString(),
      description: food.description || "",
      ingredients: food.ingredients || "",
      nutritional_info: food.nutritional_info || {},
    });
  };

  const handleDelete = async (foodId) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        await deleteMutation.mutateAsync(foodId);
        refetch();
      } catch (error) {
        console.error("Error deleting food:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      brand: "",
      category: "dry",
      price_per_serving: "",
      description: "",
      ingredients: "",
      nutritional_info: {},
    });
    setEditingFood(null);
    setShowCreateModal(false);
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  const getCategoryColor = (category) => {
    const colors = {
      dry: "bg-blue-100 text-blue-800",
      wet: "bg-green-100 text-green-800",
      treats: "bg-yellow-100 text-yellow-800",
      prescription: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Foods</h1>
            <p className="text-gray-600">Manage food menu and inventory</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 inline-flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Food
          </button>
        </div>

        {/* Food List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading foods...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error loading foods: {error.message}</p>
            </div>
          ) : foods?.length === 0 ? (
            <div className="p-8 text-center">
              <Utensils className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No foods found</h3>
              <p className="text-gray-600">Start by adding your first food item.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Brand</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {foods.map((food) => (
                    <tr key={food.id}>
                      <td className="px-6 py-4 font-medium text-gray-900">{food.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(food.category)}`}>
                          {food.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{food.brand || "N/A"}</td>
                      <td className="px-6 py-4 text-sm">{formatPrice(food.price_per_serving)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          food.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}>
                          {food.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium space-x-2">
                        <button onClick={() => handleEdit(food)} className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(food.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingFood) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">
                {editingFood ? 'Edit Food' : 'Add New Food'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Food Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="dry">Dry Food</option>
                    <option value="wet">Wet Food</option>
                    <option value="treats">Treats</option>
                    <option value="prescription">Prescription Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Serving ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price_per_serving}
                    onChange={(e) => setFormData({...formData, price_per_serving: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingredients
                  </label>
                  <textarea
                    value={formData.ingredients}
                    onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    rows="2"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={createMutation?.isLoading || updateMutation?.isLoading}
                    className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:opacity-50"
                  >
                    {createMutation?.isLoading || updateMutation?.isLoading ? "Saving..." : editingFood ? "Update Food" : "Create Food"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
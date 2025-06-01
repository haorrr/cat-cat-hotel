// src/components/hooks/food/useCreateFood.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để tạo food mới (chỉ admin)
 * @param {object} foodData - Dữ liệu food
 * @param {string} foodData.name - Tên food (required)
 * @param {number} foodData.price_per_serving - Giá per serving (required)
 * @param {string} foodData.category - Category ('dry', 'wet', 'treats', 'prescription') (required)
 * @param {string} foodData.brand - Thương hiệu (optional)
 * @param {string} foodData.description - Mô tả (optional)
 * @param {string} foodData.ingredients - Thành phần (optional)
 * @param {object} foodData.nutritional_info - Thông tin dinh dưỡng (optional)
 */
export function useCreateFood() {
  const queryClient = useQueryClient();

  const createFood = async (foodData) => {
    try {
      const token = localStorage.getItem("token");

      // Validate required fields
      if (!foodData.name || !foodData.price_per_serving || !foodData.category) {
        throw new Error("Name, price_per_serving, and category are required");
      }

      // Validate category
      const validCategories = ['dry', 'wet', 'treats', 'prescription'];
      if (!validCategories.includes(foodData.category)) {
        throw new Error("Invalid category. Must be: dry, wet, treats, or prescription");
      }

      // Validate price
      if (foodData.price_per_serving < 0) {
        throw new Error("Price must be a positive number");
      }

      const res = await fetch("http://localhost:5000/api/foods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(foodData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create food");
      }
      
      return data.data.food;
    } catch (err) {
      console.error("Error creating food:", err);
      throw err;
    }
  };

  const {
    mutate: createFoodMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: newFood,
  } = useMutation({
    mutationFn: createFood,
    onSuccess: (food) => {
      // Invalidate foods list để refresh data
      queryClient.invalidateQueries(["foods"]);
      
      console.log("Food created successfully:", food);
    },
    onError: (error) => {
      console.error("Food creation failed:", error);
    },
  });

  return { 
    createFoodMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    newFood 
  };
}

// Food validation utilities
export const FoodValidationUtils = {
  // Validate food data before submission
  validateFoodData: (foodData) => {
    const errors = [];
    
    // Required fields
    if (!foodData.name || foodData.name.trim() === '') {
      errors.push('Name is required');
    } else if (foodData.name.length > 100) {
      errors.push('Name must be less than 100 characters');
    }
    
    if (!foodData.price_per_serving || foodData.price_per_serving <= 0) {
      errors.push('Price per serving is required and must be positive');
    }
    
    if (!foodData.category) {
      errors.push('Category is required');
    } else if (!['dry', 'wet', 'treats', 'prescription'].includes(foodData.category)) {
      errors.push('Invalid category');
    }
    
    // Optional field validations
    if (foodData.brand && foodData.brand.length > 50) {
      errors.push('Brand must be less than 50 characters');
    }
    
    if (foodData.description && foodData.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
    
    if (foodData.ingredients && foodData.ingredients.length > 1000) {
      errors.push('Ingredients must be less than 1000 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Clean and format food data
  cleanFoodData: (foodData) => {
    const cleaned = {
      name: foodData.name?.trim(),
      category: foodData.category,
      price_per_serving: Number(foodData.price_per_serving)
    };
    
    // Add optional fields only if they have values
    if (foodData.brand?.trim()) cleaned.brand = foodData.brand.trim();
    if (foodData.description?.trim()) cleaned.description = foodData.description.trim();
    if (foodData.ingredients?.trim()) cleaned.ingredients = foodData.ingredients.trim();
    if (foodData.nutritional_info && typeof foodData.nutritional_info === 'object') {
      cleaned.nutritional_info = foodData.nutritional_info;
    }
    
    return cleaned;
  },
  
  // Generate default nutritional info template
  getDefaultNutritionalInfo: (category) => {
    const templates = {
      dry: {
        protein: '',
        fat: '',
        fiber: '',
        moisture: '',
        calories: ''
      },
      wet: {
        protein: '',
        fat: '',
        moisture: '',
        ash: '',
        calories: ''
      },
      treats: {
        protein: '',
        fat: '',
        calories: ''
      },
      prescription: {
        protein: '',
        fat: '',
        fiber: '',
        moisture: '',
        calories: '',
        therapeutic_purpose: ''
      }
    };
    
    return templates[category] || {};
  },
  
  // Format price for display
  formatPriceForInput: (price) => {
    return price ? Number(price).toFixed(2) : '';
  },
  
  // Parse nutritional info from form
  parseNutritionalInfo: (formData) => {
    const nutritionalInfo = {};
    
    Object.keys(formData).forEach(key => {
      if (key.startsWith('nutritional_') && formData[key]) {
        const nutritionKey = key.replace('nutritional_', '');
        nutritionalInfo[nutritionKey] = formData[key];
      }
    });
    
    return Object.keys(nutritionalInfo).length > 0 ? nutritionalInfo : null;
  }
};

/*
Example usage:

import { useCreateFood, FoodValidationUtils } from '@/hooks/food/useCreateFood';

function CreateFoodForm() {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    price_per_serving: '',
    category: '',
    ingredients: '',
    nutritional_info: {}
  });

  const { createFoodMutation, isLoading, isError, error, isSuccess } = useCreateFood();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = FoodValidationUtils.validateFoodData(formData);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    const cleanedData = FoodValidationUtils.cleanFoodData(formData);
    createFoodMutation(cleanedData);
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category,
      nutritional_info: FoodValidationUtils.getDefaultNutritionalInfo(category)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Food name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <select
        value={formData.category}
        onChange={(e) => handleCategoryChange(e.target.value)}
        required
      >
        <option value="">Select category</option>
        <option value="dry">Dry Food</option>
        <option value="wet">Wet Food</option>
        <option value="treats">Treats</option>
        <option value="prescription">Prescription Food</option>
      </select>
      
      <input
        type="number"
        step="0.01"
        placeholder="Price per serving"
        value={formData.price_per_serving}
        onChange={(e) => setFormData({...formData, price_per_serving: e.target.value})}
        required
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Food'}
      </button>
      
      {isError && <div className="error">{error.message}</div>}
      {isSuccess && <div className="success">Food created successfully!</div>}
    </form>
  );
}
*/
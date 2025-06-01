// src/components/hooks/food/useGetFoodById.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy thông tin chi tiết của một food theo ID
 * @param {number} foodId - ID của food
 * @param {object} options - Các tùy chọn cho useQuery
 */
export function useGetFoodById(foodId, options = {}) {
  const fetchFoodById = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch food");
      }
      
      return data.data.food;
    } catch (err) {
      console.error("Error fetching food:", err);
      throw err;
    }
  };

  const {
    data: food,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["food", foodId],
    queryFn: fetchFoodById,
    enabled: !!foodId, // Chỉ chạy khi có foodId
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

  return { food, isLoading, isError, error, refetch };
}

// Helper functions cho food detail
export const FoodDetailUtils = {
  // Check if food is available
  isAvailable: (food) => {
    return food?.is_active === true;
  },
  
  // Get availability status
  getAvailabilityStatus: (food) => {
    return {
      isAvailable: FoodDetailUtils.isAvailable(food),
      text: food?.is_active ? 'Available' : 'Unavailable',
      color: food?.is_active ? 'text-green-600' : 'text-red-600',
      bgColor: food?.is_active ? 'bg-green-50' : 'bg-red-50'
    };
  },
  
  // Format food details for display
  formatFoodDetails: (food) => {
    if (!food) return null;
    
    return {
      basic: {
        name: food.name,
        brand: food.brand || 'No brand specified',
        category: food.category,
        price: food.price_per_serving,
        description: food.description || 'No description available'
      },
      nutritional: food.nutritional_info || {},
      ingredients: food.ingredients || 'No ingredients listed',
      availability: FoodDetailUtils.getAvailabilityStatus(food),
      metadata: {
        created: food.created_at,
        updated: food.updated_at
      }
    };
  },
  
  // Check if food has complete information
  hasCompleteInfo: (food) => {
    const required = ['name', 'category', 'price_per_serving'];
    const optional = ['brand', 'description', 'ingredients', 'nutritional_info'];
    
    const hasRequired = required.every(field => food?.[field]);
    const hasOptional = optional.some(field => food?.[field]);
    
    return {
      hasRequired,
      hasOptional,
      completeness: hasRequired ? (hasOptional ? 'complete' : 'basic') : 'incomplete'
    };
  },
  
  // Get related foods suggestion criteria
  getRelatedCriteria: (food) => {
    return {
      sameCategory: food?.category,
      sameBrand: food?.brand,
      similarPrice: {
        min: (food?.price_per_serving || 0) * 0.8,
        max: (food?.price_per_serving || 0) * 1.2
      }
    };
  },
  
  // Calculate serving cost
  calculateServingCost: (food, servings = 1) => {
    return (food?.price_per_serving || 0) * servings;
  },
  
  // Format serving suggestions
  getServingSuggestions: (food) => {
    const suggestions = [];
    
    if (food?.category === 'dry') {
      suggestions.push(
        { servings: 0.5, description: 'Small cat (light meal)' },
        { servings: 1, description: 'Average cat (regular meal)' },
        { servings: 1.5, description: 'Large cat (hearty meal)' }
      );
    } else if (food?.category === 'wet') {
      suggestions.push(
        { servings: 1, description: 'Single serving' },
        { servings: 2, description: 'Two servings' },
        { servings: 3, description: 'Three servings' }
      );
    } else if (food?.category === 'treats') {
      suggestions.push(
        { servings: 0.25, description: 'Small treat' },
        { servings: 0.5, description: 'Regular treat' },
        { servings: 1, description: 'Large treat' }
      );
    }
    
    return suggestions.map(suggestion => ({
      ...suggestion,
      cost: FoodDetailUtils.calculateServingCost(food, suggestion.servings)
    }));
  }
};

/*
Example usage:

import { useGetFoodById, FoodDetailUtils } from '@/hooks/food/useGetFoodById';

function FoodDetail({ foodId }) {
  const { food, isLoading, isError, error, refetch } = useGetFoodById(foodId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!food) return <div>Food not found</div>;

  const details = FoodDetailUtils.formatFoodDetails(food);
  const availability = FoodDetailUtils.getAvailabilityStatus(food);
  const servingSuggestions = FoodDetailUtils.getServingSuggestions(food);
  const completeness = FoodDetailUtils.hasCompleteInfo(food);

  return (
    <div className="food-detail">
      <div className="header">
        <h1>{details.basic.name}</h1>
        <span className={availability.color}>
          {availability.text}
        </span>
      </div>

      <div className="info-grid">
        <div className="basic-info">
          <h3>Basic Information</h3>
          <p>Brand: {details.basic.brand}</p>
          <p>Category: {details.basic.category}</p>
          <p>Price: {details.basic.price}</p>
        </div>

        {details.nutritional && Object.keys(details.nutritional).length > 0 && (
          <div className="nutritional-info">
            <h3>Nutritional Information</h3>
            {Object.entries(details.nutritional).map(([key, value]) => (
              <p key={key}>{key}: {value}</p>
            ))}
          </div>
        )}
      </div>

      <div className="serving-suggestions">
        <h3>Serving Suggestions</h3>
        {servingSuggestions.map((suggestion, index) => (
          <div key={index} className="suggestion">
            <span>{suggestion.description}</span>
            <span>{suggestion.servings} servings</span>
            <span>{suggestion.cost} VND</span>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
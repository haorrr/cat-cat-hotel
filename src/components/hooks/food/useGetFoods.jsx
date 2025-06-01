// src/components/hooks/food/useGetFoods.jsx
"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Hook để lấy danh sách foods
 * @param {object} filters - Các bộ lọc
 * @param {number} filters.page - Trang hiện tại
 * @param {number} filters.limit - Số lượng records per page
 * @param {string} filters.category - Lọc theo category ('dry', 'wet', 'treats', 'prescription')
 * @param {string} filters.brand - Lọc theo brand
 * @param {boolean} filters.active_only - Chỉ lấy foods active
 */
export function useGetFoods(filters = {}) {
  const fetchFoods = async () => {
    try {
      const params = new URLSearchParams();

      // Add filters to params
      if (filters.page) params.append("page", filters.page);
      if (filters.limit) params.append("limit", filters.limit);
      if (filters.category) params.append("category", filters.category);
      if (filters.brand) params.append("brand", filters.brand);
      if (filters.active_only !== undefined) params.append("active_only", filters.active_only);

      const queryString = params.toString();
      const url = `http://localhost:5000/api/foods${queryString ? `?${queryString}` : ""}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch foods");
      }
      
      return data.data;
    } catch (err) {
      console.error("Error fetching foods:", err);
      throw err;
    }
  };

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foods", filters],
    queryFn: fetchFoods,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    foods: data?.foods, 
    pagination: data?.pagination, 
    isLoading, 
    isError, 
    error, 
    refetch 
  };
}

// Food categories constant
export const FOOD_CATEGORIES = {
  DRY: 'dry',
  WET: 'wet',
  TREATS: 'treats',
  PRESCRIPTION: 'prescription'
};

// Helper functions for food data
export const FoodUtils = {
  // Get category display name
  getCategoryDisplayName: (category) => {
    const names = {
      [FOOD_CATEGORIES.DRY]: 'Dry Food',
      [FOOD_CATEGORIES.WET]: 'Wet Food',
      [FOOD_CATEGORIES.TREATS]: 'Treats',
      [FOOD_CATEGORIES.PRESCRIPTION]: 'Prescription Food'
    };
    return names[category] || category;
  },
  
  // Format price
  formatPrice: (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price || 0);
  },
  
  // Get category color
  getCategoryColor: (category) => {
    const colors = {
      [FOOD_CATEGORIES.DRY]: 'bg-blue-100 text-blue-800',
      [FOOD_CATEGORIES.WET]: 'bg-green-100 text-green-800',
      [FOOD_CATEGORIES.TREATS]: 'bg-yellow-100 text-yellow-800',
      [FOOD_CATEGORIES.PRESCRIPTION]: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  },
  
  // Check if nutritional info is available
  hasNutritionalInfo: (food) => {
    return food.nutritional_info && Object.keys(food.nutritional_info).length > 0;
  },
  
  // Format nutritional info for display
  formatNutritionalInfo: (nutritionalInfo) => {
    if (!nutritionalInfo || typeof nutritionalInfo !== 'object') return {};
    
    return Object.entries(nutritionalInfo).map(([key, value]) => ({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value,
      unit: FoodUtils.getNutritionalUnit(key)
    }));
  },
  
  // Get unit for nutritional values
  getNutritionalUnit: (key) => {
    const units = {
      protein: '%',
      fat: '%',
      fiber: '%',
      moisture: '%',
      ash: '%',
      calories: 'kcal/kg',
      calcium: '%',
      phosphorus: '%'
    };
    return units[key.toLowerCase()] || '';
  },
  
  // Filter foods by search term
  filterBySearch: (foods, searchTerm) => {
    if (!searchTerm) return foods;
    
    const term = searchTerm.toLowerCase();
    return foods?.filter(food => 
      food.name.toLowerCase().includes(term) ||
      food.brand?.toLowerCase().includes(term) ||
      food.description?.toLowerCase().includes(term) ||
      food.ingredients?.toLowerCase().includes(term)
    ) || [];
  },
  
  // Group foods by category
  groupByCategory: (foods) => {
    const grouped = {};
    
    Object.values(FOOD_CATEGORIES).forEach(category => {
      grouped[category] = foods?.filter(food => food.category === category) || [];
    });
    
    return grouped;
  },
  
  // Get unique brands
  getUniqueBrands: (foods) => {
    const brands = new Set();
    foods?.forEach(food => {
      if (food.brand) brands.add(food.brand);
    });
    return Array.from(brands).sort();
  }
};

/*
Example usage:

import { useGetFoods, FOOD_CATEGORIES, FoodUtils } from '@/hooks/food/useGetFoods';

function FoodList() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    brand: '',
    active_only: true
  });

  const { foods, pagination, isLoading, error } = useGetFoods(filters);

  const groupedFoods = FoodUtils.groupByCategory(foods);
  const uniqueBrands = FoodUtils.getUniqueBrands(foods);

  return (
    <div>
      <div className="filters">
        <select 
          value={filters.category} 
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          {Object.values(FOOD_CATEGORIES).map(category => (
            <option key={category} value={category}>
              {FoodUtils.getCategoryDisplayName(category)}
            </option>
          ))}
        </select>
      </div>

      <div className="food-grid">
        {foods?.map(food => (
          <div key={food.id} className="food-card">
            <h3>{food.name}</h3>
            <span className={FoodUtils.getCategoryColor(food.category)}>
              {FoodUtils.getCategoryDisplayName(food.category)}
            </span>
            <p>{FoodUtils.formatPrice(food.price_per_serving)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
*/
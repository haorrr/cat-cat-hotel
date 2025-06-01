// src/components/hooks/food/useFoodActions.jsx
"use client";

import { useGetFoods } from "./useGetFoods";
import { useGetFoodById } from "./useGetFoodById";
import { useCreateFood } from "./useCreateFood";
import { useUpdateFood } from "./useUpdateFood";
import { useDeleteFood } from "./useDeleteFood";

/**
 * Hook tổng hợp tất cả các actions liên quan đến food
 * Giúp việc import và sử dụng đơn giản hơn
 * 
 * @example
 * const foodActions = useFoodActions();
 * const { useGetFoods, useCreateFood, etc. } = foodActions;
 */
export function useFoodActions() {
  return {
    useGetFoods,
    useGetFoodById,
    useCreateFood,
    useUpdateFood,
    useDeleteFood,
  };
}

// Export individual hooks for direct import
export {
  useGetFoods,
  useGetFoodById,
  useCreateFood,
  useUpdateFood,
  useDeleteFood,
};

// Food constants
export const FOOD_CONSTANTS = {
  CATEGORIES: {
    DRY: 'dry',
    WET: 'wet',
    TREATS: 'treats',
    PRESCRIPTION: 'prescription'
  },
  
  CATEGORY_DISPLAY_NAMES: {
    dry: 'Dry Food',
    wet: 'Wet Food',
    treats: 'Treats',
    prescription: 'Prescription Food'
  },
  
  VALIDATION_LIMITS: {
    NAME_MAX_LENGTH: 100,
    BRAND_MAX_LENGTH: 50,
    DESCRIPTION_MAX_LENGTH: 1000,
    INGREDIENTS_MAX_LENGTH: 1000,
    MIN_PRICE: 0
  },
  
  DEFAULT_PAGINATION: {
    PAGE: 1,
    LIMIT: 20
  }
};

// Color schemes for food categories
export const FOOD_COLORS = {
  CATEGORY: {
    dry: {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800'
    },
    wet: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      badge: 'bg-green-100 text-green-800'
    },
    treats: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      badge: 'bg-yellow-100 text-yellow-800'
    },
    prescription: {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      badge: 'bg-red-100 text-red-800'
    }
  },
  
  STATUS: {
    active: {
      bg: 'bg-green-50',
      text: 'text-green-800',
      badge: 'bg-green-100 text-green-800'
    },
    inactive: {
      bg: 'bg-gray-50',
      text: 'text-gray-800',
      badge: 'bg-gray-100 text-gray-800'
    }
  }
};

// Comprehensive food utility functions
export const FoodUtils = {
  // Format price for display
  formatPrice: (price, currency = 'VND', locale = 'vi-VN') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(price || 0);
  },
  
  // Get category display info
  getCategoryInfo: (category) => {
    return {
      name: FOOD_CONSTANTS.CATEGORY_DISPLAY_NAMES[category] || category,
      colors: FOOD_COLORS.CATEGORY[category] || FOOD_COLORS.CATEGORY.dry,
      value: category
    };
  },
  
  // Get status display info
  getStatusInfo: (isActive) => {
    return {
      name: isActive ? 'Active' : 'Inactive',
      colors: FOOD_COLORS.STATUS[isActive ? 'active' : 'inactive'],
      value: isActive
    };
  },
  
  // Validate food data
  validateFood: (foodData) => {
    const errors = [];
    
    // Required fields
    if (!foodData.name?.trim()) {
      errors.push('Name is required');
    } else if (foodData.name.length > FOOD_CONSTANTS.VALIDATION_LIMITS.NAME_MAX_LENGTH) {
      errors.push(`Name must be less than ${FOOD_CONSTANTS.VALIDATION_LIMITS.NAME_MAX_LENGTH} characters`);
    }
    
    if (!foodData.category) {
      errors.push('Category is required');
    } else if (!Object.values(FOOD_CONSTANTS.CATEGORIES).includes(foodData.category)) {
      errors.push('Invalid category');
    }
    
    if (foodData.price_per_serving === undefined || foodData.price_per_serving <= FOOD_CONSTANTS.VALIDATION_LIMITS.MIN_PRICE) {
      errors.push('Price per serving is required and must be positive');
    }
    
    // Optional field validation
    if (foodData.brand && foodData.brand.length > FOOD_CONSTANTS.VALIDATION_LIMITS.BRAND_MAX_LENGTH) {
      errors.push(`Brand must be less than ${FOOD_CONSTANTS.VALIDATION_LIMITS.BRAND_MAX_LENGTH} characters`);
    }
    
    if (foodData.description && foodData.description.length > FOOD_CONSTANTS.VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH) {
      errors.push(`Description must be less than ${FOOD_CONSTANTS.VALIDATION_LIMITS.DESCRIPTION_MAX_LENGTH} characters`);
    }
    
    if (foodData.ingredients && foodData.ingredients.length > FOOD_CONSTANTS.VALIDATION_LIMITS.INGREDIENTS_MAX_LENGTH) {
      errors.push(`Ingredients must be less than ${FOOD_CONSTANTS.VALIDATION_LIMITS.INGREDIENTS_MAX_LENGTH} characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Filter foods by multiple criteria
  filterFoods: (foods, filters) => {
    if (!foods) return [];
    
    return foods.filter(food => {
      // Category filter
      if (filters.category && food.category !== filters.category) {
        return false;
      }
      
      // Brand filter
      if (filters.brand && food.brand !== filters.brand) {
        return false;
      }
      
      // Active status filter
      if (filters.active_only && !food.is_active) {
        return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          food.name,
          food.brand,
          food.description,
          food.ingredients
        ].filter(Boolean).join(' ').toLowerCase();
        
        if (!searchFields.includes(searchTerm)) {
          return false;
        }
      }
      
      // Price range filter
      if (filters.minPrice && food.price_per_serving < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && food.price_per_serving > filters.maxPrice) {
        return false;
      }
      
      return true;
    });
  },
  
  // Sort foods by different criteria
  sortFoods: (foods, sortBy = 'name', sortOrder = 'asc') => {
    if (!foods) return [];
    
    const sorted = [...foods].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
          break;
        case 'price':
          valueA = a.price_per_serving || 0;
          valueB = b.price_per_serving || 0;
          break;
        case 'category':
          valueA = a.category || '';
          valueB = b.category || '';
          break;
        case 'brand':
          valueA = a.brand?.toLowerCase() || '';
          valueB = b.brand?.toLowerCase() || '';
          break;
        case 'created':
          valueA = new Date(a.created_at || 0);
          valueB = new Date(b.created_at || 0);
          break;
        default:
          valueA = a.name?.toLowerCase() || '';
          valueB = b.name?.toLowerCase() || '';
      }
      
      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    return sorted;
  },
  
  // Group foods by category
  groupByCategory: (foods) => {
    const grouped = {};
    
    Object.values(FOOD_CONSTANTS.CATEGORIES).forEach(category => {
      grouped[category] = foods?.filter(food => food.category === category) || [];
    });
    
    return grouped;
  },
  
  // Get unique values for filter dropdowns
  getUniqueValues: (foods, field) => {
    if (!foods) return [];
    
    const values = new Set();
    foods.forEach(food => {
      if (food[field]) values.add(food[field]);
    });
    
    return Array.from(values).sort();
  },
  
  // Calculate statistics
  calculateStats: (foods) => {
    if (!foods || foods.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        averagePrice: 0,
        priceRange: { min: 0, max: 0 },
        categoryCounts: {}
      };
    }
    
    const active = foods.filter(f => f.is_active).length;
    const prices = foods.map(f => f.price_per_serving).filter(p => p > 0);
    const categoryCounts = {};
    
    // Count by category
    Object.values(FOOD_CONSTANTS.CATEGORIES).forEach(category => {
      categoryCounts[category] = foods.filter(f => f.category === category).length;
    });
    
    return {
      total: foods.length,
      active,
      inactive: foods.length - active,
      averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0
      },
      categoryCounts
    };
  },
  
  // Export foods to CSV format
  exportToCSV: (foods) => {
    if (!foods || foods.length === 0) return '';
    
    const headers = [
      'ID', 'Name', 'Brand', 'Category', 'Price per Serving', 
      'Description', 'Ingredients', 'Active', 'Created At'
    ];
    
    const rows = foods.map(food => [
      food.id || '',
      food.name || '',
      food.brand || '',
      food.category || '',
      food.price_per_serving || '',
      food.description || '',
      food.ingredients || '',
      food.is_active ? 'Yes' : 'No',
      food.created_at || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    
    return csvContent;
  },
  
  // Import foods from CSV format (validation)
  validateCSVImport: (csvData) => {
    const errors = [];
    const warnings = [];
    const validatedFoods = [];
    
    csvData.forEach((row, index) => {
      const rowNumber = index + 1;
      const food = {
        name: row.name?.trim(),
        brand: row.brand?.trim(),
        category: row.category?.toLowerCase(),
        price_per_serving: parseFloat(row.price_per_serving),
        description: row.description?.trim(),
        ingredients: row.ingredients?.trim()
      };
      
      // Validate each food
      const validation = FoodUtils.validateFood(food);
      if (!validation.isValid) {
        errors.push(`Row ${rowNumber}: ${validation.errors.join(', ')}`);
      } else {
        validatedFoods.push(food);
        
        // Check for warnings
        if (!food.brand) {
          warnings.push(`Row ${rowNumber}: No brand specified`);
        }
        if (!food.description) {
          warnings.push(`Row ${rowNumber}: No description provided`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      validatedFoods,
      totalRows: csvData.length,
      validRows: validatedFoods.length
    };
  }
};

// Food form helpers
export const FoodFormHelpers = {
  // Get default form values
  getDefaultFormValues: () => ({
    name: '',
    brand: '',
    description: '',
    price_per_serving: '',
    category: '',
    ingredients: '',
    nutritional_info: {},
    is_active: true
  }),
  
  // Get nutritional info template based on category
  getNutritionalTemplate: (category) => {
    const templates = {
      [FOOD_CONSTANTS.CATEGORIES.DRY]: {
        protein: '',
        fat: '',
        fiber: '',
        moisture: '',
        calories: ''
      },
      [FOOD_CONSTANTS.CATEGORIES.WET]: {
        protein: '',
        fat: '',
        moisture: '',
        ash: '',
        calories: ''
      },
      [FOOD_CONSTANTS.CATEGORIES.TREATS]: {
        protein: '',
        fat: '',
        calories: ''
      },
      [FOOD_CONSTANTS.CATEGORIES.PRESCRIPTION]: {
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
  
  // Convert form data to API format
  formatForAPI: (formData) => {
    const apiData = {
      name: formData.name?.trim(),
      category: formData.category,
      price_per_serving: Number(formData.price_per_serving)
    };
    
    // Add optional fields only if they have values
    if (formData.brand?.trim()) apiData.brand = formData.brand.trim();
    if (formData.description?.trim()) apiData.description = formData.description.trim();
    if (formData.ingredients?.trim()) apiData.ingredients = formData.ingredients.trim();
    if (formData.nutritional_info && Object.keys(formData.nutritional_info).length > 0) {
      apiData.nutritional_info = formData.nutritional_info;
    }
    if (formData.is_active !== undefined) apiData.is_active = Boolean(formData.is_active);
    
    return apiData;
  },
  
  // Convert API data to form format
  formatFromAPI: (apiData) => {
    return {
      name: apiData.name || '',
      brand: apiData.brand || '',
      description: apiData.description || '',
      price_per_serving: apiData.price_per_serving || '',
      category: apiData.category || '',
      ingredients: apiData.ingredients || '',
      nutritional_info: apiData.nutritional_info || {},
      is_active: apiData.is_active ?? true
    };
  }
};

/*
Complete usage examples:

// 1. Basic food list with all features
import { 
  useFoodActions, 
  FOOD_CONSTANTS, 
  FOOD_COLORS,
  FoodUtils 
} from '@/hooks/food/useFoodActions';

function FoodManagement() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    category: '',
    brand: '',
    active_only: true,
    search: ''
  });

  const { foods, pagination, isLoading } = useGetFoods(filters);
  const { createFoodMutation } = useCreateFood();
  const { deleteFoodMutation } = useDeleteFood();

  const filteredFoods = FoodUtils.filterFoods(foods, filters);
  const sortedFoods = FoodUtils.sortFoods(filteredFoods, 'name', 'asc');
  const stats = FoodUtils.calculateStats(foods);
  const groupedFoods = FoodUtils.groupByCategory(foods);

  return (
    <div className="food-management">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Foods</h3>
          <p>{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Active Foods</h3>
          <p>{stats.active}</p>
        </div>
        <div className="stat-card">
          <h3>Average Price</h3>
          <p>{FoodUtils.formatPrice(stats.averagePrice)}</p>
        </div>
      </div>

      <div className="filters">
        <select 
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          {Object.entries(FOOD_CONSTANTS.CATEGORY_DISPLAY_NAMES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="food-grid">
        {sortedFoods.map(food => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </div>
  );
}

// 2. Advanced food form with validation
function FoodForm({ foodId, onSuccess }) {
  const [formData, setFormData] = useState(FoodFormHelpers.getDefaultFormValues());
  const [errors, setErrors] = useState([]);

  const { food } = useGetFoodById(foodId);
  const { createFoodMutation, isLoading } = useCreateFood();
  const { updateFoodMutation } = useUpdateFood(foodId);

  useEffect(() => {
    if (food) {
      setFormData(FoodFormHelpers.formatFromAPI(food));
    }
  }, [food]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = FoodUtils.validateFood(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    const apiData = FoodFormHelpers.formatForAPI(formData);
    
    if (foodId) {
      updateFoodMutation(apiData);
    } else {
      createFoodMutation(apiData);
    }
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category,
      nutritional_info: FoodFormHelpers.getNutritionalTemplate(category)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="food-form">
      <div className="form-grid">
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
          {Object.entries(FOOD_CONSTANTS.CATEGORY_DISPLAY_NAMES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        
        <input
          type="number"
          step="0.01"
          placeholder="Price per serving"
          value={formData.price_per_serving}
          onChange={(e) => setFormData({...formData, price_per_serving: e.target.value})}
          required
        />
      </div>
      
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <div key={index} className="error">{error}</div>
          ))}
        </div>
      )}
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : foodId ? 'Update Food' : 'Create Food'}
      </button>
    </form>
  );
}

// 3. Food card component with all utilities
function FoodCard({ food }) {
  const categoryInfo = FoodUtils.getCategoryInfo(food.category);
  const statusInfo = FoodUtils.getStatusInfo(food.is_active);

  return (
    <div className={`food-card ${categoryInfo.colors.border} ${categoryInfo.colors.bg}`}>
      <div className="food-header">
        <h3 className={categoryInfo.colors.text}>{food.name}</h3>
        <span className={`badge ${statusInfo.colors.badge}`}>
          {statusInfo.name}
        </span>
      </div>
      
      <div className="food-details">
        <p className="brand">{food.brand || 'No brand'}</p>
        <p className="price">{FoodUtils.formatPrice(food.price_per_serving)}</p>
        <span className={`category-badge ${categoryInfo.colors.badge}`}>
          {categoryInfo.name}
        </span>
      </div>
      
      <div className="food-actions">
        <button className="btn-edit">Edit</button>
        <button className="btn-delete">Delete</button>
      </div>
    </div>
  );
}
*/
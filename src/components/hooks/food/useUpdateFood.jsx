// src/components/hooks/food/useUpdateFood.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để cập nhật food (chỉ admin)
 * @param {number} foodId - ID của food cần cập nhật
 */
export function useUpdateFood(foodId) {
  const queryClient = useQueryClient();

  const updateFood = async (updateData) => {
    try {
      const token = localStorage.getItem("token");

      if (!foodId) {
        throw new Error("Food ID is required");
      }

      // Validate category if provided
      if (updateData.category && !['dry', 'wet', 'treats', 'prescription'].includes(updateData.category)) {
        throw new Error("Invalid category. Must be: dry, wet, treats, or prescription");
      }

      // Validate price if provided
      if (updateData.price_per_serving !== undefined && updateData.price_per_serving < 0) {
        throw new Error("Price must be a positive number");
      }

      // Filter out undefined/empty values
      const filteredData = {};
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined && updateData[key] !== '') {
          filteredData[key] = updateData[key];
        }
      });

      if (Object.keys(filteredData).length === 0) {
        throw new Error("No valid fields to update");
      }

      const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
        body: JSON.stringify(filteredData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update food");
      }
      
      return data.data.food;
    } catch (err) {
      console.error("Error updating food:", err);
      throw err;
    }
  };

  const {
    mutate: updateFoodMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: updatedFood,
  } = useMutation({
    mutationFn: updateFood,
    onSuccess: (food) => {
      // Invalidate và update cache
      queryClient.invalidateQueries(["foods"]);
      queryClient.setQueryData(["food", foodId], food);
      
      console.log("Food updated successfully:", food);
    },
    onError: (error) => {
      console.error("Food update failed:", error);
    },
  });

  return { 
    updateFoodMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess, 
    updatedFood 
  };
}

// Update validation utilities
export const FoodUpdateUtils = {
  // Validate update data
  validateUpdateData: (updateData) => {
    const errors = [];
    
    // Validate name if provided
    if (updateData.name !== undefined) {
      if (!updateData.name || updateData.name.trim() === '') {
        errors.push('Name cannot be empty');
      } else if (updateData.name.length > 100) {
        errors.push('Name must be less than 100 characters');
      }
    }
    
    // Validate price if provided
    if (updateData.price_per_serving !== undefined) {
      if (updateData.price_per_serving <= 0) {
        errors.push('Price per serving must be positive');
      }
    }
    
    // Validate category if provided
    if (updateData.category !== undefined) {
      if (!['dry', 'wet', 'treats', 'prescription'].includes(updateData.category)) {
        errors.push('Invalid category');
      }
    }
    
    // Validate optional fields
    if (updateData.brand !== undefined && updateData.brand.length > 50) {
      errors.push('Brand must be less than 50 characters');
    }
    
    if (updateData.description !== undefined && updateData.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }
    
    if (updateData.ingredients !== undefined && updateData.ingredients.length > 1000) {
      errors.push('Ingredients must be less than 1000 characters');
    }
    
    if (updateData.ingredients !== undefined && updateData.ingredients.length > 1000) {
      errors.push('Ingredients must be less than 1000 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Compare current data with update data to detect changes
  detectChanges: (currentFood, updateData) => {
    const changes = {};
    
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== currentFood[key]) {
        changes[key] = {
          old: currentFood[key],
          new: updateData[key]
        };
      }
    });
    
    return {
      hasChanges: Object.keys(changes).length > 0,
      changes
    };
  },
  
  // Clean update data (remove empty strings, format numbers)
  cleanUpdateData: (updateData) => {
    const cleaned = {};
    
    Object.keys(updateData).forEach(key => {
      const value = updateData[key];
      
      if (value !== undefined) {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed !== '') {
            cleaned[key] = trimmed;
          }
        } else if (typeof value === 'number') {
          cleaned[key] = value;
        } else if (typeof value === 'boolean') {
          cleaned[key] = value;
        } else if (typeof value === 'object' && value !== null) {
          // For nutritional_info object
          cleaned[key] = value;
        }
      }
    });
    
    return cleaned;
  },
  
  // Merge nutritional info (for partial updates)
  mergeNutritionalInfo: (current, updates) => {
    const currentInfo = current || {};
    const updatedInfo = updates || {};
    
    return {
      ...currentInfo,
      ...updatedInfo
    };
  },
  
  // Get update summary for confirmation
  getUpdateSummary: (changes) => {
    const summary = [];
    
    Object.entries(changes).forEach(([field, change]) => {
      let displayField = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      let oldValue = change.old || 'Not set';
      let newValue = change.new || 'Will be removed';
      
      if (field === 'price_per_serving') {
        oldValue = oldValue ? `${oldValue} VND` : 'Not set';
        newValue = newValue ? `${newValue} VND` : 'Will be removed';
      } else if (field === 'is_active') {
        oldValue = oldValue ? 'Active' : 'Inactive';
        newValue = newValue ? 'Active' : 'Inactive';
      } else if (field === 'nutritional_info') {
        oldValue = 'Current nutritional info';
        newValue = 'Updated nutritional info';
      }
      
      summary.push({
        field: displayField,
        oldValue,
        newValue
      });
    });
    
    return summary;
  },
  
  // Create update payload with only changed fields
  createUpdatePayload: (currentFood, formData) => {
    const payload = {};
    
    // Compare each field
    const fieldsToCheck = [
      'name', 'brand', 'description', 'price_per_serving', 
      'category', 'ingredients', 'nutritional_info', 'is_active'
    ];
    
    fieldsToCheck.forEach(field => {
      if (formData[field] !== undefined && formData[field] !== currentFood[field]) {
        payload[field] = formData[field];
      }
    });
    
    return payload;
  }
};

/*
Example usage:

import { useUpdateFood, FoodUpdateUtils } from '@/hooks/food/useUpdateFood';
import { useGetFoodById } from '@/hooks/food/useGetFoodById';

function UpdateFoodForm({ foodId }) {
  const { food: currentFood, isLoading: loadingFood } = useGetFoodById(foodId);
  const { updateFoodMutation, isLoading, isError, error, isSuccess } = useUpdateFood(foodId);
  
  const [formData, setFormData] = useState({});
  const [showChanges, setShowChanges] = useState(false);

  // Pre-fill form when food data loads
  useEffect(() => {
    if (currentFood) {
      setFormData({
        name: currentFood.name || '',
        brand: currentFood.brand || '',
        description: currentFood.description || '',
        price_per_serving: currentFood.price_per_serving || '',
        category: currentFood.category || '',
        ingredients: currentFood.ingredients || '',
        nutritional_info: currentFood.nutritional_info || {},
        is_active: currentFood.is_active ?? true
      });
    }
  }, [currentFood]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate update data
    const validation = FoodUpdateUtils.validateUpdateData(formData);
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }
    
    // Detect changes
    const changeDetection = FoodUpdateUtils.detectChanges(currentFood, formData);
    if (!changeDetection.hasChanges) {
      alert('No changes detected');
      return;
    }
    
    // Clean and submit
    const cleanedData = FoodUpdateUtils.cleanUpdateData(formData);
    const payload = FoodUpdateUtils.createUpdatePayload(currentFood, cleanedData);
    
    updateFoodMutation(payload);
  };

  const handlePreviewChanges = () => {
    const changeDetection = FoodUpdateUtils.detectChanges(currentFood, formData);
    if (changeDetection.hasChanges) {
      const summary = FoodUpdateUtils.getUpdateSummary(changeDetection.changes);
      setShowChanges(true);
      console.log('Changes summary:', summary);
    } else {
      alert('No changes to preview');
    }
  };

  if (loadingFood) return <div>Loading food data...</div>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Food name"
        value={formData.name || ''}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <input
        type="text"
        placeholder="Brand"
        value={formData.brand || ''}
        onChange={(e) => setFormData({...formData, brand: e.target.value})}
      />
      
      <textarea
        placeholder="Description"
        value={formData.description || ''}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />
      
      <input
        type="number"
        step="0.01"
        placeholder="Price per serving"
        value={formData.price_per_serving || ''}
        onChange={(e) => setFormData({...formData, price_per_serving: parseFloat(e.target.value)})}
      />
      
      <select
        value={formData.category || ''}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="">Select category</option>
        <option value="dry">Dry Food</option>
        <option value="wet">Wet Food</option>
        <option value="treats">Treats</option>
        <option value="prescription">Prescription Food</option>
      </select>
      
      <textarea
        placeholder="Ingredients"
        value={formData.ingredients || ''}
        onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
      />
      
      <label>
        <input
          type="checkbox"
          checked={formData.is_active ?? true}
          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
        />
        Active
      </label>
      
      <div className="actions">
        <button type="button" onClick={handlePreviewChanges}>
          Preview Changes
        </button>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Food'}
        </button>
      </div>
      
      {isError && <div className="error">{error.message}</div>}
      {isSuccess && <div className="success">Food updated successfully!</div>}
    </form>
  );
}
*/
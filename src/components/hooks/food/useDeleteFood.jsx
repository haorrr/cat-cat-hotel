// src/components/hooks/food/useDeleteFood.jsx
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook để xóa food (chỉ admin)
 * Sẽ soft delete nếu food đang được sử dụng trong bookings
 * Hard delete nếu không có usage
 */
export function useDeleteFood() {
  const queryClient = useQueryClient();

  const deleteFood = async (foodId) => {
    try {
      const token = localStorage.getItem("token");

      if (!foodId) {
        throw new Error("Food ID is required");
      }

      const res = await fetch(`http://localhost:5000/api/foods/${foodId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete food");
      }
      
      return {
        ...data,
        foodId // Include foodId in response for cache management
      };
    } catch (err) {
      console.error("Error deleting food:", err);
      throw err;
    }
  };

  const {
    mutate: deleteFoodMutation,
    isLoading,
    isError,
    error,
    isSuccess,
    data: deleteResult,
  } = useMutation({
    mutationFn: deleteFood,
    onSuccess: (result) => {
      // Invalidate foods list để refresh data
      queryClient.invalidateQueries(["foods"]);
      
      // Remove specific food from cache nếu hard delete
      if (result.message.includes('deleted successfully')) {
        queryClient.removeQueries(["food", result.foodId]);
      } else {
        // Soft delete - invalidate to refetch updated data
        queryClient.invalidateQueries(["food", result.foodId]);
      }
      
      console.log("Food deletion completed:", result);
    },
    onError: (error) => {
      console.error("Food deletion failed:", error);
    },
  });

  return { 
    deleteFoodMutation, 
    isLoading, 
    isError, 
    error, 
    isSuccess,
    deleteResult
  };
}

// Delete utilities and safety checks
export const FoodDeleteUtils = {
  // Check if food can be safely deleted
  canSafelyDelete: (food) => {
    // Basic checks
    const checks = {
      exists: !!food,
      isActive: food?.is_active === true,
      hasId: !!food?.id
    };
    
    return {
      ...checks,
      canDelete: checks.exists && checks.hasId,
      warnings: FoodDeleteUtils.getDeleteWarnings(food)
    };
  },
  
  // Get warnings before deletion
  getDeleteWarnings: (food) => {
    const warnings = [];
    
    if (!food) {
      warnings.push('Food not found');
      return warnings;
    }
    
    if (!food.is_active) {
      warnings.push('Food is already inactive');
    }
    
    if (food.category === 'prescription') {
      warnings.push('This is a prescription food - deletion may affect medical treatments');
    }
    
    // Note: Backend will handle booking usage check
    warnings.push('If this food is used in existing bookings, it will be deactivated instead of deleted');
    
    return warnings;
  },
  
  // Format delete confirmation message
  getDeleteConfirmationMessage: (food) => {
    if (!food) return "Are you sure you want to delete this food?";
    
    const warnings = FoodDeleteUtils.getDeleteWarnings(food);
    const baseMessage = `Are you sure you want to delete "${food.name}"?`;
    
    if (warnings.length > 0) {
      return `${baseMessage}\n\nWarnings:\n${warnings.map(w => `• ${w}`).join('\n')}`;
    }
    
    return baseMessage;
  },
  
  // Parse delete result to determine what happened
  parseDeleteResult: (result) => {
    if (!result) return { type: 'unknown', message: 'Unknown result' };
    
    const message = result.message || '';
    
    if (message.includes('deactivated') || message.includes('existing bookings')) {
      return {
        type: 'soft_delete',
        message: 'Food has been deactivated due to existing usage in bookings',
        icon: '🔒',
        color: 'text-yellow-600'
      };
    } else if (message.includes('deleted successfully')) {
      return {
        type: 'hard_delete',
        message: 'Food has been permanently deleted',
        icon: '🗑️',
        color: 'text-red-600'
      };
    }
    
    return {
      type: 'unknown',
      message: message || 'Food deletion completed',
      icon: '✅',
      color: 'text-green-600'
    };
  },
  
  // Get post-delete actions
  getPostDeleteActions: (deleteType) => {
    const actions = {
      soft_delete: [
        { label: 'View inactive foods', action: 'view_inactive' },
        { label: 'Reactivate food', action: 'reactivate' }
      ],
      hard_delete: [
        { label: 'Add new food', action: 'add_new' },
        { label: 'View food list', action: 'view_list' }
      ],
      unknown: [
        { label: 'Refresh list', action: 'refresh' }
      ]
    };
    
    return actions[deleteType] || actions.unknown;
  },
  
  // Validate deletion permission
  validateDeletionPermission: (userRole, food) => {
    const errors = [];
    
    if (userRole !== 'admin') {
      errors.push('Only administrators can delete foods');
    }
    
    if (!food) {
      errors.push('Food not found');
    }
    
    return {
      canDelete: errors.length === 0,
      errors
    };
  }
};

/*
Example usage:

import { useDeleteFood, FoodDeleteUtils } from '@/hooks/food/useDeleteFood';
import { useGetFoodById } from '@/hooks/food/useGetFoodById';

function DeleteFoodButton({ foodId, userRole }) {
  const { food } = useGetFoodById(foodId);
  const { deleteFoodMutation, isLoading, isError, error, isSuccess, deleteResult } = useDeleteFood();

  const handleDelete = () => {
    // Validate permission
    const permission = FoodDeleteUtils.validateDeletionPermission(userRole, food);
    if (!permission.canDelete) {
      alert(permission.errors.join('\n'));
      return;
    }

    // Check if can safely delete
    const safety = FoodDeleteUtils.canSafelyDelete(food);
    if (!safety.canDelete) {
      alert('Cannot delete this food');
      return;
    }

    // Show confirmation with warnings
    const confirmationMessage = FoodDeleteUtils.getDeleteConfirmationMessage(food);
    if (window.confirm(confirmationMessage)) {
      deleteFoodMutation(foodId);
    }
  };

  // Handle successful deletion
  useEffect(() => {
    if (isSuccess && deleteResult) {
      const result = FoodDeleteUtils.parseDeleteResult(deleteResult);
      const actions = FoodDeleteUtils.getPostDeleteActions(result.type);
      
      // Show result message
      alert(`${result.icon} ${result.message}`);
      
      // You can show post-delete actions here
      console.log('Available actions:', actions);
    }
  }, [isSuccess, deleteResult]);

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={isLoading || !food}
        className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Deleting...' : 'Delete Food'}
      </button>
      
      {isError && (
        <div className="text-red-600 text-sm mt-2">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

// Bulk delete component example
function BulkDeleteFoods({ selectedFoodIds, userRole }) {
  const { deleteFoodMutation, isLoading } = useDeleteFood();
  const [deleteResults, setDeleteResults] = useState([]);

  const handleBulkDelete = async () => {
    if (userRole !== 'admin') {
      alert('Only administrators can delete foods');
      return;
    }

    if (!selectedFoodIds.length) {
      alert('No foods selected');
      return;
    }

    if (!window.confirm(`Delete ${selectedFoodIds.length} selected foods?`)) {
      return;
    }

    const results = [];
    for (const foodId of selectedFoodIds) {
      try {
        const result = await deleteFoodMutation(foodId);
        results.push({ foodId, success: true, result });
      } catch (error) {
        results.push({ foodId, success: false, error: error.message });
      }
    }
    
    setDeleteResults(results);
  };

  return (
    <div>
      <button
        onClick={handleBulkDelete}
        disabled={isLoading || !selectedFoodIds.length}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete Selected ({selectedFoodIds.length})
      </button>
      
      {deleteResults.length > 0 && (
        <div className="mt-4">
          <h4>Deletion Results:</h4>
          {deleteResults.map((result, index) => (
            <div key={index} className={result.success ? 'text-green-600' : 'text-red-600'}>
              Food {result.foodId}: {result.success ? 'Success' : result.error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/
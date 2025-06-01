import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

export function Toast({ type = "info", message, isVisible, onClose, duration = 5000 }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const types = {
    success: {
      icon: CheckCircle,
      className: "bg-green-50 border-green-200 text-green-800",
      iconClassName: "text-green-500"
    },
    error: {
      icon: AlertCircle,
      className: "bg-red-50 border-red-200 text-red-800",
      iconClassName: "text-red-500"
    },
    warning: {
      icon: AlertCircle,
      className: "bg-yellow-50 border-yellow-200 text-yellow-800",
      iconClassName: "text-yellow-500"
    },
    info: {
      icon: Info,
      className: "bg-blue-50 border-blue-200 text-blue-800",
      iconClassName: "text-blue-500"
    }
  };

  const { icon: Icon, className, iconClassName } = types[type];

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center p-4 border rounded-lg shadow-lg max-w-sm ${className}`}>
      <Icon className={`h-5 w-5 mr-3 ${iconClassName}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
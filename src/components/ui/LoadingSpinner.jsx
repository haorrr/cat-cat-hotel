export function LoadingSpinner({ size = "md", className = "" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-orange-500 ${sizeClasses[size]} ${className}`}></div>
  );
}

// src/components/ui/Badge.jsx
export function Badge({ children, variant = "default", size = "md", className = "" }) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-orange-100 text-orange-800",
    secondary: "bg-pink-100 text-pink-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-2 text-base",
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
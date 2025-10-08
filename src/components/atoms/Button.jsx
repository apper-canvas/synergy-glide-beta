import { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(
  ({ className, variant = "primary", size = "md", icon, iconPosition = "left", children, disabled, loading, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
const variants = {
      primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow-md",
      secondary: "bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 focus:ring-primary-500",
      outline: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500",
      ghost: "text-primary-600 hover:bg-primary-50 focus:ring-primary-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md",
      success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm hover:shadow-md",
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2.5 text-sm gap-2",
      lg: "px-6 py-3 text-base gap-2",
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <ApperIcon name="Loader2" className="animate-spin" size={16} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <ApperIcon name={icon} size={16} />
            )}
            {children}
            {icon && iconPosition === "right" && (
              <ApperIcon name={icon} size={16} />
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
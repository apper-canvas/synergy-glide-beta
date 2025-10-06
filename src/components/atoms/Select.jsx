import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "w-full px-3 py-2.5 text-sm bg-white border rounded-md transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          error ? "border-red-500" : "border-slate-300",
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = "Select";

export default Select;
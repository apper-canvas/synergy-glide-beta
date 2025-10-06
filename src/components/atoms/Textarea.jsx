import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full px-3 py-2.5 text-sm bg-white border rounded-md transition-colors duration-200 resize-none",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          error ? "border-red-500" : "border-slate-300",
          "disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed",
          className
        )}
        rows={rows}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
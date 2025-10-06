import { cn } from "@/utils/cn";

const Label = ({ children, required, className, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "block text-sm font-medium text-slate-700 mb-1.5",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
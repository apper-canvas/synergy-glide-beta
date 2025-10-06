import { cn } from "@/utils/cn";

const ProgressBar = ({ value, max = 100, size = "md", showLabel = false, className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };
  
  const getColorClass = () => {
    if (percentage >= 75) return "bg-green-500";
    if (percentage >= 50) return "bg-blue-500";
    if (percentage >= 25) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div className={cn("w-full bg-slate-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn("h-full transition-all duration-300 rounded-full", getColorClass())}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-slate-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
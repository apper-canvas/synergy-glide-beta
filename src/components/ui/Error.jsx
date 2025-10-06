import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  message = "Something went wrong. Please try again.", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Error</h3>
      <p className="text-sm text-slate-600 text-center max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} icon="RefreshCw">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;
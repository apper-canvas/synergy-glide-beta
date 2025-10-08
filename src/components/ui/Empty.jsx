import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  icon = "Inbox",
  title = "No data found",
  message = "Get started by creating your first item.",
  actionLabel,
  onAction,
  actionVariant = "primary",
  children,
  className 
}) => {
return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={40} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 text-center max-w-md mb-6">
        {message}
      </p>
      {children ? (
        children
      ) : actionLabel && onAction ? (
        <Button onClick={onAction} icon="Plus" variant={actionVariant}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default Empty;
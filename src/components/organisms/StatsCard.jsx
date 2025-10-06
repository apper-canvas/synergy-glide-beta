import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatsCard = ({ title, value, icon, trend, trendValue, color = "primary" }) => {
  const colorClasses = {
    primary: "from-primary-500 to-primary-700",
    success: "from-green-500 to-green-700",
    warning: "from-amber-500 to-amber-700",
    danger: "from-red-500 to-red-700",
    info: "from-blue-500 to-blue-700",
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}>
              <ApperIcon 
                name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
                size={16} 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;
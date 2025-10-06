import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Breadcrumb = ({ items, className }) => {
  const location = useLocation();
  
  const pathSegments = location.pathname.split("/").filter(Boolean);
  
  const breadcrumbItems = items || pathSegments.map((segment, index) => {
    const path = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, path };
  });
  
  return (
    <nav className={cn("flex items-center space-x-2 text-sm", className)}>
      <Link
        to="/dashboard"
        className="text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ApperIcon name="Home" size={16} />
      </Link>
      
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ApperIcon name="ChevronRight" size={14} className="text-slate-400" />
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-slate-900 font-medium">{item.label}</span>
          ) : (
            <Link
              to={item.path}
              className="text-slate-600 hover:text-slate-900 transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
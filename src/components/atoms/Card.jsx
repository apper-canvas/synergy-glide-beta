import { cn } from "@/utils/cn";

const Card = ({ children, className, hover = false, onClick }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-slate-200 shadow-sm transition-all duration-200",
        hover && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
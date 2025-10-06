import Avatar from "@/components/atoms/Avatar";
import { cn } from "@/utils/cn";

const AvatarGroup = ({ users = [], max = 5, size = "md", className }) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length - max;
  
  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayUsers.map((user, index) => (
        <div
          key={user.Id || index}
          className="ring-2 ring-white rounded-full"
          title={user.name}
        >
          <Avatar
            src={user.avatar_url}
            name={user.name}
            size={size}
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            "ring-2 ring-white rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold",
            size === "sm" && "w-8 h-8 text-xs",
            size === "md" && "w-10 h-10 text-sm",
            size === "lg" && "w-12 h-12 text-base"
          )}
          title={`+${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;
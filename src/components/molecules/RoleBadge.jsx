import Badge from "@/components/atoms/Badge";

const RoleBadge = ({ role, size = "md" }) => {
  const getRoleVariant = (role) => {
    switch (role) {
      case "Administrator":
        return "purple";
      case "HR/Admin":
        return "info";
      case "Project Manager":
        return "primary";
      case "Team Member":
        return "success";
      case "Guest/Viewer":
        return "default";
      default:
        return "default";
    }
  };
  
  return (
    <Badge variant={getRoleVariant(role)} size={size}>
      {role}
    </Badge>
  );
};

export default RoleBadge;
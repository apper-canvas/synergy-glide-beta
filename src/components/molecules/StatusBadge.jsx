import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "project", size = "md" }) => {
  const getProjectStatusVariant = (status) => {
    switch (status) {
      case "Planning":
        return "info";
      case "Active":
        return "success";
      case "On Hold":
        return "warning";
      case "Completed":
        return "default";
      default:
        return "default";
    }
  };
  
  const getTaskStatusVariant = (status) => {
    switch (status) {
      case "To Do":
        return "default";
      case "In Progress":
        return "info";
      case "Review":
        return "warning";
      case "Done":
        return "success";
      default:
        return "default";
    }
  };
  
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Low":
        return "default";
      case "Medium":
        return "info";
      case "High":
        return "warning";
      case "Critical":
        return "danger";
      default:
        return "default";
    }
  };
  
  const getVariant = () => {
    if (type === "project") return getProjectStatusVariant(status);
    if (type === "task") return getTaskStatusVariant(status);
    if (type === "priority") return getPriorityVariant(status);
    return "default";
  };
  
  return (
    <Badge variant={getVariant()} size={size}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
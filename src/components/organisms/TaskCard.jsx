import { useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import taskService from "@/services/api/taskService";

const TaskCard = ({ task, onTaskClick, onTaskUpdate }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("taskId", task.Id.toString());
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  const getPriorityColor = () => {
    switch (task.priority) {
      case "Critical": return "text-red-600";
      case "High": return "text-orange-600";
      case "Medium": return "text-blue-600";
      case "Low": return "text-slate-600";
      default: return "text-slate-600";
    }
  };
  
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== "Done";
  
  return (
    <Card
      hover
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onTaskClick(task)}
      className={cn(
        "p-4 cursor-pointer",
        isDragging && "opacity-50"
      )}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-medium text-slate-900 line-clamp-2">
            {task.title}
          </h4>
          <StatusBadge status={task.priority} type="priority" size="sm" />
        </div>
        
        {task.description && (
          <p className="text-sm text-slate-600 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            {task.assignee && (
              <Avatar
                src={task.assignee.avatar_url}
                name={task.assignee.name}
                size="sm"
              />
            )}
          </div>
          
          {task.due_date && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              isOverdue ? "text-red-600 font-medium" : "text-slate-600"
            )}>
              <ApperIcon name="Calendar" size={14} />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
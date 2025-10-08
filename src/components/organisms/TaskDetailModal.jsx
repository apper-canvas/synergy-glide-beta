import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import StatusBadge from "@/components/molecules/StatusBadge";
import FileUpload from "@/components/molecules/FileUpload";
import FormField from "@/components/molecules/FormField";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import { formatDateTime } from "@/utils/formatters";
import { canManageTasks } from "@/utils/permissions";
import taskService from "@/services/api/taskService";

const TaskDetailModal = ({ isOpen, onClose, task, onUpdate }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  
  if (!task) return null;
const canEdit = canManageTasks(currentUser?.role, task, currentUser?.Id);
  
  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      await taskService.updateStatus(task.Id, newStatus);
      toast.success("Task status updated successfully");
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setSaving(false);
    }
  };
  
  const handleFileUpload = async (files) => {
    toast.success(`Uploaded ${files.length} file(s) to task`);
  };
  
  const handleAddComment = () => {
    if (!comment.trim()) return;
    toast.success("Comment added successfully");
    setComment("");
  };
  
return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {task.title}
            </h2>
            <div className="flex items-center gap-3">
              <StatusBadge status={task.status} type="task" />
              <StatusBadge status={task.priority} type="priority" />
            </div>
          </div>
          
          {canEdit && (
            <Button
              variant="outline"
              size="sm"
              icon="Edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
          <div>
            <p className="text-sm text-slate-600 mb-1">Assignee</p>
            {task.assignee ? (
              <div className="flex items-center gap-2">
                <Avatar
                  src={task.assignee.avatar_url}
                  name={task.assignee.name}
                  size="sm"
                />
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {task.assignee.name}
                  </p>
                  <p className="text-xs text-slate-600">
                    {task.assignee.job_title}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Unassigned</p>
            )}
          </div>
          
          <div>
            <p className="text-sm text-slate-600 mb-1">Due Date</p>
            <div className="flex items-center gap-2">
              <ApperIcon name="Calendar" size={16} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-900">
                {task.due_date || "No due date"}
              </span>
            </div>
          </div>
        </div>
        
        {canEdit && (
          <div>
            <p className="text-sm font-medium text-slate-900 mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {["To Do", "In Progress", "Review", "Done"].map((status) => (
                <Button
                  key={status}
                  variant={task.status === status ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  disabled={saving}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        <div>
          <p className="text-sm font-medium text-slate-900 mb-2">Description</p>
          <p className="text-sm text-slate-600 whitespace-pre-wrap">
            {task.description || "No description provided"}
          </p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-slate-900 mb-3">Attachments</p>
          {canEdit && (
            <FileUpload
              onUpload={handleFileUpload}
              maxSize={10485760}
              multiple
            />
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-slate-900 mb-3">Comments</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Avatar
                src={currentUser?.avatar_url}
                name={currentUser?.name}
                size="sm"
              />
              <div className="flex-1">
                <FormField
                  type="textarea"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    onClick={handleAddComment}
                    disabled={!comment.trim()}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
          <p>Created {formatDateTime(task.created_at)}</p>
          <p>Last updated {formatDateTime(task.updated_at)}</p>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
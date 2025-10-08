import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import TaskCard from "@/components/organisms/TaskCard";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { canManageTasks } from "@/utils/permissions";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";

const TaskBoard = () => {
  const { currentUser } = useSelector(state => state.user);
  const [tasks, setTasks] = useState([]);
const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [viewMode, setViewMode] = useState("board");
  const [filterProject, setFilterProject] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const columns = [
    { id: "To Do", title: "To Do", color: "slate" },
    { id: "In Progress", title: "In Progress", color: "blue" },
    { id: "Review", title: "Review", color: "amber" },
    { id: "Done", title: "Done", color: "green" }
  ];
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };
  
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
  };
  
  const handleDrop = async (e, status) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");
    
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    const task = tasks.find(t => t.Id === taskId);
    
    if (task && task.status !== status) {
      try {
        await taskService.updateStatus(taskId, status);
        toast.success(`Task moved to ${status}`);
        loadData();
      } catch (error) {
        toast.error("Failed to update task status");
      }
    }
  };
  
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };
  
  const getTasksByStatus = (status) => {
    let filtered = tasks.filter(t => t.status === status);
    
    if (filterProject !== "all") {
      filtered = filtered.filter(t => t.project_id === parseInt(filterProject));
    }
    
    return filtered;
  };
  
const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL tasks? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    const success = await taskService.deleteAll();
    setDeleting(false);
    
    if (success) {
      setSelectedIds([]);
      await loadData();
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected task(s)? This action cannot be undone.`)) {
      return;
    }
    
    setDeleting(true);
    let allSucceeded = true;
    
    for (const id of selectedIds) {
      const success = await taskService.delete(id);
      if (!success) allSucceeded = false;
    }
    
    setDeleting(false);
    
    if (allSucceeded) {
      setSelectedIds([]);
      await loadData();
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(tasks.map(t => t.Id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectTask = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id]
    );
  };

  if (loading) return <Loading message="Loading tasks..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-600 mt-1">{tasks.length} total tasks</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setViewMode("board")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "board"
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <ApperIcon name="LayoutGrid" size={16} className="inline mr-1" />
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                viewMode === "list"
                  ? "bg-primary-100 text-primary-700"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <ApperIcon name="List" size={16} className="inline mr-1" />
              List
            </button>
          </div>
          
          <Select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-48"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.Id} value={project.Id}>
                {project.name}
              </option>
            ))}
          </Select>

          {canManageTasks(currentUser?.role) && tasks.length > 0 && (
            <>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedIds.length === tasks.length && tasks.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Select All
              </label>
              {selectedIds.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  icon="Trash2"
                >
                  {deleting ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleDeleteAll}
                disabled={deleting}
                icon="Trash2"
              >
                {deleting ? "Deleting All..." : "Delete All Tasks"}
              </Button>
            </>
          )}
          
          <Button icon="Plus">
            New Task
          </Button>
        </div>
      </div>
      
      {viewMode === "board" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {columns.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <div key={column.id} className="space-y-3">
                <div className="flex items-center justify-between px-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      column.color === "slate" && "bg-slate-400",
                      column.color === "blue" && "bg-blue-500",
                      column.color === "amber" && "bg-amber-500",
                      column.color === "green" && "bg-green-500"
                    )} />
                    <h3 className="text-sm font-semibold text-slate-900">
                      {column.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-slate-500">
                    {columnTasks.length}
                  </span>
                </div>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, column.id)}
                  className="space-y-3 min-h-[200px] p-3 rounded-lg border-2 border-dashed border-transparent transition-colors"
                >
                  {columnTasks.map((task) => (
<TaskCard
                      key={task.Id}
                      task={task}
                      onTaskClick={handleTaskClick}
                      onTaskUpdate={loadData}
                      showCheckbox={canManageTasks(currentUser?.role)}
                      isSelected={selectedIds.includes(task.Id)}
                      onSelect={() => handleSelectTask(task.Id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Task
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Assignee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tasks.map((task) => (
<tr
                    key={task.Id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {canManageTasks(currentUser?.role) && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.Id)}
                          onChange={() => handleSelectTask(task.Id)}
                          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <StatusBadge status={task.status} type="task" size="sm" />
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <StatusBadge status={task.priority} type="priority" size="sm" />
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <span className="text-sm text-slate-900">
                        {task.assignee?.name || "Unassigned"}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <span className="text-sm text-slate-600">
                        {task.due_date || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      
      <TaskDetailModal
        isOpen={showTaskDetail}
        onClose={() => setShowTaskDetail(false)}
        task={selectedTask}
        onUpdate={loadData}
      />
    </div>
  );
};

export default TaskBoard;
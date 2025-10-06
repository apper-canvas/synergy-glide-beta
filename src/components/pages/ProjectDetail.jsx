import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import AvatarGroup from "@/components/molecules/AvatarGroup";
import ProgressBar from "@/components/atoms/ProgressBar";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/formatters";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectData, tasksData] = await Promise.all([
        projectService.getById(projectId),
        taskService.getByProject(projectId)
      ]);
      setProject(projectData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [projectId]);
  
  const handleFileUpload = async (files) => {
    toast.success(`Uploaded ${files.length} file(s) to project`);
  };
  
  if (loading) return <Loading message="Loading project..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return <Error message="Project not found" />;
  
  const tabs = [
    { id: "overview", label: "Overview", icon: "LayoutDashboard" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" },
    { id: "files", label: "Files", icon: "Folder" },
    { id: "members", label: "Members", icon: "Users" },
  ];
  
  const completedTasks = tasks.filter(t => t.status === "Done").length;
  const taskProgress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={() => navigate("/projects")}
          />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-600 mt-1">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <StatusBadge status={project.status} type="project" />
          <Button variant="outline" icon="Edit">
            Edit Project
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Progress</span>
            <span className="text-2xl font-bold text-slate-900">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} size="lg" />
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Tasks</p>
              <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedTasks}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Team</p>
              <p className="text-2xl font-bold text-slate-900">{project.members?.length || 0}</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <div className="border-b border-slate-200">
          <div className="flex gap-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ApperIcon name="Calendar" size={16} className="text-slate-400" />
                      <span className="text-slate-600">Start:</span>
                      <span className="text-slate-900 font-medium">
                        {formatDate(project.start_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ApperIcon name="Calendar" size={16} className="text-slate-400" />
                      <span className="text-slate-600">End:</span>
                      <span className="text-slate-900 font-medium">
                        {formatDate(project.end_date)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-900 mb-2">Team Members</h3>
                  <AvatarGroup users={project.members || []} max={8} size="md" />
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">Description</h3>
                <p className="text-sm text-slate-600">{project.description}</p>
              </div>
            </div>
          )}
          
          {activeTab === "tasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">
                  {tasks.length} tasks • {completedTasks} completed
                </p>
                <Button size="sm" icon="Plus">
                  Add Task
                </Button>
              </div>
              
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.Id}
                    className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all cursor-pointer"
                    onClick={() => navigate("/tasks")}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === "Done" ? "bg-green-500" :
                        task.status === "In Progress" ? "bg-blue-500" :
                        "bg-slate-300"
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-600">{task.assignee?.name || "Unassigned"}</p>
                      </div>
                    </div>
                    <StatusBadge status={task.status} type="task" size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === "files" && (
            <div className="space-y-4">
              <FileUpload
                onUpload={handleFileUpload}
                maxSize={52428800}
                multiple
              />
              <p className="text-sm text-slate-600 text-center">
                No files uploaded yet. Drag and drop files above to get started.
              </p>
            </div>
          )}
          
          {activeTab === "members" && (
            <div className="space-y-4">
              {project.members?.map((member) => (
                <div
                  key={member.Id}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                      {member.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-600">{member.job_title}</p>
                    </div>
                  </div>
                  <StatusBadge status={member.role} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProjectDetail;
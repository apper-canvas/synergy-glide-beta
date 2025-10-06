import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StatsCard from "@/components/organisms/StatsCard";
import ProjectCard from "@/components/organisms/ProjectCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, []);
  
  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <Error message={error} onRetry={loadData} />;
  
  const activeProjects = projects.filter(p => p.status === "Active");
  const myTasks = tasks.filter(t => t.assignee_id === currentUser?.Id);
  const completedTasks = myTasks.filter(t => t.status === "Done");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {currentUser?.name}</p>
        </div>
        
        <Button icon="Plus" onClick={() => navigate("/projects")}>
          New Project
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Projects"
          value={projects.length}
          icon="Briefcase"
          trend="up"
          trendValue="+12%"
          color="primary"
        />
        <StatsCard
          title="Active Projects"
          value={activeProjects.length}
          icon="TrendingUp"
          color="success"
        />
        <StatsCard
          title="My Tasks"
          value={myTasks.length}
          icon="CheckSquare"
          trend="up"
          trendValue="+3"
          color="info"
        />
        <StatsCard
          title="Completed"
          value={completedTasks.length}
          icon="CheckCircle"
          color="success"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Active Projects</h2>
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowRight"
              iconPosition="right"
              onClick={() => navigate("/projects")}
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project.Id} project={project} />
            ))}
          </div>
          
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">My Tasks</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/tasks")}
              >
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {myTasks.slice(0, 5).map((task) => (
                <div
                  key={task.Id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => navigate("/tasks")}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-2 h-2 rounded-full ${
                      task.status === "Done" ? "bg-green-500" :
                      task.status === "In Progress" ? "bg-blue-500" :
                      "bg-slate-300"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-600">
                        {task.project_id && `Project #${task.project_id}`}
                      </p>
                    </div>
                  </div>
                  <ApperIcon name="ChevronRight" size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <ActivityFeed limit={8} />
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Plus"
                onClick={() => navigate("/projects")}
              >
                Create Project
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="CheckSquare"
                onClick={() => navigate("/tasks")}
              >
                Add Task
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="Upload"
                onClick={() => navigate("/resources")}
              >
                Upload Resource
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                icon="MessageSquare"
                onClick={() => navigate("/messages")}
              >
                Send Message
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
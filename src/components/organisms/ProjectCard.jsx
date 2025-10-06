import { useNavigate } from "react-router-dom";
import Card from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import AvatarGroup from "@/components/molecules/AvatarGroup";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { formatDate } from "@/utils/formatters";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      hover 
      onClick={() => navigate(`/projects/${project.Id}`)}
      className="p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {project.name}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-2">
            {project.description}
          </p>
        </div>
        <StatusBadge status={project.status} type="project" />
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Progress</span>
            <span className="font-medium text-slate-900">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} />
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ApperIcon name="Calendar" size={16} />
            <span>{formatDate(project.end_date)}</span>
          </div>
          
          <AvatarGroup users={project.members || []} max={3} size="sm" />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
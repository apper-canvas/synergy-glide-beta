import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { formatRelativeTime } from "@/utils/formatters";
import activityService from "@/services/api/activityService";

const ActivityFeed = ({ limit = 10 }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await activityService.getRecent(limit);
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadActivities();
  }, [limit]);
  
  const getActivityIcon = (type) => {
    switch (type) {
      case "project_created": return "Plus";
      case "task_assigned": return "UserPlus";
      case "task_completed": return "CheckCircle";
      case "task_updated": return "Edit";
      case "file_uploaded": return "Upload";
      default: return "Activity";
    }
  };
  
  if (loading) return <Loading message="Loading activity..." />;
  if (error) return <Error message={error} onRetry={loadActivities} />;
  if (activities.length === 0) return <Empty icon="Activity" title="No recent activity" />;
  
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.Id} className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="relative">
                <Avatar
                  src={activity.user?.avatar_url}
                  name={activity.user?.name}
                  size="sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                  <ApperIcon 
                    name={getActivityIcon(activity.activity_type)} 
                    size={12} 
                    className="text-primary-600" 
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900">
                <span className="font-medium">{activity.user?.name}</span>
                {" "}
                <span className="text-slate-600">{activity.description}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatRelativeTime(activity.created_at)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;
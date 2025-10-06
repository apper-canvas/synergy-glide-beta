import activitiesData from "@/services/mockData/activities.json";
import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const activityService = {
  getAll: async () => {
    await delay(250);
    return activitiesData
      .map(activity => ({
        ...activity,
        user: usersData.find(u => u.Id === activity.user_id)
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  getRecent: async (limit = 10) => {
    await delay(200);
    return activitiesData
      .map(activity => ({
        ...activity,
        user: usersData.find(u => u.Id === activity.user_id)
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
  },
  
  getByUser: async (userId) => {
    await delay(250);
    return activitiesData
      .filter(a => a.user_id === parseInt(userId))
      .map(activity => ({
        ...activity,
        user: usersData.find(u => u.Id === activity.user_id)
      }))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },
  
  create: async (activityData) => {
    await delay(200);
    const maxId = Math.max(...activitiesData.map(a => a.Id), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      created_at: new Date().toISOString()
    };
    activitiesData.unshift(newActivity);
    return {
      ...newActivity,
      user: usersData.find(u => u.Id === newActivity.user_id)
    };
  }
};

export default activityService;
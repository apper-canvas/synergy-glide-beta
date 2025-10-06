import tasksData from "@/services/mockData/tasks.json";
import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  getAll: async () => {
    await delay(300);
    return tasksData.map(task => ({
      ...task,
      assignee: usersData.find(u => u.Id === task.assignee_id),
      creator: usersData.find(u => u.Id === task.created_by)
    }));
  },
  
  getById: async (id) => {
    await delay(200);
    const task = tasksData.find(t => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return {
      ...task,
      assignee: usersData.find(u => u.Id === task.assignee_id),
      creator: usersData.find(u => u.Id === task.created_by)
    };
  },
  
  getByProject: async (projectId) => {
    await delay(300);
    return tasksData
      .filter(t => t.project_id === parseInt(projectId))
      .map(task => ({
        ...task,
        assignee: usersData.find(u => u.Id === task.assignee_id),
        creator: usersData.find(u => u.Id === task.created_by)
      }));
  },
  
  create: async (taskData) => {
    await delay(400);
    const maxId = Math.max(...tasksData.map(t => t.Id), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tasksData.push(newTask);
    return {
      ...newTask,
      assignee: usersData.find(u => u.Id === newTask.assignee_id),
      creator: usersData.find(u => u.Id === newTask.created_by)
    };
  },
  
  update: async (id, taskData) => {
    await delay(350);
    const index = tasksData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasksData[index] = {
      ...tasksData[index],
      ...taskData,
      updated_at: new Date().toISOString()
    };
    return {
      ...tasksData[index],
      assignee: usersData.find(u => u.Id === tasksData[index].assignee_id),
      creator: usersData.find(u => u.Id === tasksData[index].created_by)
    };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = tasksData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    const deleted = tasksData.splice(index, 1)[0];
    return { ...deleted };
  },
  
  updateStatus: async (id, status) => {
    await delay(250);
    const index = tasksData.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasksData[index].status = status;
    tasksData[index].updated_at = new Date().toISOString();
    return {
      ...tasksData[index],
      assignee: usersData.find(u => u.Id === tasksData[index].assignee_id),
      creator: usersData.find(u => u.Id === tasksData[index].created_by)
    };
  }
};

export default taskService;
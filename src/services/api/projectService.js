import projectsData from "@/services/mockData/projects.json";
import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const projectService = {
  getAll: async () => {
    await delay(350);
    return projectsData.map(project => ({
      ...project,
      members: usersData.filter(user => project.members.includes(user.Id))
    }));
  },
  
  getById: async (id) => {
    await delay(250);
    const project = projectsData.find(p => p.Id === parseInt(id));
    if (!project) throw new Error("Project not found");
    return {
      ...project,
      members: usersData.filter(user => project.members.includes(user.Id))
    };
  },
  
  create: async (projectData) => {
    await delay(450);
    const maxId = Math.max(...projectsData.map(p => p.Id), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    projectsData.push(newProject);
    return {
      ...newProject,
      members: usersData.filter(user => newProject.members?.includes(user.Id))
    };
  },
  
  update: async (id, projectData) => {
    await delay(400);
    const index = projectsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    projectsData[index] = {
      ...projectsData[index],
      ...projectData,
      updated_at: new Date().toISOString()
    };
    return {
      ...projectsData[index],
      members: usersData.filter(user => projectsData[index].members?.includes(user.Id))
    };
  },
  
  delete: async (id) => {
    await delay(350);
    const index = projectsData.findIndex(p => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    const deleted = projectsData.splice(index, 1)[0];
    return { ...deleted };
  },
  
  getByStatus: async (status) => {
    await delay(300);
    return projectsData
      .filter(p => p.status === status)
      .map(project => ({
        ...project,
        members: usersData.filter(user => project.members.includes(user.Id))
      }));
  }
};

export default projectService;
import resourcesData from "@/services/mockData/companyResources.json";
import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const resourceService = {
  getAll: async () => {
    await delay(300);
    return resourcesData.map(resource => ({
      ...resource,
      uploader: usersData.find(u => u.Id === resource.uploaded_by)
    }));
  },
  
  getById: async (id) => {
    await delay(200);
    const resource = resourcesData.find(r => r.Id === parseInt(id));
    if (!resource) throw new Error("Resource not found");
    return {
      ...resource,
      uploader: usersData.find(u => u.Id === resource.uploaded_by)
    };
  },
  
  getByCategory: async (category) => {
    await delay(250);
    return resourcesData
      .filter(r => r.category === category)
      .map(resource => ({
        ...resource,
        uploader: usersData.find(u => u.Id === resource.uploaded_by)
      }));
  },
  
  create: async (resourceData) => {
    await delay(500);
    const maxId = Math.max(...resourcesData.map(r => r.Id), 0);
    const newResource = {
      Id: maxId + 1,
      ...resourceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    resourcesData.push(newResource);
    return {
      ...newResource,
      uploader: usersData.find(u => u.Id === newResource.uploaded_by)
    };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = resourcesData.findIndex(r => r.Id === parseInt(id));
    if (index === -1) throw new Error("Resource not found");
    const deleted = resourcesData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default resourceService;
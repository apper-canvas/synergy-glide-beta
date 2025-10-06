import usersData from "@/services/mockData/users.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const userService = {
  getAll: async () => {
    await delay(300);
    return [...usersData];
  },
  
  getById: async (id) => {
    await delay(200);
    const user = usersData.find(u => u.Id === parseInt(id));
    if (!user) throw new Error("User not found");
    return { ...user };
  },
  
  create: async (userData) => {
    await delay(400);
    const maxId = Math.max(...usersData.map(u => u.Id), 0);
    const newUser = {
      Id: maxId + 1,
      ...userData,
      created_at: new Date().toISOString(),
      last_login: null
    };
    usersData.push(newUser);
    return { ...newUser };
  },
  
  update: async (id, userData) => {
    await delay(400);
    const index = usersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    usersData[index] = { ...usersData[index], ...userData };
    return { ...usersData[index] };
  },
  
  delete: async (id) => {
    await delay(300);
    const index = usersData.findIndex(u => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    const deleted = usersData.splice(index, 1)[0];
    return { ...deleted };
  }
};

export default userService;
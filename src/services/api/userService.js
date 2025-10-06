import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const userService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "avatar_url_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "last_login_c"}}
        ]
      };
      
      const response = await apperClient.fetchRecords('user_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error?.response?.data?.message || error);
      toast.error("Failed to fetch users");
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "avatar_url_c"}},
          {"field": {"Name": "job_title_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "last_login_c"}}
        ]
      };
      
      const response = await apperClient.getRecordById('user_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch user");
      return null;
    }
  },
  
  create: async (userData) => {
    try {
      const params = {
        records: [{
          name_c: userData.name_c,
          email_c: userData.email_c,
          role_c: userData.role_c,
          avatar_url_c: userData.avatar_url_c,
          job_title_c: userData.job_title_c,
          department_c: userData.department_c,
          last_login_c: userData.last_login_c
        }]
      };
      
      const response = await apperClient.createRecord('user_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create user:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating user:", error?.response?.data?.message || error);
      toast.error("Failed to create user");
      return null;
    }
  },
  
  update: async (id, userData) => {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: userData.name_c,
          email_c: userData.email_c,
          role_c: userData.role_c,
          avatar_url_c: userData.avatar_url_c,
          job_title_c: userData.job_title_c,
          department_c: userData.department_c,
          last_login_c: userData.last_login_c
        }]
      };
      
      const response = await apperClient.updateRecord('user_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update user:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating user:", error?.response?.data?.message || error);
      toast.error("Failed to update user");
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('user_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete user:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting user:", error?.response?.data?.message || error);
      toast.error("Failed to delete user");
      return false;
    }
  }
};

export default userService;
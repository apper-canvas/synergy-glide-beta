import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "project_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "assignee_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "project_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "assignee_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('task_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch task");
      return null;
    }
  },
  
  getByProject: async (projectId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "project_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "assignee_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{"FieldName": "project_id_c", "Operator": "EqualTo", "Values": [parseInt(projectId)]}]
      };
      
      const response = await apperClient.fetchRecords('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching project tasks:", error?.response?.data?.message || error);
      toast.error("Failed to fetch project tasks");
      return [];
    }
  },
  
  create: async (taskData) => {
    try {
      const params = {
        records: [{
          title_c: taskData.title_c,
          description_c: taskData.description_c,
          project_id_c: parseInt(taskData.project_id_c),
          assignee_id_c: parseInt(taskData.assignee_id_c),
          priority_c: taskData.priority_c,
          status_c: taskData.status_c,
          due_date_c: taskData.due_date_c,
          created_by_c: parseInt(taskData.created_by_c),
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      toast.error("Failed to create task");
      return null;
    }
  },
  
  update: async (id, taskData) => {
    try {
      const updatePayload = {
        Id: parseInt(id)
      };
      
      if (taskData.title_c !== undefined) updatePayload.title_c = taskData.title_c;
      if (taskData.description_c !== undefined) updatePayload.description_c = taskData.description_c;
      if (taskData.project_id_c !== undefined) updatePayload.project_id_c = parseInt(taskData.project_id_c);
      if (taskData.assignee_id_c !== undefined) updatePayload.assignee_id_c = parseInt(taskData.assignee_id_c);
      if (taskData.priority_c !== undefined) updatePayload.priority_c = taskData.priority_c;
      if (taskData.status_c !== undefined) updatePayload.status_c = taskData.status_c;
      if (taskData.due_date_c !== undefined) updatePayload.due_date_c = taskData.due_date_c;
      updatePayload.updated_at_c = new Date().toISOString();
      
      const params = {
        records: [updatePayload]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      toast.error("Failed to update task");
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      toast.error("Failed to delete task");
      return false;
    }
  },
  
  updateStatus: async (id, status) => {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          status_c: status,
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('task_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update task status:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating task status:", error?.response?.data?.message || error);
      toast.error("Failed to update task status");
      return null;
    }
  }
};

export default taskService;
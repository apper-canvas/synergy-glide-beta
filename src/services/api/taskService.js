import { toast } from "react-toastify";
import React from "react";

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

  deleteAll: async () => {
    try {
      // First, fetch all task IDs
      const fetchParams = {
        fields: [{"field": {"Name": "Id"}}]
      };
      
      const fetchResponse = await apperClient.fetchRecords('task_c', fetchParams);
      
      if (!fetchResponse.success) {
        console.error(fetchResponse.message);
        toast.error(fetchResponse.message);
        return false;
      }
      
      const recordIds = (fetchResponse.data || []).map(record => record.Id);
      
      if (recordIds.length === 0) {
        toast.info("No tasks to delete");
        return true;
      }
      
      // Delete all records
      const deleteParams = {
        RecordIds: recordIds
      };
      
      const response = await apperClient.deleteRecord('task_c', deleteParams);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Successfully deleted ${successful.length} task(s)`);
        }
        
        return failed.length === 0;
      }
    } catch (error) {
      console.error("Error deleting all tasks:", error?.response?.data?.message || error);
      toast.error("Failed to delete all tasks");
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
  },

  importTasks: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const parseResponse = await apperClient.functions.invoke(
        import.meta.env.VITE_PARSE_TASK_CSV,
        {
          body: formData,
          headers: {}
        }
      );

      if (!parseResponse.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_PARSE_TASK_CSV}. The response body is: ${JSON.stringify(parseResponse)}.`);
        return {
          success: false,
          message: parseResponse.message || 'Failed to parse CSV file',
          created: 0,
          failed: 0,
          invalidRows: 0
        };
      }

      const { data } = parseResponse;
      const validTasks = data.results.filter(r => r.valid).map(r => r.data);
      const invalidRows = data.invalidRows;

      if (validTasks.length === 0) {
        return {
          success: false,
          message: 'No valid tasks found in CSV file',
          created: 0,
          failed: 0,
          invalidRows: invalidRows,
          details: data.results.filter(r => !r.valid).map(r => ({
            row: r.rowNumber,
            errors: r.errors
          }))
        };
      }

      const records = validTasks.map(task => {
        const record = {
          title_c: task.title_c,
          description_c: task.description_c,
          priority_c: task.priority_c,
          status_c: task.status_c
        };

        if (task.due_date_c) {
          record.due_date_c = task.due_date_c;
        }
        if (task.project_id_c) {
          record.project_id_c = task.project_id_c;
        }
        if (task.assignee_id_c) {
          record.assignee_id_c = task.assignee_id_c;
        }
        if (task.Tags) {
          record.Tags = task.Tags;
        }

        return record;
      });

      const response = await apperClient.createRecord('task_c', {
        records: records
      });

      if (!response.success) {
        console.error(response.message);
        return {
          success: false,
          message: response.message,
          created: 0,
          failed: validTasks.length,
          invalidRows: invalidRows
        };
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks: ${JSON.stringify(failed)}`);
        }

        return {
          success: successful.length > 0,
          created: successful.length,
          failed: failed.length,
          invalidRows: invalidRows,
          message: successful.length > 0 
            ? `Successfully imported ${successful.length} task(s)` 
            : 'Failed to import tasks',
          details: failed.map(f => ({
            errors: f.errors || [],
            message: f.message
          }))
        };
      }

      return {
        success: false,
        message: 'Unexpected response format',
        created: 0,
        failed: validTasks.length,
        invalidRows: invalidRows
      };

    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_PARSE_TASK_CSV}. The error is: ${error.message}`);
      return {
        success: false,
        message: error.message || 'Failed to import tasks',
        created: 0,
        failed: 0,
        invalidRows: 0
};
    }
  }
};

export default taskService;
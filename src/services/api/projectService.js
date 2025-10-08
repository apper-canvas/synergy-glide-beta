import { toast } from "react-toastify";
import React from "react";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const projectService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "members_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error?.response?.data?.message || error);
      toast.error("Failed to fetch projects");
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "members_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('project_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch project");
      return null;
    }
  },
  
  create: async (projectData) => {
    try {
      const params = {
        records: [{
          name_c: projectData.name_c,
          description_c: projectData.description_c,
          status_c: projectData.status_c,
          start_date_c: projectData.start_date_c,
          end_date_c: projectData.end_date_c,
          progress_c: 0,
          members_c: Array.isArray(projectData.members_c) ? projectData.members_c.join(',') : projectData.members_c || '',
          created_by_c: parseInt(projectData.created_by_c),
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create project:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating project:", error?.response?.data?.message || error);
      toast.error("Failed to create project");
      return null;
    }
  },
  
  update: async (id, projectData) => {
    try {
      const updatePayload = {
        Id: parseInt(id)
      };
      
      if (projectData.name_c !== undefined) updatePayload.name_c = projectData.name_c;
      if (projectData.description_c !== undefined) updatePayload.description_c = projectData.description_c;
      if (projectData.status_c !== undefined) updatePayload.status_c = projectData.status_c;
      if (projectData.start_date_c !== undefined) updatePayload.start_date_c = projectData.start_date_c;
      if (projectData.end_date_c !== undefined) updatePayload.end_date_c = projectData.end_date_c;
      if (projectData.progress_c !== undefined) updatePayload.progress_c = projectData.progress_c;
      if (projectData.members_c !== undefined) {
        updatePayload.members_c = Array.isArray(projectData.members_c) ? projectData.members_c.join(',') : projectData.members_c;
      }
      updatePayload.updated_at_c = new Date().toISOString();
      
      const params = {
        records: [updatePayload]
      };
      
      const response = await apperClient.updateRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update project:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error updating project:", error?.response?.data?.message || error);
      toast.error("Failed to update project");
      return null;
    }
  },
  
delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete project:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting project:", error?.response?.data?.message || error);
      toast.error("Failed to delete project");
      return false;
    }
  },

  deleteAll: async () => {
    try {
      // First, fetch all project IDs
      const fetchParams = {
        fields: [{"field": {"Name": "Id"}}]
      };
      
      const fetchResponse = await apperClient.fetchRecords('project_c', fetchParams);
      
      if (!fetchResponse.success) {
        console.error(fetchResponse.message);
        toast.error(fetchResponse.message);
        return false;
      }
      
      const recordIds = (fetchResponse.data || []).map(record => record.Id);
      
      if (recordIds.length === 0) {
        toast.info("No projects to delete");
        return true;
      }
      
      // Delete all records
      const deleteParams = {
        RecordIds: recordIds
      };
      
      const response = await apperClient.deleteRecord('project_c', deleteParams);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Successfully deleted ${successful.length} project(s)`);
        }
        
        return failed.length === 0;
      }
    } catch (error) {
      console.error("Error deleting all projects:", error?.response?.data?.message || error);
      toast.error("Failed to delete all projects");
return false;
    }
  },
  
  getByStatus: async (status) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "start_date_c"}},
          {"field": {"Name": "end_date_c"}},
          {"field": {"Name": "progress_c"}},
          {"field": {"Name": "members_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "created_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };
      
      const response = await apperClient.fetchRecords('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects by status:", error?.response?.data?.message || error);
      toast.error("Failed to fetch projects");
      return [];
    }
},

  importFromExcel: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const { ApperClient } = window.ApperSDK;
      const client = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const result = await client.functions.invoke(
        import.meta.env.VITE_PARSE_PROJECT_EXCEL,
        {
          body: formData,
          headers: {}
        }
      );
      
      if (!result.success) {
        console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_PARSE_PROJECT_EXCEL}. The response body is: ${JSON.stringify(result)}.`);
        toast.error(result.message || 'Failed to parse Excel file');
        return null;
      }
      
      return result.data;
    } catch (error) {
      console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_PARSE_PROJECT_EXCEL}. The error is: ${error.message}`);
      toast.error('Failed to parse Excel file');
      return null;
    }
  },

  bulkCreate: async (projects, currentUserId) => {
    try {
      const records = projects.map(project => ({
        name_c: project.name_c,
        description_c: project.description_c || '',
        status_c: project.status_c || 'Planning',
        start_date_c: project.start_date_c || null,
        end_date_c: project.end_date_c || null,
        progress_c: 0,
        members_c: project.members_c || '',
        created_by_c: parseInt(currentUserId),
        created_at_c: new Date().toISOString(),
        updated_at_c: new Date().toISOString()
      }));
      
      const params = { records };
      
      const response = await apperClient.createRecord('project_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return { success: false, created: 0, failed: records.length };
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} projects:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Successfully created ${successful.length} project(s)`);
        }
        
        return {
          success: true,
          created: successful.length,
          failed: failed.length,
          failedRecords: failed
        };
      }
      
      return { success: false, created: 0, failed: records.length };
    } catch (error) {
      console.error("Error bulk creating projects:", error?.response?.data?.message || error);
      toast.error("Failed to create projects");
      return { success: false, created: 0, failed: projects.length };
    }
  }
};

export default projectService;

export default projectService;
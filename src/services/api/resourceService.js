import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const resourceService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "uploaded_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.fetchRecords('company_resource_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching resources:", error?.response?.data?.message || error);
      toast.error("Failed to fetch resources");
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "uploaded_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ]
      };
      
      const response = await apperClient.getRecordById('company_resource_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching resource ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch resource");
      return null;
    }
  },
  
  getByCategory: async (category) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "file_type_c"}},
          {"field": {"Name": "file_size_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}},
          {"field": {"name": "uploaded_by_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}]
      };
      
      const response = await apperClient.fetchRecords('company_resource_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching resources by category:", error?.response?.data?.message || error);
      toast.error("Failed to fetch resources");
      return [];
    }
  },
  
  create: async (resourceData) => {
    try {
      const params = {
        records: [{
          title_c: resourceData.title_c,
          category_c: resourceData.category_c,
          file_type_c: resourceData.file_type_c,
          file_size_c: resourceData.file_size_c,
          description_c: resourceData.description_c,
          uploaded_by_c: parseInt(resourceData.uploaded_by_c),
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('company_resource_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create resource:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating resource:", error?.response?.data?.message || error);
      toast.error("Failed to create resource");
      return null;
    }
  },
  
  delete: async (id) => {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('company_resource_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete resource:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting resource:", error?.response?.data?.message || error);
      toast.error("Failed to delete resource");
      return false;
    }
  }
};

export default resourceService;
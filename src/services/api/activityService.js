import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const activityService = {
  getAll: async () => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "activity_type_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "user_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error);
      toast.error("Failed to fetch activities");
      return [];
    }
  },
  
  getRecent: async (limit = 10) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "activity_type_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "user_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent activities:", error?.response?.data?.message || error);
      toast.error("Failed to fetch recent activities");
      return [];
    }
  },
  
  getByUser: async (userId) => {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "activity_type_c"}},
          {"field": {"Name": "entity_type_c"}},
          {"field": {"Name": "entity_id_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"name": "user_id_c"}, "referenceField": {"field": {"Name": "name_c"}}}
        ],
        where: [{"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching user activities:", error?.response?.data?.message || error);
      toast.error("Failed to fetch user activities");
      return [];
    }
  },
  
create: async (activityData) => {
    try {
      const params = {
        records: [{
          user_id_c: parseInt(activityData.user_id_c),
          activity_type_c: activityData.activity_type_c,
          entity_type_c: activityData.entity_type_c,
          entity_id_c: activityData.entity_id_c,
          description_c: activityData.description_c,
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('activity_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        return response.results[0].data;
      }
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error);
      toast.error("Failed to create activity");
      return null;
    }
  },

  deleteAll: async () => {
    try {
      // First, fetch all activity IDs
      const fetchParams = {
        fields: [{"field": {"Name": "Id"}}]
      };
      
      const fetchResponse = await apperClient.fetchRecords('activity_c', fetchParams);
      
      if (!fetchResponse.success) {
        console.error(fetchResponse.message);
        toast.error(fetchResponse.message);
        return false;
      }
      
      const recordIds = (fetchResponse.data || []).map(record => record.Id);
      
      if (recordIds.length === 0) {
        toast.info("No activities to delete");
        return true;
      }
      
      // Delete all records
      const deleteParams = {
        RecordIds: recordIds
      };
      
      const response = await apperClient.deleteRecord('activity_c', deleteParams);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} activities:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          toast.success(`Successfully deleted ${successful.length} activity/activities`);
        }
        
        return failed.length === 0;
      }
    } catch (error) {
      console.error("Error deleting all activities:", error?.response?.data?.message || error);
      toast.error("Failed to delete all activities");
      return false;
    }
  }
};

export default activityService;
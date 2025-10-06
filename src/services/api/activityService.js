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
  }
};

export default activityService;
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import RoleBadge from "@/components/molecules/RoleBadge";
import Avatar from "@/components/atoms/Avatar";
import FileUpload from "@/components/molecules/FileUpload";
import ApperIcon from "@/components/ApperIcon";

const Profile = () => {
  const { currentUser } = useSelector(state => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    job_title: currentUser?.job_title || "",
    department: currentUser?.department || "",
  });
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarUpload = async (files) => {
    toast.success("Avatar updated successfully");
  };
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account information</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar
              src={currentUser?.avatar_url}
              name={currentUser?.name}
              size="2xl"
            />
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {currentUser?.name}
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {currentUser?.job_title}
              </p>
              <div className="flex justify-center mt-2">
                <RoleBadge role={currentUser?.role} />
              </div>
            </div>
            
            <div className="w-full pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="Mail" size={16} />
                <span>{currentUser?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="Building" size={16} />
                <span>{currentUser?.department}</span>
              </div>
            </div>
            
            <FileUpload
              onUpload={handleAvatarUpload}
              maxSize={5242880}
              acceptedTypes="image/*"
            />
          </div>
        </Card>
        
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Personal Information
            </h2>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                icon="Edit"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>
          
          <form onSubmit={handleSave} className="space-y-4">
            <FormField
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={!isEditing}
              required
            />
            
            <FormField
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
              required
            />
            
            <FormField
              label="Job Title"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              disabled={!isEditing}
            />
            
            <FormField
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              disabled={!isEditing}
            />
            
            {isEditing && (
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={saving}>
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </Card>
      </div>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Account Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Password</p>
              <p className="text-sm text-slate-600">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm">
              Enable 2FA
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import RoleBadge from "@/components/molecules/RoleBadge";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { formatDateTime } from "@/utils/formatters";
import userService from "@/services/api/userService";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUsers();
  }, []);
  
  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);
  
  const tabs = [
    { id: "users", label: "User Management", icon: "Users" },
    { id: "settings", label: "System Settings", icon: "Settings" },
    { id: "import", label: "Data Import", icon: "Upload" },
  ];
  
  if (loading) return <Loading message="Loading admin panel..." />;
  if (error) return <Error message={error} onRetry={loadUsers} />;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-slate-600 mt-1">Manage users and system settings</p>
        </div>
        
        <Button icon="Download">
          Export Data
        </Button>
      </div>
      
      <Card>
        <div className="border-b border-slate-200">
          <div className="flex gap-6 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === "users" && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <SearchBar
                placeholder="Search users..."
                onSearch={setSearchQuery}
                className="flex-1 max-w-md"
              />
              <Button icon="UserPlus">
                Add User
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.Id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={user.avatar_url}
                            name={user.name}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-slate-600">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role} size="sm" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-900">
                          {user.department || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">
                          {user.last_login ? formatDateTime(user.last_login) : "Never"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" icon="Edit" />
                          <Button variant="ghost" size="sm" icon="Trash2" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === "settings" && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                File Upload Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Maximum Profile Image Size
                    </p>
                    <p className="text-sm text-slate-600">5 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Maximum Project File Size
                    </p>
                    <p className="text-sm text-slate-600">50 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Maximum Company Resource Size
                    </p>
                    <p className="text-sm text-slate-600">100 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                System Announcements
              </h3>
              <div className="space-y-3">
                <Button icon="Plus" className="w-full sm:w-auto">
                  Create Announcement
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "import" && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Bulk Data Import
              </h3>
              <p className="text-sm text-slate-600 mb-4">
                Import projects, tasks, or users from CSV/XLSX files
              </p>
              
              <div className="space-y-4">
                <Card className="p-6 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <ApperIcon name="Briefcase" size={24} className="text-primary-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Import Projects
                        </h4>
                        <p className="text-sm text-slate-600">
                          Upload CSV/XLSX with project data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon="Upload">
                      Choose File
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-6 hover:border-primary-300 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ApperIcon name="CheckSquare" size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">
                          Import Tasks
                        </h4>
                        <p className="text-sm text-slate-600">
                          Upload CSV/XLSX with task data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" icon="Upload">
                      Choose File
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminPanel;
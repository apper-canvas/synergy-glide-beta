import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import RoleBadge from "@/components/molecules/RoleBadge";
import FileUpload from "@/components/molecules/FileUpload";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Profile from "@/components/pages/Profile";
import Login from "@/components/pages/Login";
import Select from "@/components/atoms/Select";
import Avatar from "@/components/atoms/Avatar";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { formatDateTime } from "@/utils/formatters";
import { canImportProjects, canImportTasks } from "@/utils/permissions";
import taskService from "@/services/api/taskService";
import userService from "@/services/api/userService";
import projectService from "@/services/api/projectService";
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('project');
  const { user } = useSelector((state) => state.user);
  const [currentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
      return null;
    }
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAll();
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load users');
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
        u?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u?.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL users? This action cannot be undone and may affect system functionality.")) {
      return;
    }
    
    setDeleting(true);
    try {
      const success = await userService.deleteAll();
      if (success) {
        setSelectedIds([]);
        await loadUsers();
      }
    } catch (err) {
      console.error('Failed to delete all users:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected user(s)? This action cannot be undone.`)) {
      return;
    }
    
    setDeleting(true);
    let allSucceeded = true;
    
    try {
      for (const id of selectedIds) {
        const success = await userService.delete(id);
        if (!success) allSucceeded = false;
      }
      
      if (allSucceeded) {
        setSelectedIds([]);
        await loadUsers();
      }
    } catch (err) {
      console.error('Failed to delete selected users:', err);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredUsers.map(u => u?.Id).filter(Boolean));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectUser = (id) => {
    if (!id) return;
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(uid => uid !== id) : [...prev, id]
    );
  };
  
const handleImportClick = (type) => {
    setImportType(type);
    setImportModalOpen(true);
    setImportResults(null);
    setSelectedFile(null);
  };

  const handleFileSelect = async (files) => {
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) return;
    
    setImporting(true);
    try {
      const parseResult = await projectService.importFromExcel(selectedFile);
      
      if (!parseResult) {
        setImporting(false);
        return;
      }
      
      const validProjects = parseResult.results
        .filter(r => r.valid)
        .map(r => r.data);
      
      if (validProjects.length === 0) {
        setImportResults({
          success: false,
          message: 'No valid projects found in file',
          validRows: 0,
          invalidRows: parseResult.invalidRows,
          created: 0,
          failed: 0
        });
        setImporting(false);
        return;
      }
      
      const bulkResult = await projectService.bulkCreate(validProjects, user?.userId);
      
      setImportResults({
        success: bulkResult.success,
        validRows: parseResult.validRows,
        invalidRows: parseResult.invalidRows,
        created: bulkResult.created,
        failed: bulkResult.failed
      });
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

const downloadTemplate = () => {
    let template, filename;
    
    if (importType === 'project') {
      template = [
        ['Project Name', 'Description', 'Status', 'Start Date', 'End Date', 'Members'],
        ['Website Redesign', 'Complete redesign of company website', 'Active', '2024-01-15', '2024-06-30', '1,2,3']
      ];
      filename = 'project-import-template.csv';
    } else {
      template = [
        ['Task Title', 'Description', 'Priority', 'Status', 'Due Date', 'Project ID', 'Assignee ID', 'Tags'],
        ['Implement user authentication', 'Add login and signup functionality', 'High', 'To Do', '2024-12-31', '1', '5', 'backend,security']
      ];
      filename = 'task-import-template.csv';
    }
    
    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
const handleImportConfirm = async () => {
    if (!selectedFile) return;
    
    setImporting(true);
    try {
      let result;
      if (importType === 'project') {
        result = await projectService.importProjects(selectedFile);
      } else {
        result = await taskService.importTasks(selectedFile);
      }
      setImportResults(result);
    } catch (error) {
      console.error('Import error:', error);
      setImportResults({
        success: false,
        message: error.message || 'Import failed',
        created: 0,
        failed: 0,
        invalidRows: 0
      });
    } finally {
      setImporting(false);
    }
  };

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
        <div className="flex items-center gap-3">
          {currentUser?.role === "Administrator" && users.length > 0 && (
            <>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                Select All
              </label>
              {selectedIds.length > 0 && (
                <Button
                  variant="danger"
                  onClick={handleDeleteSelected}
                  disabled={deleting}
                  icon="Trash2"
                >
                  {deleting ? "Deleting..." : `Delete Selected (${selectedIds.length})`}
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleDeleteAll}
                disabled={deleting}
                icon="Trash2"
              >
                {deleting ? "Deleting All..." : "Delete All Users"}
              </Button>
            </>
)}
{activeTab === "import" && (canImportProjects(user?.role) || canImportTasks(user?.role)) && (
            <Button icon="Download" variant="outline" onClick={downloadTemplate}>
              Download Template
            </Button>
          )}
          <Button icon="Download">
            Export Data
          </Button>
        </div>
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
                    {currentUser?.role === "Administrator" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase">
                        Select
                      </th>
                    )}
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
                      {currentUser?.role === "Administrator" && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(user.Id)}
                            onChange={() => handleSelectUser(user.Id)}
                            className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                      )}
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
                {canImportProjects(user?.role) ? (
                  <Card 
                    className="p-6 hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => handleImportClick('project')}
                  >
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
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <ApperIcon name="Lock" size={24} className="text-slate-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-600">
                            Import Projects
                          </h4>
                          <p className="text-sm text-slate-500">
                            Requires Administrator or Project Manager role
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {canImportTasks(user?.role) ? (
                  <Card 
                    className="p-6 hover:border-primary-300 transition-colors cursor-pointer"
                    onClick={() => handleImportClick('task')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <ApperIcon name="CheckSquare" size={24} className="text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">
                            Import Tasks
                          </h4>
                          <p className="text-sm text-slate-600">
                            Upload CSV with task data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" icon="Upload">
                        Choose File
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-6 bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center">
                          <ApperIcon name="Lock" size={24} className="text-slate-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-600">
                            Import Tasks
                          </h4>
                          <p className="text-sm text-slate-500">
                            Requires Administrator or Project Manager role
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
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
        
        <Modal
          isOpen={importModalOpen}
          onClose={() => {
            if (!importing) {
              setImportModalOpen(false);
              setImportResults(null);
              setSelectedFile(null);
            }
          }}
title={importType === 'project' ? 'Import Projects' : 'Import Tasks'}
          size="lg"
        >
          {!importResults ? (
<div className="space-y-6">
              <div className="text-sm text-slate-600">
                <p className="mb-2">Upload a CSV file with the following columns:</p>
                {importType === 'project' ? (
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Project Name</strong> (required)</li>
                    <li><strong>Description</strong></li>
                    <li><strong>Status</strong> (Planning, Active, On Hold, or Completed)</li>
                    <li><strong>Start Date</strong> (YYYY-MM-DD format)</li>
                    <li><strong>End Date</strong> (YYYY-MM-DD format)</li>
                    <li><strong>Members</strong> (comma-separated user IDs, e.g., 1,2,3)</li>
                  </ul>
                ) : (
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Task Title</strong> (required)</li>
                    <li><strong>Description</strong></li>
                    <li><strong>Priority</strong> (Critical, High, Medium, or Low)</li>
                    <li><strong>Status</strong> (To Do, In Progress, Review, or Done)</li>
                    <li><strong>Due Date</strong> (YYYY-MM-DD format)</li>
                    <li><strong>Project ID</strong> (numeric ID of the project)</li>
                    <li><strong>Assignee ID</strong> (numeric ID of the user)</li>
                    <li><strong>Tags</strong> (comma-separated tags, e.g., backend,urgent)</li>
                  </ul>
                )}
              </div>
              
              <FileUpload
                onUpload={handleFileSelect}
                acceptedTypes=".xlsx,.xls,.csv"
                maxSize={5242880}
              />
              
              {selectedFile && (
                <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <ApperIcon name="FileText" size={20} className="text-primary-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setImportModalOpen(false);
                    setSelectedFile(null);
                  }}
                  disabled={importing}
                >
                  Cancel
                </Button>
                <Button
onClick={handleImportConfirm}
                  disabled={!selectedFile || importing}
                  icon={importing ? undefined : "Upload"}
                >
                  {importing ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Importing...
                    </div>
                  ) : (
                    importType === 'project' ? 'Import Projects' : 'Import Tasks'
                  )}
                </Button>
              </div>
</div>
          ) : (
            <div className="space-y-4">
              {importResults.success && importResults.created > 0 ? (
                <Empty
                  icon="CheckCircle"
                  title="Import Successful"
                  message={`Successfully imported ${importResults.created} ${importType === 'project' ? 'project' : 'task'}(s). ${importResults.invalidRows > 0 ? `${importResults.invalidRows} row(s) were skipped due to validation errors.` : ''}`}
                >
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImportModalOpen(false);
                        setImportResults(null);
                        setSelectedFile(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setImportResults(null);
                        setSelectedFile(null);
                      }}
                      icon="Upload"
                    >
                      Import More
                    </Button>
                  </div>
                </Empty>
              ) : (
                <Empty
                  icon="AlertCircle"
                  title="Import Failed"
                  message={importResults.message || `Failed to import ${importType === 'project' ? 'projects' : 'tasks'}. ${importResults.invalidRows || 0} row(s) had validation errors.`}
                >
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setImportModalOpen(false);
                        setImportResults(null);
                        setSelectedFile(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setImportResults(null);
                        setSelectedFile(null);
                      }}
                      icon="Upload"
                    >
                      Try Again
                    </Button>
                  </div>
                </Empty>
              )}
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default AdminPanel;
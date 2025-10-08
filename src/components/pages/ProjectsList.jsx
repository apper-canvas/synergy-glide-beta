import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import ProjectCard from "@/components/organisms/ProjectCard";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { canManageProjects } from "@/utils/permissions";
import projectService from "@/services/api/projectService";
const ProjectsList = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.user);
const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Planning",
    start_date: "",
    end_date: "",
    members: []
  });
  
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  useEffect(() => {
    let filtered = projects;
    
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    setFilteredProjects(filtered);
  }, [searchQuery, statusFilter, projects]);
  
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setCreating(true);
await projectService.create({
        name_c: formData.name,
        description_c: formData.description,
        status_c: formData.status,
        start_date_c: formData.start_date,
        end_date_c: formData.end_date,
        members_c: formData.members,
        created_by_c: currentUser?.Id
      });
      toast.success("Project created successfully");
      setShowCreateModal(false);
      setFormData({
        name: "",
        description: "",
        status: "Planning",
        start_date: "",
        end_date: "",
        members: []
      });
      loadProjects();
    } catch (error) {
      toast.error("Failed to create project");
    } finally {
      setCreating(false);
    }
  };
const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL projects? This action cannot be undone.")) {
      return;
    }
    
    setDeleting(true);
    const success = await projectService.deleteAll();
    setDeleting(false);
    
    if (success) {
      setSelectedIds([]);
      await loadProjects();
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} selected project(s)? This action cannot be undone.`)) {
      return;
    }
    
    setDeleting(true);
    let allSucceeded = true;
    
    for (const id of selectedIds) {
      const success = await projectService.delete(id);
      if (!success) allSucceeded = false;
    }
    
    setDeleting(false);
    
    if (allSucceeded) {
      setSelectedIds([]);
      await loadProjects();
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map(p => p.Id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectProject = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };
  
  if (loading) return <Loading message="Loading projects..." />;
  if (error) return <Error message={error} onRetry={loadProjects} />;
  
  const canCreate = canManageProjects(currentUser?.role);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">{filteredProjects.length} projects found</p>
        </div>
        
{canCreate && (
          <Button icon="Plus" onClick={() => setShowCreateModal(true)}>
            New Project
</Button>
        )}
        {canManageProjects(currentUser?.role) && projects.length > 0 && (
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={selectedIds.length === filteredProjects.length && filteredProjects.length > 0}
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
              {deleting ? "Deleting All..." : "Delete All Projects"}
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search projects..."
          onSearch={setSearchQuery}
          className="flex-1"
        />
        
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Status</option>
          <option value="Planning">Planning</option>
          <option value="Active">Active</option>
          <option value="On Hold">On Hold</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>
      
      {filteredProjects.length === 0 ? (
        <Empty
          icon="Briefcase"
          title="No projects found"
          message={canCreate ? "Get started by creating your first project." : "No projects match your search criteria."}
          actionLabel={canCreate ? "Create Project" : undefined}
          onAction={canCreate ? () => setShowCreateModal(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
{filteredProjects.map((project) => (
            <ProjectCard 
              key={project.Id} 
              project={project}
              showCheckbox={canManageProjects(currentUser?.role)}
              isSelected={selectedIds.includes(project.Id)}
              onSelect={() => handleSelectProject(project.Id)}
            />
          ))}
        </div>
      )}
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
        size="md"
      >
        <form onSubmit={handleCreateProject} className="p-6 space-y-4">
          <FormField
            label="Project Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter project name"
          />
          
          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter project description"
            rows={3}
          />
          
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              type="date"
              required
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            
            <FormField
              label="End Date"
              type="date"
              required
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={creating}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsList;
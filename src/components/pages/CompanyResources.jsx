import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize, formatDate } from "@/utils/formatters";
import { canUploadCompanyResources } from "@/utils/permissions";
import resourceService from "@/services/api/resourceService";

const CompanyResources = () => {
  const { currentUser } = useSelector(state => state.user);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Policies",
    description: "",
    file_type: "PDF",
    file_size: 0
  });
  
  const categories = ["Policies", "Templates", "Branding", "Guides", "Forms"];
  
  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await resourceService.getAll();
      setResources(data);
      setFilteredResources(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadResources();
  }, []);
  
  useEffect(() => {
    let filtered = resources;
    
    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      filtered = filtered.filter(r => r.category === categoryFilter);
    }
    
    setFilteredResources(filtered);
  }, [searchQuery, categoryFilter, resources]);
  
  const handleFileUpload = async (files) => {
    const file = files[0];
    setFormData(prev => ({
      ...prev,
      file_type: file.name.split(".").pop().toUpperCase(),
      file_size: file.size
    }));
  };
  
  const handleUploadResource = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }
    
    try {
      setUploading(true);
      await resourceService.create({
        ...formData,
        uploaded_by: currentUser?.Id
      });
      toast.success("Resource uploaded successfully");
      setShowUploadModal(false);
      setFormData({
        title: "",
        category: "Policies",
        description: "",
        file_type: "PDF",
        file_size: 0
      });
      loadResources();
    } catch (error) {
      toast.error("Failed to upload resource");
    } finally {
      setUploading(false);
    }
  };
  
  const getFileIcon = (type) => {
    const icons = {
      PDF: { icon: "FileText", color: "red" },
      DOCX: { icon: "FileText", color: "blue" },
      XLSX: { icon: "Sheet", color: "green" },
      PPTX: { icon: "Presentation", color: "orange" },
      ZIP: { icon: "FolderArchive", color: "purple" },
      default: { icon: "File", color: "slate" }
    };
    return icons[type] || icons.default;
  };
  
  if (loading) return <Loading message="Loading resources..." />;
  if (error) return <Error message={error} onRetry={loadResources} />;
  
  const canUpload = canUploadCompanyResources(currentUser?.role);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Company Resources</h1>
          <p className="text-slate-600 mt-1">{filteredResources.length} resources available</p>
        </div>
        
        {canUpload && (
          <Button icon="Upload" onClick={() => setShowUploadModal(true)}>
            Upload Resource
          </Button>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar
          placeholder="Search resources..."
          onSearch={setSearchQuery}
          className="flex-1"
        />
        
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      
      {filteredResources.length === 0 ? (
        <Empty
          icon="FolderOpen"
          title="No resources found"
          message={canUpload ? "Get started by uploading your first resource." : "No resources match your search criteria."}
          actionLabel={canUpload ? "Upload Resource" : undefined}
          onAction={canUpload ? () => setShowUploadModal(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map((resource) => {
            const { icon, color } = getFileIcon(resource.file_type);
            return (
              <Card key={resource.Id} hover className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-lg bg-${color}-100 flex items-center justify-center mb-4`}>
                    <ApperIcon name={icon} size={32} className={`text-${color}-600`} />
                  </div>
                  
                  <h3 className="text-sm font-semibold text-slate-900 mb-1 line-clamp-2">
                    {resource.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                    {resource.description || "No description"}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>{resource.file_type}</span>
                    <span>•</span>
                    <span>{formatFileSize(resource.file_size)}</span>
                  </div>
                  
                  <Button size="sm" variant="outline" icon="Download" className="w-full">
                    Download
                  </Button>
                  
                  <p className="text-xs text-slate-500 mt-3">
                    Uploaded {formatDate(resource.created_at)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Company Resource"
        size="md"
      >
        <form onSubmit={handleUploadResource} className="p-6 space-y-4">
          <FormField
            label="Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter resource title"
          />
          
          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FormField>
          
          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter resource description"
            rows={3}
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              File
            </label>
            <FileUpload
              onUpload={handleFileUpload}
              maxSize={104857600}
              acceptedTypes=".pdf,.docx,.xlsx,.pptx,.zip"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={uploading}>
              Upload Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyResources;
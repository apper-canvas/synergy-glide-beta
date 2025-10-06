import { useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import FileUpload from "@/components/molecules/FileUpload";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const SupportTickets = () => {
  const { currentUser } = useSelector(state => state.user);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "Medium",
  });
  
  const tickets = [
    {
      id: 1,
      subject: "Cannot upload files to project",
      description: "Getting an error when trying to upload files",
      priority: "High",
      status: "Open",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: 2,
      subject: "Task not showing in Kanban board",
      description: "Created a task but it's not appearing",
      priority: "Medium",
      status: "In Progress",
      created_at: "2024-01-14T15:30:00Z",
    },
  ];
  
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setCreating(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Support ticket created successfully");
      setShowCreateModal(false);
      setFormData({
        subject: "",
        description: "",
        priority: "Medium",
      });
    } catch (error) {
      toast.error("Failed to create ticket");
    } finally {
      setCreating(false);
    }
  };
  
  const handleFileUpload = async (files) => {
    toast.success(`Uploaded ${files.length} file(s) to ticket`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
          <p className="text-slate-600 mt-1">Get help from our support team</p>
        </div>
        
        <Button icon="Plus" onClick={() => setShowCreateModal(true)}>
          New Ticket
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {tickets.map((ticket) => (
          <Card key={ticket.id} hover className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {ticket.subject}
                </h3>
                <p className="text-sm text-slate-600">
                  {ticket.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={ticket.priority} type="priority" />
                <StatusBadge
                  status={ticket.status}
                  type={ticket.status === "Open" ? "info" : "warning"}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="Clock" size={16} />
                <span>Created {new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Support Ticket"
        size="md"
      >
        <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
          <FormField
            label="Subject"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Brief description of the issue"
          />
          
          <FormField
            label="Description"
            type="textarea"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of your issue"
            rows={5}
          />
          
          <FormField
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </FormField>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Attachments (Optional)
            </label>
            <FileUpload
              onUpload={handleFileUpload}
              maxSize={20971520}
              multiple
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
              Create Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupportTickets;
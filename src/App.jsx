import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import ProjectsList from "@/components/pages/ProjectsList";
import ProjectDetail from "@/components/pages/ProjectDetail";
import TaskBoard from "@/components/pages/TaskBoard";
import CompanyResources from "@/components/pages/CompanyResources";
import Messages from "@/components/pages/Messages";
import Profile from "@/components/pages/Profile";
import AdminPanel from "@/components/pages/AdminPanel";
import SupportTickets from "@/components/pages/SupportTickets";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        className="toast-container"
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectsList />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
          <Route path="tasks" element={<TaskBoard />} />
          <Route path="resources" element={<CompanyResources />} />
          <Route path="messages" element={<Messages />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="support" element={<SupportTickets />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
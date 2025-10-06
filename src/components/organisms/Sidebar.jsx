import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useContext } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import { canManageUsers } from "@/utils/permissions";
import { AuthContext } from "@/contexts/AuthContext";

const Sidebar = ({ isMobileOpen, onClose }) => {
const { currentUser } = useSelector(state => state.user);
  const { logout } = useContext(AuthContext);
  
  const navItems = [
    { to: "/dashboard", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/projects", icon: "Briefcase", label: "Projects" },
    { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
    { to: "/resources", icon: "FolderOpen", label: "Resources" },
    { to: "/messages", icon: "MessageSquare", label: "Messages" },
    { to: "/support", icon: "HelpCircle", label: "Support" },
  ];
  
if (canManageUsers(currentUser?.role_c)) {
    navItems.push({ to: "/admin", icon: "Settings", label: "Admin" });
  }
  
  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium",
          isActive
            ? "bg-primary-50 text-primary-700 border-l-4 border-primary-600"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )
      }
    >
      <ApperIcon name={icon} size={20} />
      <span>{label}</span>
    </NavLink>
  );
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 lg:hidden transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Layers" size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Synergy Hub
              </span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 lg:hidden">
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} />
            ))}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <NavLink
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
{currentUser?.name_c?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {currentUser?.name_c}
                </p>
                <p className="text-xs text-slate-500 truncate">
{currentUser?.role_c}
              </p>
            </div>
          </NavLink>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <ApperIcon name="LogOut" size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
        </div>
      </aside>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="flex items-center gap-2 p-6 border-b border-slate-200">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <ApperIcon name="Layers" size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Synergy Hub
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
{currentUser?.name_c?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {currentUser?.name_c}
              </p>
{currentUser?.role_c}
            </p>
          </div>
        </NavLink>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ApperIcon name="LogOut" size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
      </aside>
    </>
  );
};

export default Sidebar;
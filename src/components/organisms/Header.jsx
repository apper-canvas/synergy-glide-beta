import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "@/App";
import ApperIcon from "@/components/ApperIcon";
import RoleBadge from "@/components/molecules/RoleBadge";
import Breadcrumb from "@/components/molecules/Breadcrumb";
import Dropdown from "@/components/molecules/Dropdown";
import { updateUserRole } from "@/store/slices/userSlice";
import { ROLES } from "@/utils/permissions";

const Header = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { logout } = useContext(AuthContext);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  
  const handleRoleChange = (role) => {
    dispatch(updateUserRole(role));
    setShowRoleSelector(false);
  };
  
  return (
<header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-600 hover:text-slate-900"
          >
            <ApperIcon name="Menu" size={24} />
          </button>
          
          <Breadcrumb />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-600">Viewing as:</span>
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <RoleBadge role={currentUser?.role_c} size="sm" />
              <ApperIcon name="ChevronDown" size={14} className="text-slate-400" />
            </button>
          </div>
          
          <button
            onClick={logout}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Logout"
          >
            <ApperIcon name="LogOut" size={20} />
          </button>
          
          {showRoleSelector && (
            <div className="absolute top-16 right-4 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase">
                  Switch Role (Demo)
                </p>
              </div>
              {Object.values(ROLES).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <span className="text-slate-700">{role}</span>
                  {currentUser?.role_c === role && (
                    <ApperIcon name="Check" size={16} className="text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
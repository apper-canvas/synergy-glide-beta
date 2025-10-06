export const ROLES = {
  ADMINISTRATOR: "Administrator",
  HR_ADMIN: "HR/Admin",
  PROJECT_MANAGER: "Project Manager",
  TEAM_MEMBER: "Team Member",
  GUEST: "Guest/Viewer",
};

export const hasPermission = (userRole, requiredRoles) => {
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles];
  }
  return requiredRoles.includes(userRole);
};

export const canManageProjects = (userRole) => {
  return hasPermission(userRole, [ROLES.ADMINISTRATOR, ROLES.HR_ADMIN, ROLES.PROJECT_MANAGER]);
};

export const canManageUsers = (userRole) => {
  return hasPermission(userRole, [ROLES.ADMINISTRATOR]);
};

export const canUploadCompanyResources = (userRole) => {
  return hasPermission(userRole, [ROLES.ADMINISTRATOR, ROLES.HR_ADMIN]);
};

export const canManageTasks = (userRole, task, userId) => {
  if (hasPermission(userRole, [ROLES.ADMINISTRATOR, ROLES.PROJECT_MANAGER])) {
    return true;
  }
  return task?.assignee_id === userId || task?.created_by === userId;
};

export const canAccessProject = (userRole, project, userId) => {
  if (hasPermission(userRole, [ROLES.ADMINISTRATOR, ROLES.HR_ADMIN])) {
    return true;
  }
  return project?.members?.some(member => member.user_id === userId);
};
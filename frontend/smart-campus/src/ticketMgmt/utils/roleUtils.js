export const normalizeRole = (role) => {
  if (!role) return '';
  if (Array.isArray(role)) {
    return role[0]?.toString().toUpperCase() || '';
  }
  return role.toString().toUpperCase();
};

export const isAdmin = (role) => normalizeRole(role) === 'ADMIN';
export const isTechnician = (role) => normalizeRole(role) === 'TECHNICIAN';
export const isStaff = (role) => isAdmin(role) || isTechnician(role);

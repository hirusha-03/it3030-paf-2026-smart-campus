export const normalizeRole = (role) => {
  if (!role) return '';
  const raw = Array.isArray(role) ? role[0]?.toString() : role.toString();
  if (!raw) return '';
  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  return capitalize(raw.trim());
};

export const isAdmin = (role) => normalizeRole(role) === 'Admin';
export const isTechnician = (role) => normalizeRole(role) === 'Technician';
export const isUser = (role) => normalizeRole(role) === 'User';
export const isStaff = (role) => isAdmin(role) || isTechnician(role);

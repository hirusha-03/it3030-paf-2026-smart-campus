export const getUserRole = () => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    const roles = userData?.roles || [];
    const role = Array.isArray(roles) ? roles[0] : roles;
    return role?.replace('ROLE_', '').toUpperCase() || 'USER';
  } catch {
    return null;
  }
};

export const isAdmin = () => {
  const role = getUserRole();
  return role === 'ADMIN';
};

export const isUser = () => {
  const role = getUserRole();
  return role === 'USER';
};
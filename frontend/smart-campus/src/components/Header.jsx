import { Bell, Search, UserCircle, Menu } from 'lucide-react';
import { useAuth } from '../authentication/hooks/useAuth';

const Header = ({ setSidebarOpen }) => {
  const { user } = useAuth();

  //  Get initials for avatar
  const getInitials = () => {
    if (!user) return 'U';
    const first = user.userFirstName?.[0] || '';
    const last  = user.userLastName?.[0]  || '';
    return (first + last).toUpperCase() || user.userName?.[0]?.toUpperCase() || 'U';
  };

  //  Get display name
  const getDisplayName = () => {
    if (!user) return 'User Name';
    if (user.userFirstName && user.userLastName)
      return `${user.userFirstName} ${user.userLastName}`;
    if (user.userFirstName) return user.userFirstName;
    return user.userName || 'User Name';
  };

  //  Get role
  const getRole = () => {
    if (!user?.roles) return 'Student';
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return roles[0]?.replace('ROLE_', '') || 'Student';
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all"
        >
          <Menu size={22} />
        </button>
        <div className="relative w-96 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Search resources or tickets..."
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl
              bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-all">
          <Bell size={22} />
          <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-semibold">{getDisplayName()}</p>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              {getRole()}
            </p>
          </div>

          {user ? (
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">
                {getInitials()}
              </span>
            </div>
          ) : (
            <div className="h-10 w-10 bg-slate-200 rounded-full flex items-center justify-center">
              <UserCircle size={28} className="text-slate-400" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
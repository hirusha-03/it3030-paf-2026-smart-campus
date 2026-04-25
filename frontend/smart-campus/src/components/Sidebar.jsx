import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, CalendarRange, Ticket, PieChart, UserCircle, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  // Get user role from localStorage
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = () => {
    if (!user?.roles) return false;
    const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
    return roles.some(role =>
      role?.replace("ROLE_", "").toLowerCase() === "admin"
    );
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Facilities', icon: <Building2 size={20} />,      path: '/resources' },
    { name: 'Bookings',   icon: <CalendarRange size={20} />,  path: '/dashboard/bookings' },
    { name: 'Tickets',    icon: <Ticket size={20} />,         path: '/tickets' },
    { name: 'Analytics',  icon: <PieChart size={20} />,       path: '/analytics', adminOnly: true },
  ];

  const isActive = (path) => location.pathname === path;

  // Filter out adminOnly items for non-admins
  const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin());

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-xl
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 transition-transform duration-300 ease-in-out z-50
      flex flex-col`}>

      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-lg">
            <Building2 size={22} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Smart Campus</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1 text-slate-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="mt-4 px-3 space-y-1 flex-1">
        {visibleNavItems.map((item) => (   // ✅ use visibleNavItems
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
              ${isActive(item.path)
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className={isActive(item.path) ? 'text-indigo-400' : 'text-slate-500'}>
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-slate-800 pt-3">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium
            ${isActive('/profile')
              ? 'bg-indigo-500/20 text-indigo-400'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
          <UserCircle size={18} className={isActive('/profile') ? 'text-indigo-400' : 'text-slate-500'} />
          Profile
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;
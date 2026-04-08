import { LayoutDashboard, Building2, CalendarRange, Ticket, PieChart, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Facilities', icon: <Building2 size={20} />, path: '/facilities' },
    { name: 'Bookings', icon: <CalendarRange size={20} />, path: '/bookings' },
    { name: 'Tickets', icon: <Ticket size={20} />, path: '/tickets' },
    { name: 'Analytics', icon: <PieChart size={20} />, path: '/analytics', adminOnly: true },
  ];

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-white shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Building2 size={24} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight">Smart Campus</span>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <nav className="mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <a key={item.name} href={item.path} className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group">
            <span className="text-slate-400 group-hover:text-indigo-400">{item.icon}</span>
            <span className="font-medium text-sm">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
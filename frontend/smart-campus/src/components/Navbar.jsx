import { NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Resources', href: '#' },
  { label: 'Booking', to: '/tickets' },
];

const Navbar = () => {
  return (
    <nav className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
          Smart Campus Hub
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            if (link.href) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                >
                  {link.label}
                </a>
              );
            }

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-slate-900 ${
                    isActive ? 'text-slate-900' : 'text-slate-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        {/* This button will later trigger the OAuth 2.0 login flow required for the assignment. */}
        <button
          type="button"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

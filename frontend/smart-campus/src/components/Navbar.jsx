import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', to: '/', requiresAuth: false },
  { label: 'Dashboard', to: '/dashboard', requiresAuth: true },
  { label: 'Resources', to: '/resources', requiresAuth: true },
  { label: 'Booking', to: '/bookings', requiresAuth: true },
  { label: 'My Bookings', to: '/my-bookings', requiresAuth: true },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Check if user is logged in
  const isLoggedIn = () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token || user);
  };

  const showNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleNavigation = (link) => {
    if (link.requiresAuth && !isLoggedIn()) {
      showNotification('Please sign in or sign up to access this page');
      setTimeout(() => navigate('/signin'), 2000);
      return;
    }
    
    if (link.to) {
      navigate(link.to);
    }
  };

  return (
    <>
      <nav className="w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Smart Campus Hub
          </div>

          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => {
              if (link.to) {
                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavigation(link)}
                    className="text-sm font-medium transition-colors hover:text-indigo-600 text-slate-600"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <span
                  key={link.label}
                  className="text-sm font-medium text-slate-500"
                >
                  {link.label}
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              if (isLoggedIn()) {
                if (window.confirm('Do you want to logout?')) {
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('user');
                  navigate('/');
                }
              } else {
                navigate('/signin');
              }
            }}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isLoggedIn() ? 'Logout' : 'Login'}
          </button>
        </div>
      </nav>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{toastMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
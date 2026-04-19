import React from 'react';
import { useAuth } from '../authentication/hooks/useAuth';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { user } = useAuth();

  const getDisplayName = () => {
    if (!user) return null;
    if (user.userFirstName && user.userLastName)
      return `${user.userFirstName} ${user.userLastName}`;
    return user.userName || null;
  };

  return (
    <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Smart Campus Hub</span>
          <span className="text-slate-300">|</span>
          <span>© {currentYear} IT3030 PAF Project</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col md:items-end">
            <span className="font-medium text-slate-700">Group ID: IT3030_GRP_XX</span>
            <span className="text-xs text-slate-400">Faculty of Computing - SLIIT</span>
          </div>

          {getDisplayName() && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-xs">
                  {getDisplayName()[0].toUpperCase()}
                </span>
              </div>
              <span className="text-slate-600 text-xs font-medium">
                {getDisplayName()}
              </span>
            </div>
          )}

          <div className="hidden lg:flex gap-2">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider">
              Spring Boot
            </span>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider">
              React
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
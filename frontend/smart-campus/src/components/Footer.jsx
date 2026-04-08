import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 border-t border-slate-200 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
        
        {/* Project Branding */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Smart Campus Hub</span>
          <span className="text-slate-300">|</span>
          <span>© {currentYear} IT3030 PAF Project</span>
        </div>

        {/* Group / Academic Info */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col md:items-end">
            <span className="font-medium text-slate-700">Group ID: IT3030_GRP_XX</span>
            <span className="text-xs text-slate-400">Faculty of Computing - SLIIT</span>
          </div>
          
          {/* Tech Stack Pills */}
          <div className="hidden lg:flex gap-2">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider">Spring Boot</span>
            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase tracking-wider">React</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
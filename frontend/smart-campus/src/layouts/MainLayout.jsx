import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 flex-col ml-0 md:ml-64">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="p-8 flex-grow">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
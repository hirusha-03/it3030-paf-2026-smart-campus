import React, { useEffect, useState } from 'react';
import { Building2, CalendarCheck, AlertCircle, Bell } from 'lucide-react';
import { getAllBookings, getMyBookings } from '../bookings/api/bookingApi';

const Home = () => {
  const [activeBookingCount, setActiveBookingCount] = useState('00');

  useEffect(() => {
    let isMounted = true;

    const loadActiveBookings = async () => {
      try {
        let bookings = [];

        try {
          bookings = await getAllBookings();
        } catch {
          bookings = await getMyBookings();
        }

        const bookingList = Array.isArray(bookings) ? bookings : [];

        const activeCount = bookingList.filter((booking) => {
          const status = typeof booking?.status === 'string' ? booking.status.toUpperCase() : 'PENDING';
          return status !== 'CANCELLED' && status !== 'REJECTED';
        }).length;

        if (isMounted) {
          setActiveBookingCount(String(activeCount).padStart(2, '0'));
        }
      } catch {
        if (isMounted) {
          setActiveBookingCount('00');
        }
      }
    };

    loadActiveBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { label: 'Available Facilities', value: '12', icon: <Building2 className="text-blue-600" />, color: 'bg-blue-50' },
    { label: 'Active Bookings', value: activeBookingCount, icon: <CalendarCheck className="text-emerald-600" />, color: 'bg-emerald-50' },
    { label: 'Pending Tickets', value: '03', icon: <AlertCircle className="text-amber-600" />, color: 'bg-amber-50' },
    { label: 'New Notifications', value: '05', icon: <Bell className="text-indigo-600" />, color: 'bg-indigo-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Smart Campus Overview</h1>
          <p className="text-slate-500 mt-1">Real-time status of university facilities and maintenance.</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">Current Session</p>
          <p className="text-lg font-semibold text-slate-700">April 08, 2026</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-default">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Recent System Activity</h2>
          <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All Logs</button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700 underline underline-offset-4 decoration-slate-200">System initialization log entry #{i}</p>
                <p className="text-xs text-slate-400 mt-1">2 hours ago • Global Admin</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
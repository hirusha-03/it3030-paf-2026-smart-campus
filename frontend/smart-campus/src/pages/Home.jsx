import React, { useEffect, useState } from 'react';
import { Building2, CalendarCheck, AlertCircle, Bell, Megaphone, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

// Mock notices data
const NOTICES = [
  {
    id: 1,
    type: 'info',
    title: 'Scheduled Maintenance — Library Building',
    body: 'The library computer lab will be unavailable on May 2nd from 8:00 AM to 12:00 PM due to scheduled maintenance.',
    time: '2 hours ago',
    author: 'Facilities Admin',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Booking Policy Update',
    body: 'Effective from May 1st, all facility bookings must be submitted at least 24 hours in advance. Last-minute bookings will no longer be accepted.',
    time: '5 hours ago',
    author: 'Campus Admin',
  },
  {
    id: 3,
    type: 'success',
    title: 'New Seminar Room Available',
    body: 'Seminar Room B on the 3rd floor of the Engineering Block is now available for bookings. Capacity: 40 persons.',
    time: '1 day ago',
    author: 'Resource Manager',
  },
  {
    id: 4,
    type: 'announcement',
    title: 'System Upgrade This Weekend',
    body: 'Smart Campus will undergo a system upgrade on Saturday night from 10:00 PM to 2:00 AM. Some features may be temporarily unavailable.',
    time: '2 days ago',
    author: 'IT Department',
  },
  {
    id: 5,
    type: 'info',
    title: 'Reminder — Return Borrowed Equipment',
    body: 'All borrowed lab equipment must be returned by the end of this week. Please visit the equipment desk at Block C, Room 101.',
    time: '3 days ago',
    author: 'Lab Coordinator',
  },
];

const NOTICE_STYLES = {
  info: {
    icon:       <Info size={15} className="text-blue-600" />,
    dot:        'bg-blue-500',
    badge:      'bg-blue-50 text-blue-700 border-blue-100',
    label:      'Info',
  },
  warning: {
    icon:       <AlertTriangle size={15} className="text-amber-600" />,
    dot:        'bg-amber-500',
    badge:      'bg-amber-50 text-amber-700 border-amber-100',
    label:      'Notice',
  },
  success: {
    icon:       <CheckCircle2 size={15} className="text-green-600" />,
    dot:        'bg-green-500',
    badge:      'bg-green-50 text-green-700 border-green-100',
    label:      'New',
  },
  announcement: {
    icon:       <Megaphone size={15} className="text-indigo-600" />,
    dot:        'bg-indigo-500',
    badge:      'bg-indigo-50 text-indigo-700 border-indigo-100',
    label:      'Announcement',
  },
};

export default function Home() {
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [showAllNotices, setShowAllNotices] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day:   '2-digit',
    year:  'numeric',
  });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(
        'http://localhost:8080/api/v1/user/dashboard/stats',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const format = (val) =>
    loading ? '—' : String(val ?? 0).padStart(2, '0');

  const statCards = [
    {
      label: 'Available Facilities',
      value: format(stats?.availableFacilities),
      icon:  <Building2 className="text-blue-600" />,
      color: 'bg-blue-50',
    },
    {
      label: 'Active Bookings',
      value: format(stats?.activeBookings),
      icon:  <CalendarCheck className="text-emerald-600" />,
      color: 'bg-emerald-50',
    },
    {
      label: 'Pending Tickets',
      value: format(stats?.pendingTickets),
      icon:  <AlertCircle className="text-amber-600" />,
      color: 'bg-amber-50',
    },
    {
      label: 'New Notifications',
      value: format(stats?.newNotifications),
      icon:  <Bell className="text-indigo-600" />,
      color: 'bg-indigo-50',
    },
  ];

  // Show 3 by default, all when expanded
  const visibleNotices = showAllNotices ? NOTICES : NOTICES.slice(0, 3);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Welcome Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Smart Campus Overview
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time status of university facilities and maintenance.
          </p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest">
            Current Session
          </p>
          <p className="text-lg font-semibold text-slate-700">{currentDate}</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100
              hover:shadow-md transition-shadow cursor-default"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center
              justify-center mb-4`}>
              {stat.icon}
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {stat.label}
            </p>
            {loading ? (
              <div className="h-9 w-12 bg-slate-100 rounded-lg animate-pulse mt-1" />
            ) : (
              <p className="text-3xl font-bold mt-1 text-slate-900">{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Notices */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center
              justify-center">
              <Megaphone size={16} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notices</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest campus announcements and updates
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAllNotices(prev => !prev)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700
              transition-colors"
          >
            {showAllNotices ? 'Show less' : `View all (${NOTICES.length})`}
          </button>
        </div>

        <div className="space-y-3">
          {visibleNotices.map((notice) => {
            const style = NOTICE_STYLES[notice.type];
            return (
              <div
                key={notice.id}
                className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl
                  border border-slate-100 hover:bg-slate-100/60 transition-colors"
              >
                {/* Type icon */}
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200
                  flex items-center justify-center flex-shrink-0 mt-0.5">
                  {style.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-slate-800">
                      {notice.title}
                    </p>
                    {/* Type badge */}
                    <span className={`px-2 py-0.5 text-[10px] font-semibold
                      rounded-full border uppercase tracking-wide ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-2">
                    {notice.body}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{notice.time}</span>
                    <span className="text-slate-200 text-xs">•</span>
                    <span className="text-xs text-slate-400">{notice.author}</span>
                  </div>
                </div>

                {/* Color dot */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2
                  ${style.dot}`}
                />
              </div>
            );
          })}
        </div>

        {/* Show more / less button at bottom */}
        {!showAllNotices && NOTICES.length > 3 && (
          <button
            onClick={() => setShowAllNotices(true)}
            className="w-full mt-4 py-2.5 text-sm text-slate-400 hover:text-indigo-600
              border border-dashed border-slate-200 hover:border-indigo-200
              rounded-xl transition-colors font-medium"
          >
            + {NOTICES.length - 3} more notices
          </button>
        )}
      </div>

    </div>
  );
}
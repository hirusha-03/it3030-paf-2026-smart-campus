import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Bell, Calendar, Ticket, RotateCcw,
  CheckCircle, ChevronRight
} from 'lucide-react';

// Preference groups config 
const PREFERENCE_GROUPS = [
  {
    key:   'booking',
    label: 'Booking notifications',
    icon:  <Calendar size={16} className="text-indigo-500" />,
    items: [
      {
        key:       'bookingCreated',
        label:     'New booking request',
        desc:      'When a user submits a new booking',
        adminOnly: true,   
      },
      {
        key:       'bookingApproved',
        label:     'Booking approved',
        desc:      'When your booking gets approved',
        adminOnly: false,  
      },
      {
        key:       'bookingRejected',
        label:     'Booking rejected',
        desc:      'When your booking gets rejected',
        adminOnly: false,
      },
      {
        key:       'bookingCancelled',
        label:     'Booking cancelled',
        desc:      'When a booking is cancelled',
        adminOnly: false,
      },
    ],
  },
  {
    key:   'ticket',
    label: 'Ticket notifications',
    icon:  <Ticket size={16} className="text-purple-500" />,
    items: [
      {
        key:       'ticketCreated',
        label:     'New ticket submitted',
        desc:      'When a user submits a new ticket',
        adminOnly: true,   
      },
      {
        key:       'ticketAssigned',
        label:     'Ticket assigned',
        desc:      'When your ticket is assigned to a technician',
        adminOnly: false,
      },
      {
        key:       'ticketStatusUpdated',
        label:     'Status updated',
        desc:      'When your ticket status changes',
        adminOnly: false,
      },
      {
        key:       'ticketResolved',
        label:     'Ticket resolved',
        desc:      'When your ticket is marked as resolved',
        adminOnly: false,
      },
      {
        key:       'ticketClosed',
        label:     'Ticket closed',
        desc:      'When your ticket is closed',
        adminOnly: false,
      },
      {
        key:       'ticketRejected',
        label:     'Ticket rejected',
        desc:      'When your ticket is rejected',
        adminOnly: false,
      },
      {
        key:       'ticketComment',
        label:     'New comment',
        desc:      'When someone comments on your ticket',
        adminOnly: false,
      },
    ],
  },
];

// Toggle component 
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full
        transition-colors duration-200 focus:outline-none flex-shrink-0
        ${enabled ? 'bg-indigo-600' : 'bg-slate-200'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white
        transition-transform duration-200 shadow-sm
        ${enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'}`}
      />
    </button>
  );
}

// Main Settings component 
export default function Settings() {
  const token = localStorage.getItem('token');

  const [prefs,   setPrefs]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  const authHeader = { Authorization: `Bearer ${token}` };

  // Get role from localStorage
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const isAdmin = () => {
    if (!currentUser?.roles) return false;
    const roles = Array.isArray(currentUser.roles)
      ? currentUser.roles
      : [currentUser.roles];
    return roles.some(role =>
      role?.replace('ROLE_', '').toLowerCase() === 'admin'
    );
  };

  const admin = isAdmin();

  // Filter items per role — admin sees adminOnly, users see !adminOnly
  const getVisibleGroups = () => {
    return PREFERENCE_GROUPS.map(group => ({
      ...group,
      items: group.items.filter(item =>
        admin ? item.adminOnly === true  || item.adminOnly === false
               : item.adminOnly === false
        // ↑ admin sees ALL items, user sees only non-adminOnly items
      ),
    })).filter(group => group.items.length > 0);
  };

  // Simpler — admin sees everything, user sees only their items
  const getFilteredGroups = () => {
    return PREFERENCE_GROUPS.map(group => ({
      ...group,
      items: admin
        ? group.items.filter(item => item.adminOnly)  
      : group.items.filter(item => !item.adminOnly),     
    })).filter(group => group.items.length > 0);
  };

  const visibleGroups = getFilteredGroups();

  useEffect(() => { fetchPreferences(); }, []);

  const fetchPreferences = async () => {
    try {
      const res = await axios.get(
        'http://localhost:8080/api/v1/notifications/preferences',
        { headers: authHeader }
      );
      setPrefs(res.data);
    } catch {
      setError('Failed to load preferences.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleToggleGroup = (group) => {
    const allEnabled = group.items.every(item => prefs[item.key]);
    const updates = {};
    group.items.forEach(item => { updates[item.key] = !allEnabled; });
    setPrefs(prev => ({ ...prev, ...updates }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await axios.put(
        'http://localhost:8080/api/v1/notifications/preferences',
        prefs,
        { headers: authHeader }
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all notification preferences to default?')) return;
    setSaving(true);
    try {
      const res = await axios.post(
        'http://localhost:8080/api/v1/notifications/preferences/reset',
        {},
        { headers: authHeader }
      );
      setPrefs(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to reset preferences.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent
            rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left nav */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 h-fit">
          <button className="w-full flex items-center justify-between px-3 py-2.5
            rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium">
            <div className="flex items-center gap-2.5">
              <Bell size={16} />
              Notifications
            </div>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Right content */}
        <div className="lg:col-span-3 space-y-5">

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl
              text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Header card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center
                  justify-center">
                  <Bell size={16} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-slate-800">
                    Notification preferences
                  </h2>
                  {/* Show role context */}
                  <p className="text-xs text-slate-400 mt-0.5">
                    Showing preferences for{' '}
                    <span className={`font-medium ${
                      admin ? 'text-indigo-600' : 'text-slate-600'
                    }`}>
                      {admin ? 'Admin' : 'User'}
                    </span>{' '}
                    role
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                disabled={saving}
                className="flex items-center gap-1.5 text-xs text-slate-400
                  hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={13} />
                Reset to default
              </button>
            </div>
          </div>

          {/* Preference groups — filtered by role */}
          {visibleGroups.map((group) => {
            const enabledCount = group.items.filter(
              item => prefs?.[item.key]
            ).length;
            const allEnabled = enabledCount === group.items.length;

            return (
              <div key={group.key}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

                {/* Group header */}
                <div className="flex items-center justify-between px-6 py-4
                  border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center
                      justify-center">
                      {group.icon}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-800">
                        {group.label}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        {enabledCount}/{group.items.length} enabled
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">
                      {allEnabled ? 'All on' : enabledCount > 0 ? 'Some on' : 'All off'}
                    </span>
                    <Toggle
                      enabled={allEnabled}
                      onChange={() => handleToggleGroup(group)}
                    />
                  </div>
                </div>

                {/* Individual items */}
                <div className="divide-y divide-slate-50">
                  {group.items.map((item) => (
                    <div key={item.key}
                      className="flex items-center justify-between px-6 py-4
                        hover:bg-slate-50/50 transition-colors">
                      <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-700">
                            {item.label}
                          </p>
                          {/* Role badge */}
                          {item.adminOnly && (
                            <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600
                              text-[10px] font-semibold rounded uppercase tracking-wide">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle
                        enabled={prefs?.[item.key] ?? true}
                        onChange={() => handleToggle(item.key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Save button */}
          <div className="flex items-center justify-between bg-white border
            border-slate-200 rounded-2xl px-6 py-4">
            <div>
              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={15} />
                  <span className="text-sm font-medium">Preferences saved!</span>
                </div>
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 h-10 bg-indigo-600 hover:bg-indigo-700 text-white
                rounded-xl text-sm font-medium transition-colors disabled:opacity-60
                flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent
                    rounded-full animate-spin" />
                  Saving...
                </>
              ) : 'Save preferences'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
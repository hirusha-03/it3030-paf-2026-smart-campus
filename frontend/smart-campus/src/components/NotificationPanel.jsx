import { useEffect, useRef } from 'react';
import axios from 'axios';
import { CheckCheck, Bell, X } from 'lucide-react';

const TYPE_STYLES = {
  BOOKING_APPROVED: {
    dot:   'bg-green-500',
    bg:    'bg-green-50 border-green-100',
    label: 'Approved',
    color: 'text-green-700',
  },
  BOOKING_REJECTED: {
    dot:   'bg-red-500',
    bg:    'bg-red-50 border-red-100',
    label: 'Rejected',
    color: 'text-red-700',
  },
  BOOKING_CANCELLED: {
    dot:   'bg-amber-500',
    bg:    'bg-amber-50 border-amber-100',
    label: 'Cancelled',
    color: 'text-amber-700',
  },
  BOOKING_CREATED: {
    dot:   'bg-indigo-500',
    bg:    'bg-indigo-50 border-indigo-100',
    label: 'New booking',
    color: 'text-indigo-700',
  },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function NotificationPanel({
  notifications, onClose, onMarkRead, onMarkAllRead
}) {
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-96 bg-white border border-slate-200
        rounded-2xl z-50 overflow-hidden"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-600" />
          <span className="font-semibold text-slate-800 text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs
              font-medium rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-xs text-indigo-600
                hover:underline font-medium"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100
              rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-5">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center
              justify-center mb-3">
              <Bell size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No notifications</p>
            <p className="text-xs text-slate-400 mt-1">
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map((n) => {
            const style = TYPE_STYLES[n.type] || {
              dot: 'bg-slate-400', bg: 'bg-slate-50 border-slate-100',
              label: n.type, color: 'text-slate-600'
            };

            return (
              <div
                key={n.id}
                onClick={() => !n.read && onMarkRead(n.id)}
                className={`px-5 py-4 border-b border-slate-50 cursor-pointer
                  transition-colors hover:bg-slate-50
                  ${!n.read ? 'bg-indigo-50/40' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Status dot */}
                  <div className="mt-1.5 flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      n.read ? 'bg-slate-300' : style.dot
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-slate-800 truncate">
                        {n.title}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-2">
                      {n.message}
                    </p>

                    <span className={`inline-block px-2 py-0.5 text-xs font-medium
                      rounded-full border ${style.bg} ${style.color}`}>
                      {style.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''} total
          </p>
        </div>
      )}
    </div>
  );
}
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  TICKET_ASSIGNED: {
    dot:   'bg-indigo-500',
    bg:    'bg-indigo-50 border-indigo-100',
    label: 'Assigned',
    color: 'text-indigo-700',
  },
  TICKET_STATUS_UPDATED: {
    dot:   'bg-blue-500',
    bg:    'bg-blue-50 border-blue-100',
    label: 'Status updated',
    color: 'text-blue-700',
  },
  TICKET_REJECTED: {
    dot:   'bg-red-500',
    bg:    'bg-red-50 border-red-100',
    label: 'Rejected',
    color: 'text-red-700',
  },
  TICKET_RESOLVED: {
    dot:   'bg-green-500',
    bg:    'bg-green-50 border-green-100',
    label: 'Resolved',
    color: 'text-green-700',
  },
  TICKET_CLOSED: {
    dot:   'bg-slate-500',
    bg:    'bg-slate-50 border-slate-100',
    label: 'Closed',
    color: 'text-slate-700',
  },
  TICKET_COMMENT: {
    dot:   'bg-purple-500',
    bg:    'bg-purple-50 border-purple-100',
    label: 'New comment',
    color: 'text-purple-700',
  },
  TICKET_CREATED: {
    dot:   'bg-amber-500',
    bg:    'bg-amber-50 border-amber-100',
    label: 'New ticket',
    color: 'text-amber-700',
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
  notifications,
  dismissed,           // Received from Header
  onClose,
  onMarkRead,
  onMarkAllRead,
  onDismiss,           // Received from Header
  onRestoreDismissed,
  onNotificationClick,
  anchorRef,
}) {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 384 });

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

  // Position the panel relative to the anchor button using a portal so it escapes stacking contexts
  useEffect(() => {
    const update = () => {
      try {
        const anchor = anchorRef?.current;
        const width = 384; // w-96
        if (!anchor) return setPos((p) => ({ ...p }));
        const rect = anchor.getBoundingClientRect();
        const top = Math.max(8, rect.bottom + 8);
        let left = rect.right - width;
        if (left < 8) left = 8;
        if (left + width > window.innerWidth - 8) left = Math.max(8, window.innerWidth - width - 8);
        setPos({ top, left, width });
      } catch (e) {
        // ignore
      }
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorRef]);

  
  // Filter out dismissed notifications
  const visibleNotifications = notifications.filter(n => !dismissed.has(n.id));
  const unreadCount = visibleNotifications.filter(n => !n.read).length;

  const panel = (
    <div
      ref={panelRef}
      className="bg-white border border-slate-200 rounded-2xl z-50 overflow-hidden"
      style={{
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: pos.width,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4
        border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-600" />
          <span className="font-semibold text-slate-800 text-sm">
            Notifications
          </span>
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
          {dismissed.size > 0 && (
            <button
              onClick={onRestoreDismissed}
              className="text-xs text-slate-400 hover:text-slate-600
                hover:underline transition-colors"
            >
              Show {dismissed.size} hidden
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600
              hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {visibleNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-5">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center
              justify-center mb-3">
              <Bell size={20} className="text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">No notifications</p>
            <p className="text-xs text-slate-400 mt-1">
              {dismissed.size > 0
                ? `${dismissed.size} hidden — click "Show hidden" to restore`
                : "You're all caught up!"
              }
            </p>
          </div>
        ) : (
          visibleNotifications.map((n) => {
            const style = TYPE_STYLES[n.type] || {
              dot: 'bg-slate-400', bg: 'bg-slate-50 border-slate-100',
              label: n.type, color: 'text-slate-600',
            };

            return (
              <div
                  key={n.id}
                  onClick={() => {
                    if (!n.read) onMarkRead(n.id);
                    if (onNotificationClick) onNotificationClick(n);
                  }}
                  className={`group px-5 py-4 border-b border-slate-50
                    transition-colors hover:bg-slate-50 cursor-pointer
                    ${!n.read ? 'bg-indigo-50/40' : ''}`}
                >
                <div className="flex items-start gap-3">
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
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="text-xs text-slate-400">
                          {timeAgo(n.createdAt)}
                        </span>
                        {/* Dismiss X — calls onDismiss from Header */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDismiss(n.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5
                            text-slate-300 hover:text-slate-500
                            hover:bg-slate-200 rounded transition-all"
                          title="Hide notification"
                        >
                          <X size={13} />
                        </button>
                      </div>
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
      {visibleNotifications.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400 text-center">
            {visibleNotifications.length} notification
            {visibleNotifications.length !== 1 ? 's' : ''}
            {dismissed.size > 0 && ` · ${dismissed.size} hidden`}
          </p>
        </div>
      )}
    </div>
  );

  return createPortal(panel, document.body);
}
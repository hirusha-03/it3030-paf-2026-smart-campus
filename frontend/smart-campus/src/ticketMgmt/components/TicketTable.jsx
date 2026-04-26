import React from 'react';
import { Eye, UserCheck, RefreshCw, Trash2 } from 'lucide-react';
import { isAdmin, isStaff } from '../utils/roleUtils';

const TicketTable = ({ tickets, onView, onAssign, onUpdateStatus, onDelete, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMillis = (ms) => {
    if (!ms && ms !== 0) return '-';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getAttachmentLabel = (filePath) => {
    if (!filePath) return 'Attachment';
    // prefer fileName if provided in DTO (backend sets it)
    return filePath.split('/').pop();
  };

  const isRenderableImage = (filePath) => {
    if (!filePath) return false;
    return filePath.startsWith('data:') || filePath.startsWith('http') || filePath.startsWith('/');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600';
      case 'MEDIUM': return 'text-yellow-600';
      case 'LOW': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">Tickets</h2>
      </div>
      <div className="max-h-[65vh] overflow-y-auto">
        <table className="w-full table-fixed">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">ID</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-44">Title</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Category</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Status</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-20">Priority</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Created By</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Assigned To</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">First Response</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Resolution</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-28">Attachments</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="px-3 py-3 text-xs font-medium text-slate-900 break-words">{ticket.id}</td>
                <td className="px-3 py-3 text-xs text-slate-900 break-words">{ticket.title}</td>
                <td className="px-3 py-3 text-xs text-slate-700 break-words">{ticket.category || '-'}</td>
                <td className="px-3 py-3">
                  <span className={`inline-flex px-2 py-1 text-[11px] font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-xs font-medium">
                  <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                </td>
                <td className="px-3 py-3 text-xs text-slate-500 break-words">{ticket.createdBy?.name}</td>
                <td className="px-3 py-3 text-xs text-slate-500 break-words">{ticket.assignedTo?.name || 'Unassigned'}</td>
                <td className="px-3 py-3 text-xs text-slate-700">{formatMillis(ticket.timeToFirstResponseMillis)}</td>
                <td className="px-3 py-3 text-xs text-slate-700">{formatMillis(ticket.timeToResolutionMillis)}</td>
                <td className="px-3 py-3 text-xs text-slate-500">
                  {ticket.attachments?.length > 0 ? (
                    <div className="flex flex-wrap gap-2 items-center">
                      {ticket.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center">
                          {isRenderableImage(attachment.filePath) ? (
                            <img src={attachment.filePath} alt={attachment.fileName || getAttachmentLabel(attachment.filePath)} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <span className="text-indigo-600">{attachment.fileName || getAttachmentLabel(attachment.filePath)}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">No attachments</span>
                  )}
                </td>
                <td className="px-3 py-3 text-xs font-medium space-x-2">
                  <button onClick={() => onView(ticket.id)} className="text-indigo-600 hover:text-indigo-900" title="View">
                    <Eye size={16} />
                  </button>
                  {isAdmin(userRole) && !ticket.assignedTo && (
                    <button onClick={() => onAssign(ticket.id)} className="text-green-600 hover:text-green-900" title="Assign">
                      <UserCheck size={16} />
                    </button>
                  )}
                  {isStaff(userRole) && (
                    <button onClick={() => onUpdateStatus(ticket.id)} className="text-blue-600 hover:text-blue-900" title="Update status">
                      <RefreshCw size={16} />
                    </button>
                  )}
                  {isAdmin(userRole) && (ticket.status === 'CLOSED' || ticket.status === 'REJECTED') && (
                    <button onClick={() => onDelete && onDelete(ticket.id)} className="text-red-600 hover:text-red-900" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketTable;
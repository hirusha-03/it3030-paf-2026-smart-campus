import React from 'react';
import { Eye, UserCheck, RefreshCw } from 'lucide-react';

const TicketTable = ({ tickets, onView, onAssign, onUpdateStatus, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{ticket.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{ticket.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ticket.createdBy?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{ticket.assignedTo?.name || 'Unassigned'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => onView(ticket.id)} className="text-indigo-600 hover:text-indigo-900">
                    <Eye size={16} />
                  </button>
                  {userRole === 'ADMIN' && !ticket.assignedTo && (
                    <button onClick={() => onAssign(ticket.id)} className="text-green-600 hover:text-green-900">
                      <UserCheck size={16} />
                    </button>
                  )}
                  {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') && (
                    <button onClick={() => onUpdateStatus(ticket.id)} className="text-blue-600 hover:text-blue-900">
                      <RefreshCw size={16} />
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
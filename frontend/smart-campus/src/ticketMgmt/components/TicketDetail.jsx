import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, RefreshCw } from 'lucide-react';
import { getTicketById, addComment, updateTicketStatus } from '../api/ticketService';

const TicketDetail = ({ ticketId, onBack, userId, userRole }) => {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
      setStatus(data.status);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment(ticketId, comment, userId);
      setComment('');
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await updateTicketStatus(ticketId, status, userId);
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
        <ArrowLeft size={20} />
        Back to Tickets
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">{ticket.title}</h1>
        <p className="text-slate-600 mb-4">{ticket.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <span className="text-sm font-medium text-slate-500">Status:</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!(userRole === 'ADMIN' || userRole === 'TECHNICIAN')}
              className="ml-2 px-2 py-1 border border-slate-300 rounded"
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
            {(userRole === 'ADMIN' || userRole === 'TECHNICIAN') && (
              <button onClick={handleUpdateStatus} className="ml-2 text-blue-600 hover:text-blue-700">
                <RefreshCw size={16} />
              </button>
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-500">Priority:</span>
            <span className="ml-2 text-slate-700">{ticket.priority}</span>
          </div>
          <div>
            <span className="text-sm font-medium text-slate-500">Assigned To:</span>
            <span className="ml-2 text-slate-700">{ticket.assignedTo?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {ticket.comments.map((c) => (
            <div key={c.id} className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700">{c.message}</p>
              <p className="text-xs text-slate-400 mt-2">
                {c.user.name} - {new Date(c.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button onClick={handleAddComment} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
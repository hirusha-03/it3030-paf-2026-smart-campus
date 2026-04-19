import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, RefreshCw, Edit, Trash2, AlertCircle } from 'lucide-react';
import { getTicketById, addComment, updateTicketStatus, rejectTicket, updateComment, deleteComment } from '../api/ticketService';
import { isAdmin, isStaff } from '../utils/roleUtils';
import RejectModal from './RejectModal';
import EditCommentModal from './EditCommentModal';

const TicketDetail = ({ ticketId, onBack, userId, userRole }) => {
  const [ticket, setTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentMessage, setEditingCommentMessage] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const fetchTicket = async () => {
    try {
      const data = await getTicketById(ticketId);
      setTicket(data);
      setStatus(data.status);
      setResolutionNotes(data.resolutionNotes || '');
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment(ticketId, comment);
      setComment('');
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment: ' + (error.message || 'Network error'));
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await updateTicketStatus(ticketId, status, resolutionNotes || null);
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status: ' + (error.message || 'Network error'));
    }
  };

  const handleRejectTicket = async (reason) => {
    try {
      await rejectTicket(ticketId, reason);
      setIsRejectModalOpen(false);
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to reject ticket:', error);
      alert('Failed to reject ticket: ' + (error.message || 'Network error'));
    }
  };

  const handleEditComment = (commentId, message) => {
    setEditingCommentId(commentId);
    setEditingCommentMessage(message);
    setIsEditCommentOpen(true);
  };

  const handleUpdateComment = async (newMessage) => {
    try {
      await updateComment(ticketId, editingCommentId, newMessage);
      setIsEditCommentOpen(false);
      setEditingCommentId(null);
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to update comment:', error);
      alert('Failed to update comment: ' + (error.message || 'Network error'));
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(ticketId, commentId);
      setDeleteConfirmId(null);
      fetchTicket(); // Refresh
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment: ' + (error.message || 'Network error'));
    }
  };

  if (!ticket) return <div>Loading...</div>;

  const isCommentOwner = (commentUserId) => commentUserId === userId;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
        <ArrowLeft size={20} />
        Back to Tickets
      </button>

      {/* Main Ticket Info */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-slate-800">{ticket.title}</h1>
          {isAdmin(userRole) && ticket.status !== 'REJECTED' && (
            <button
              onClick={() => setIsRejectModalOpen(true)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 flex items-center gap-1"
            >
              <AlertCircle size={16} />
              Reject
            </button>
          )}
        </div>
        
        <p className="text-slate-600 mb-6">{ticket.description}</p>

        {/* Status and rejection info */}
        {ticket.status === 'REJECTED' && ticket.rejectionReason && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
            <p className="text-red-700">{ticket.rejectionReason}</p>
          </div>
        )}

        {/* Main Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
          <div>
            <span className="text-sm font-medium text-slate-500">Status:</span>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={!isStaff(userRole)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {isAdmin(userRole) && <option value="OPEN">Open</option>}
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                {isAdmin(userRole) && <option value="REJECTED">Rejected</option>}
              </select>
              {isStaff(userRole) && (
                <button onClick={handleUpdateStatus} className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg">
                  <RefreshCw size={18} />
                </button>
              )}
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-slate-500">Priority:</span>
            <p className="mt-2 text-slate-700">{ticket.priority}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Assigned To:</span>
            <p className="mt-2 text-slate-700">{ticket.assignedTo?.name || 'Unassigned'}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Category:</span>
            <p className="mt-2 text-slate-700">{ticket.category || 'N/A'}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Contact Method:</span>
            <p className="mt-2 text-slate-700">{ticket.contactMethod || 'N/A'}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Contact Details:</span>
            <p className="mt-2 text-slate-700">{ticket.contactDetails || 'N/A'}</p>
          </div>
        </div>

        {/* Resolution Notes */}
        {isStaff(userRole) && (status === 'RESOLVED' || status === 'CLOSED') && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Resolution Notes</label>
          <textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            rows={3}
            placeholder="Describe what was done to resolve this issue..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      )}

        {ticket.resolutionNotes && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-2">Resolution Notes:</p>
            <p className="text-green-700">{ticket.resolutionNotes}</p>
          </div>
        )}

        {ticket.attachments?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Attachments</h3>
            <div className="space-y-2">
              {ticket.attachments.map((attachment) => (
                <div key={attachment.id}>
                  <a
                    href={attachment.filePath}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:text-indigo-900 underline"
                  >
                    {attachment.filePath.startsWith('data:image')
                      ? 'View image'
                      : attachment.filePath.split('/').pop()}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Comments</h2>
        <div className="space-y-4 mb-6">
          {ticket.comments && ticket.comments.length > 0 ? (
            ticket.comments.map((c) => (
              <div key={c.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-slate-700">{c.message}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {c.user.name} - {new Date(c.timestamp).toLocaleString()}
                    </p>
                  </div>
                  {isCommentOwner(c.user.id) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditComment(c.id, c.message)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
                        title="Edit comment"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No comments yet</p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button onClick={handleAddComment} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1">
            <Send size={16} />
            Send
          </button>
        </div>
      </div>

      {/* Modals */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectTicket}
        ticketTitle={ticket.title}
      />

      <EditCommentModal
        isOpen={isEditCommentOpen}
        onClose={() => setIsEditCommentOpen(false)}
        onSubmit={handleUpdateComment}
        initialMessage={editingCommentMessage}
      />
    </div>
  );
};

export default TicketDetail;
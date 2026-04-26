import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, RefreshCw, Edit, Trash2, AlertCircle } from 'lucide-react';
import { getTicketById, addComment, updateTicketStatus, rejectTicket, updateComment, deleteComment } from '../api/ticketService';
import { isAdmin, isStaff, isTechnician } from '../utils/roleUtils';
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
  const [activeAttachment, setActiveAttachment] = useState(null);

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (!activeAttachment) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveAttachment(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAttachment]);

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

  // Returns allowed next statuses based on current ticket status and role
  const getAllowedStatuses = () => {
    if (!ticket) return [];

    // Terminal states — no transitions allowed
    if (ticket.status === 'CLOSED' || ticket.status === 'REJECTED') return [];

    // OPEN — admin handles via assign (auto IN_PROGRESS) or reject button
    // No dropdown transitions from OPEN
    if (ticket.status === 'OPEN') return [];

    if (ticket.status === 'IN_PROGRESS') return ['IN_PROGRESS', 'RESOLVED'];
    if (ticket.status === 'RESOLVED')    return ['RESOLVED', 'CLOSED'];

    return [];
  };

  const getAllowedStatusLabels = {
    'IN_PROGRESS': 'In Progress',
    'RESOLVED':    'Resolved',
    'CLOSED':      'Closed',
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await addComment(ticketId, comment);
      setComment('');
      fetchTicket();
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment: ' + (error.message || 'Network error'));
    }
  };

  const handleUpdateStatus = async () => {
  // Guard — don't send if status hasn't changed
  if (status === ticket.status) {
    alert('Please select a different status to update.');
    return;
  }
  try {
    await updateTicketStatus(ticketId, status, resolutionNotes || null);
    fetchTicket();
  } catch (error) {
    console.error('Failed to update status:', error);
    alert('Failed to update status: ' + (error.response?.data?.message || error.message || 'Network error'));
  }
};

  const handleRejectTicket = async (reason) => {
    try {
      await rejectTicket(ticketId, reason);
      setIsRejectModalOpen(false);
      fetchTicket();
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
      fetchTicket();
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
      fetchTicket();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment: ' + (error.message || 'Network error'));
    }
  };

  const getStatusBadgeClass = (s) => {
    switch (s) {
      case 'OPEN':        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'RESOLVED':    return 'bg-green-100 text-green-800';
      case 'CLOSED':      return 'bg-gray-100 text-gray-800';
      case 'REJECTED':    return 'bg-red-100 text-red-800';
      default:            return 'bg-gray-100 text-gray-800';
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

  const formatDateTime = (iso) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleString();
    } catch (e) {
      return iso;
    }
  };

  if (!ticket) return <div>Loading...</div>;

  const allowedStatuses = getAllowedStatuses();
  const canUpdateStatus = isStaff(userRole) && allowedStatuses.length > 1;
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
          {/* Reject button — admin only, only on OPEN tickets */}
          {isAdmin(userRole) && ticket.status === 'OPEN' && (
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

        {/* Rejection reason banner */}
        {ticket.status === 'REJECTED' && ticket.rejectionReason && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800 mb-2">Rejection Reason:</p>
            <p className="text-red-700">{ticket.rejectionReason}</p>
          </div>
        )}

        {/* Main Grid Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">

          {/* Status */}
          <div>
            <span className="text-sm font-medium text-slate-500">Status:</span>
            <div className="mt-2 flex items-center gap-2">
              {canUpdateStatus ? (
                <>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {allowedStatuses.map(s => (
                      <option key={s} value={s}>
                        {getAllowedStatusLabels[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    disabled={status === ticket.status}
                    className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Update status"
                  >
                    <RefreshCw size={18} />
                  </button>
                </>
              ) : (
                // Terminal state or OPEN — just show badge
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
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

          <div>
            <span className="text-sm font-medium text-slate-500">First Response At:</span>
            <p className="mt-2 text-slate-700">{formatDateTime(ticket.firstResponseAt)}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Time to First Response:</span>
            <p className="mt-2 text-slate-700">{formatMillis(ticket.timeToFirstResponseMillis)}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Resolved At:</span>
            <p className="mt-2 text-slate-700">{formatDateTime(ticket.resolvedAt)}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-slate-500">Time to Resolution:</span>
            <p className="mt-2 text-slate-700">{formatMillis(ticket.timeToResolutionMillis)}</p>
          </div>
        </div>

        {/* Resolution Notes input — only when moving to RESOLVED or CLOSED */}
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

        {/* Resolution Notes display */}
        {ticket.resolutionNotes && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm font-semibold text-green-800 mb-2">Resolution Notes:</p>
            <p className="text-green-700">{ticket.resolutionNotes}</p>
          </div>
        )}

        {/* Attachments */}
        {ticket.attachments?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Attachments</h3>
            <div className="space-y-2">
              <div className="flex gap-3 flex-wrap">
                {ticket.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex flex-col items-start">
                    <button
                      type="button"
                      onClick={() => setActiveAttachment(attachment)}
                      className="group"
                      aria-label={`Open attachment ${attachment.fileName || attachment.filePath.split('/').pop()}`}
                    >
                      <img
                        src={attachment.filePath}
                        alt={attachment.fileName || 'attachment'}
                        className="w-48 h-auto rounded border cursor-zoom-in group-hover:opacity-90"
                      />
                    </button>
                    <span className="text-xs text-slate-500 mt-1">{attachment.fileName || attachment.filePath.split('/').pop()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upload control removed per request (no attachments during create or detail) */}
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
          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>

      {/* Modals */}
      {activeAttachment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
          onClick={() => setActiveAttachment(null)}
        >
          <div
            className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <h4 className="text-sm font-semibold text-slate-700 truncate">
                {activeAttachment.fileName || activeAttachment.filePath.split('/').pop()}
              </h4>
              <button
                type="button"
                onClick={() => setActiveAttachment(null)}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-50 rounded-xl p-3">
              <img
                src={activeAttachment.filePath}
                alt={activeAttachment.fileName || 'attachment'}
                className="max-h-[75vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
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
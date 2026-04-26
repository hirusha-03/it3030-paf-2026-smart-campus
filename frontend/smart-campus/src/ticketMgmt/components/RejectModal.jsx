import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const RejectModal = ({ isOpen, onClose, onSubmit, ticketTitle }) => {
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setErrorMsg('Please provide a rejection reason.');
      return;
    }
    setErrorMsg('');
    onSubmit(reason);
    setReason('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Reject Ticket</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <p className="text-sm text-slate-600 mb-4">You are about to reject: <strong>{ticketTitle}</strong></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Rejection Reason (Required)</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value.trim()) setErrorMsg('');
              }}
              rows={4}
              placeholder="Explain why this ticket is being rejected..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reject Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectModal;

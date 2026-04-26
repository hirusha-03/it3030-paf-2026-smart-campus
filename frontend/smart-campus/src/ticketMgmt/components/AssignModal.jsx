import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getTechnicians } from '../api/ticketService';

import { isAdmin } from '../utils/roleUtils';

const AssignModal = ({ isOpen, onClose, onAssign, ticketId, userRole }) => {
  const [technicians, setTechnicians] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Only load technicians for Admin users
      if (!isAdmin(userRole)) return;
      setLoading(true);
      getTechnicians()
        .then(setTechnicians)
        .catch(() => alert('Failed to load technicians'))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedToId) {
      setErrorMsg('Please select a technician before assigning.');
      return;
    }
    setErrorMsg('');
    onAssign(ticketId, parseInt(assignedToId));
    setAssignedToId('');
    onClose();
  };

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
          <h2 className="text-xl font-bold text-slate-800">Assign Technician</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Technician</label>
            {loading ? (
              <p className="text-sm text-slate-500">Loading technicians...</p>
            ) : technicians.length === 0 ? (
              <p className="text-sm text-slate-500">No technicians available.</p>
            ) : (
              <select
                value={assignedToId}
                onChange={(e) => {
                  setAssignedToId(e.target.value);
                  if (e.target.value) setErrorMsg('');
                }}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select a technician --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
            {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit" disabled={!assignedToId || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignModal;
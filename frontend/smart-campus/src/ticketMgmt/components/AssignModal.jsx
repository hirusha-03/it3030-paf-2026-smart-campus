import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getTechnicians } from '../api/ticketService';

const AssignModal = ({ isOpen, onClose, onAssign, ticketId }) => {
  const [technicians, setTechnicians] = useState([]);
  const [assignedToId, setAssignedToId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getTechnicians()
        .then(setTechnicians)
        .catch(() => alert('Failed to load technicians'))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedToId) return;
    onAssign(ticketId, parseInt(assignedToId));
    setAssignedToId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-2xl p-6 w-full max-w-lg mx-4">
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
                onChange={(e) => setAssignedToId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">-- Select a technician --</option>
                {technicians.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
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
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAvailableResources } from '../api/ticketService';

const TicketFormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'LOW',
    category: '',
    contactMethod: 'EMAIL',
    contactDetails: '',
    attachments: [],
    relatedBookingId: '',
    relatedResourceId: '',
  });

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);

  // Fetch available resources when modal opens
  useEffect(() => {
    if (isOpen) {
      setResourcesLoading(true);
      getAvailableResources()
        .then(setResources)
        .catch(() => alert('Failed to load resources'))
        .finally(() => setResourcesLoading(false));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    const allowedFiles = files.filter((file) =>
      ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
    );
    if (allowedFiles.length !== files.length) {
      alert('Only PNG and JPEG files are allowed.');
      return;
    }
    if (allowedFiles.length + formData.attachments.length > 3) {
      alert('You can attach up to 3 images only.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...allowedFiles],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '', description: '', priority: 'LOW', category: '',
      contactMethod: 'EMAIL', contactDetails: '', attachments: [],
      relatedBookingId: '', relatedResourceId: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Create New Ticket</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input type="text" name="title" value={formData.title}
              onChange={handleChange} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea name="description" value={formData.description}
              onChange={handleChange} required rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <input type="text" name="category" value={formData.category}
              onChange={handleChange} placeholder="e.g., Maintenance, Technical, General"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Contact Method</label>
            <select name="contactMethod" value={formData.contactMethod}
              onChange={handleChange} required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
              <option value="EMAIL">Email</option>
              <option value="PHONE">Phone</option>
              <option value="IN_PERSON">In Person</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Details</label>
            <input type="text" name="contactDetails" value={formData.contactDetails}
              onChange={handleChange} required
              placeholder={formData.contactMethod === 'PHONE' ? 'Phone number' : formData.contactMethod === 'EMAIL' ? 'Email address' : 'Location/Details'}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Resource dropdown — replaces raw ID input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Resource <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {resourcesLoading ? (
              <p className="text-sm text-slate-500">Loading resources...</p>
            ) : (
              <select name="relatedResourceId" value={formData.relatedResourceId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">-- None --</option>
                {resources.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} — {r.location} {r.building ? `(${r.building})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Keep booking ID as text for now — will fix when you share booking files */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Booking ID <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input type="number" name="relatedBookingId" value={formData.relatedBookingId}
              onChange={handleChange} placeholder="Enter booking ID if related"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Attachments <span className="text-slate-400 font-normal">(PNG/JPEG, max 3)</span>
            </label>
            <input type="file" accept="image/png,image/jpeg" multiple
              onChange={handleFileChange} className="w-full text-sm text-slate-600" />
            {formData.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 bg-slate-50">
                    <span className="text-sm text-slate-700 truncate">{file.name}</span>
                    <button type="button" onClick={() => removeAttachment(index)}
                      className="text-sm text-red-600 hover:text-red-800">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancel
            </button>
            <button type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
              Create Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketFormModal;
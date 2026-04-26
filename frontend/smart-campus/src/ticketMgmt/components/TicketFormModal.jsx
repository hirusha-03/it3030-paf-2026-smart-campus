import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getAvailableResources, getBookingsByUser } from '../api/ticketService';

const TicketFormModal = ({ isOpen, onClose, onSubmit, userId }) => {
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
  const [bookings, setBookings] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setResourcesLoading(true);
      getAvailableResources()
        .then(setResources)
        .catch(() => alert('Failed to load resources'))
        .finally(() => setResourcesLoading(false));

      if (userId) {
        setBookingsLoading(true);
        getBookingsByUser(userId)
          .then(setBookings)
          .catch(() => alert('Failed to load bookings'))
          .finally(() => setBookingsLoading(false));
      }
    }
  }, [isOpen, userId]);

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
      setErrorMsg('Only PNG and JPEG files are allowed.');
      return;
    }
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    for (const f of allowedFiles) {
      if (f.size > MAX_BYTES) {
        setErrorMsg(`${f.name} exceeds the 5 MB size limit.`);
        return;
      }
    }
    if (allowedFiles.length + formData.attachments.length > 3) {
      setErrorMsg('You can attach up to 3 images only.');
      return;
    }
    setErrorMsg('');
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...allowedFiles],
    }));
  };

  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    const synthetic = { target: { files } };
    handleFileChange(synthetic);
  };

  const handleDragOver = (e) => e.preventDefault();

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
              placeholder={
                formData.contactMethod === 'PHONE' ? 'Phone number' :
                formData.contactMethod === 'EMAIL' ? 'Email address' : 'Location/Details'
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>

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
                    {r.name} — {r.location}{r.building ? ` (${r.building})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Related Booking <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            {bookingsLoading ? (
              <p className="text-sm text-slate-500">Loading bookings...</p>
            ) : (
              <select name="relatedBookingId" value={formData.relatedBookingId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="">-- None --</option>
                {bookings.length === 0 ? (
                  <option disabled>No bookings found</option>
                ) : (
                  bookings.map((b) => (
                    <option key={b.bookingId} value={b.bookingId}>
                      #{b.bookingId} — {b.date} ({b.startTime} to {b.endTime}) — {b.purpose}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attachments <span className="text-slate-400 font-normal">(PNG/JPEG, max 3)</span></label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 flex items-center justify-center flex-col text-center bg-white hover:bg-slate-50 cursor-pointer"
            >
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" multiple
                onChange={handleFileChange} className="hidden" />
              <p className="text-sm text-slate-600">Drag & drop images here, or click to choose files</p>
              <p className="text-xs text-slate-400 mt-1">Maximum 3 images. PNG or JPEG only.</p>
            </div>
            {errorMsg && <p className="text-sm text-red-600 mt-2">{errorMsg}</p>}
            {formData.attachments.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex flex-col items-center rounded-lg border border-slate-200 p-2 bg-slate-50">
                    <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover rounded" />
                    <div className="w-full flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-700 truncate mr-2">{file.name}</span>
                      <button type="button" onClick={() => removeAttachment(index)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                    </div>
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
import { useState } from 'react';
import { createBooking } from '../api/bookingApi';

const initialFormData = {
  userId: 1,
  resourceIds: [],
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  expectedAttendees: '',
};

function BookingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [resourceIdsInput, setResourceIdsInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResourceIdsChange = (event) => {
    const value = event.target.value;
    setResourceIdsInput(value);

    const ids = value
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id !== '')
      .map(Number)
      .filter((id) => Number.isFinite(id));

    setFormData((prev) => ({
      ...prev,
      resourceIds: ids,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const payload = {
      ...formData,
      userId: 1,
      expectedAttendees:
        formData.expectedAttendees === ''
          ? null
          : Number(formData.expectedAttendees),
    };

    setIsSubmitting(true);

    try {
      await createBooking(payload);
      setSuccessMessage('Booking successful!');
      setFormData(initialFormData);
      setResourceIdsInput('');
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setErrorMessage(apiMessage || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Create Booking</h2>
      <p className="mt-1 text-sm text-gray-600">
        Fill in the booking details and submit your request.
      </p>

      {successMessage && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="resourceIds" className="mb-1 block text-sm font-medium text-gray-700">
            Resource IDs
          </label>
          <input
            id="resourceIds"
            type="text"
            value={resourceIdsInput}
            onChange={handleResourceIdsChange}
            placeholder="e.g. 1,2,3"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
          <p className="mt-1 text-xs text-gray-500">Enter one or more IDs separated by commas.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="expectedAttendees" className="mb-1 block text-sm font-medium text-gray-700">
              Expected Attendees
            </label>
            <input
              id="expectedAttendees"
              name="expectedAttendees"
              type="number"
              min="1"
              value={formData.expectedAttendees}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="startTime" className="mb-1 block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="mb-1 block text-sm font-medium text-gray-700">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="mb-1 block text-sm font-medium text-gray-700">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows="4"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Describe the purpose of this booking"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Create Booking'}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;

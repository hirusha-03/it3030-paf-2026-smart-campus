import { useState } from "react";

const initialFormState = {
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: "",
};

function BookingForm({ resources, selectedResourceId, onResourceChange, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(initialFormState);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const normalizeTime = (timeValue) => {
    if (!timeValue) {
      return "";
    }
    return timeValue.length === 5 ? `${timeValue}:00` : timeValue;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      userId: 1,
      resourceIds: [selectedResourceId],
      date: formData.date,
      startTime: normalizeTime(formData.startTime),
      endTime: normalizeTime(formData.endTime),
      purpose: formData.purpose,
      expectedAttendees: formData.expectedAttendees === "" ? null : Number(formData.expectedAttendees),
    };

    try {
      await onSubmit(payload);
      setFormData(initialFormState);
    } catch {
      // Error UI is handled by the parent page.
    }
  };

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Booking Details</h2>
        <p className="mt-2 text-sm text-slate-600">
          Complete the form below to send your request for the selected campus resource.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="resourceIds" className="mb-1 block text-sm font-semibold text-slate-700">
            Resource
          </label>
          <select
            id="resourceIds"
            name="resourceIds"
            value={selectedResourceId}
            onChange={onResourceChange}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          >
            {resources.map((resource) => (
              <option key={resource.id} value={resource.id}>
                {resource.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="date" className="mb-1 block text-sm font-semibold text-slate-700">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="expectedAttendees" className="mb-1 block text-sm font-semibold text-slate-700">
              Expected Attendees
            </label>
            <input
              id="expectedAttendees"
              name="expectedAttendees"
              type="number"
              min="1"
              value={formData.expectedAttendees}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="startTime" className="mb-1 block text-sm font-semibold text-slate-700">
              Start Time
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="mb-1 block text-sm font-semibold text-slate-700">
              End Time
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="purpose" className="mb-1 block text-sm font-semibold text-slate-700">
            Purpose
          </label>
          <textarea
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            rows={4}
            placeholder="Enter the purpose of this booking"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            required
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Create Booking"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookingForm;

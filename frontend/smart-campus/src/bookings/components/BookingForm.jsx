import { useState } from "react";
import { createBooking } from "../api/bookingApi";

const dummyResources = [
  { id: 101, name: "Lecture Hall A" },
  { id: 102, name: "Meeting Room 1" },
  { id: 103, name: "Computer Lab B" },
];

const initialFormState = {
  userId: 1,
  resourceIds: [dummyResources[0].id],
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: "",
};

function BookingForm({ onBookingCreated }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResourceChange = (event) => {
    const selectedResourceId = Number(event.target.value);
    setFormData((prev) => ({
      ...prev,
      resourceIds: [selectedResourceId],
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
    setSuccessMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    const payload = {
      userId: formData.userId,
      resourceIds: formData.resourceIds,
      date: formData.date,
      startTime: normalizeTime(formData.startTime),
      endTime: normalizeTime(formData.endTime),
      purpose: formData.purpose,
      expectedAttendees: formData.expectedAttendees === "" ? null : Number(formData.expectedAttendees),
    };

    try {
      const createdBooking = await createBooking(payload);
      setSuccessMessage("Booking successful!");
      setFormData(initialFormState);

      if (onBookingCreated) {
        onBookingCreated(createdBooking);
      }
    } catch (error) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Unable to create booking. Please check time conflicts and try again.";
      setErrorMessage(backendMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <main className="mx-auto w-full max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Request Campus Resource</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Submit a focused booking request by selecting a suitable venue, preferred time slot, and purpose details.
          </p>
        </header>

        <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Booking Details</h2>
            <p className="mt-2 text-sm text-slate-600">
              Complete the form below to send your request for the selected campus resource.
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="resourceIds" className="mb-1 block text-sm font-semibold text-slate-700">
                Resource
              </label>
              <select
                id="resourceIds"
                name="resourceIds"
                value={formData.resourceIds[0]}
                onChange={handleResourceChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                required
              >
                {dummyResources.map((resource) => (
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
      </main>
    </div>
  );
}

export default BookingForm;

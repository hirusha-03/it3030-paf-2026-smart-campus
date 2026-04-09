import { useState } from 'react';
import BookingForm from '../components/BookingForm';

function Bookings() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Use the button below to open the booking form.
        </p>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {showForm ? 'Close Booking Form' : 'Open Booking Form'}
        </button>
      </div>

      {showForm && <BookingForm />}
    </div>
  );
}

export default Bookings;
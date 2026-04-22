import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as bookingApi from '../api/bookingApi';

function formatDate(value) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatSingleTime(value) {
  if (!value) {
    return '-';
  }

  return value;
}

function getUserDisplay(booking) {
  if (!booking) {
    return { label: 'User', value: '-' };
  }

  if (booking.userName) {
    return { label: 'User Name', value: booking.userName };
  }

  if (booking.userId !== undefined && booking.userId !== null) {
    return { label: 'User ID', value: String(booking.userId) };
  }

  return { label: 'User', value: '-' };
}

function BookingVerificationPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBooking = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        if (!id) {
          throw new Error('Booking id is missing.');
        }

        if (typeof bookingApi.getBookingById !== 'function') {
          throw new Error('getBookingById(id) is not available yet in bookingApi.');
        }

        const data = await bookingApi.getBookingById(id);

        if (!data || typeof data !== 'object') {
          throw new Error('Booking not found.');
        }

        if ((data.status || '').toUpperCase() !== 'APPROVED') {
          throw new Error('This pass is not approved.');
        }

        if (isMounted) {
          setBooking(data);
        }
      } catch (error) {
        if (isMounted) {
          const backendMessage =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            'Invalid pass.';
          setErrorMessage(backendMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBooking();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const userDisplay = useMemo(() => getUserDisplay(booking), [booking]);

  if (loading) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-100 via-emerald-50 to-slate-100 px-4 py-10">
        <div className="mx-auto flex w-full max-w-md items-center justify-center rounded-3xl border border-slate-200 bg-white/90 p-12 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
            <p className="text-sm font-semibold text-slate-700">Validating your digital pass...</p>
          </div>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-linear-to-b from-slate-100 via-rose-50 to-slate-100 px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-2xl">
          <p className="inline-flex rounded-full border border-rose-300 bg-rose-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-rose-700">
            Invalid Pass
          </p>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Pass verification failed</h1>
          <p className="mt-3 text-sm text-slate-600">{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-100 via-emerald-50 to-slate-100 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-md">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100/60" />
          <div className="absolute -left-20 bottom-16 h-44 w-44 rounded-full bg-sky-100/50" />

          <div className="relative p-6 sm:p-8">
            <p className="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-4 py-1 text-xs font-bold uppercase tracking-widest text-emerald-800">
              Verified & Approved
            </p>

            <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Digital Booking Pass</h1>
            <p className="mt-1 text-sm text-slate-600">Present this pass at check-in.</p>

            <div className="my-5 border-t border-dashed border-slate-300" />

            <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking ID</dt>
                <dd className="mt-1 font-bold text-slate-900">{booking?.bookingId ?? '-'}</dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resource</dt>
                <dd className="mt-1 font-bold text-slate-900">
                  {Array.isArray(booking?.resourceNames) && booking.resourceNames.length > 0
                    ? booking.resourceNames.join(', ')
                    : '-'}
                </dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</dt>
                <dd className="mt-1 font-bold text-slate-900">
                  {Array.isArray(booking?.resourceLocations) && booking.resourceLocations.length > 0
                    ? booking.resourceLocations.join(', ')
                    : '-'}
                </dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</dt>
                <dd className="mt-1 font-bold text-slate-900">{formatDate(booking?.date)}</dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Start Time</dt>
                <dd className="mt-1 font-bold text-slate-900">{formatSingleTime(booking?.startTime)}</dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">End Time</dt>
                <dd className="mt-1 font-bold text-slate-900">{formatSingleTime(booking?.endTime)}</dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendees</dt>
                <dd className="mt-1 font-bold text-slate-900">{booking?.expectedAttendees ?? '-'}</dd>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{userDisplay.label}</dt>
                <dd className="mt-1 font-bold text-slate-900 wrap-break-word">{userDisplay.value}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </main>
  );
}

export default BookingVerificationPage;

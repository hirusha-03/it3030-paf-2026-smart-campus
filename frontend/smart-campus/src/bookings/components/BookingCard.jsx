import StatusBadge from './StatusBadge';
import BookingQRCode from './BookingQRCode';

function formatTime(timeValue) {
  if (!timeValue) {
    return '--';
  }

  const [hourString = '0', minuteString = '0'] = String(timeValue).split(':');
  const hours = Number(hourString);
  const minutes = Number(minuteString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return '--';
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function BookingCard({ booking, onCancel, isCancelling }) {
  const canCancel = booking?.status === 'APPROVED';
  const showQRCode = booking?.status === 'APPROVED';
  const resourceLabel = Array.isArray(booking?.resourceNames) && booking.resourceNames.length > 0
    ? booking.resourceNames.join(', ')
    : (typeof booking?.resourceName === 'string' && booking.resourceName.trim())
      ? booking.resourceName
    : '--';

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                {resourceLabel}
              </h3>
            </div>
            <StatusBadge status={booking.status} />
          </div>

          <dl className="mt-5 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</dt>
              <dd className="mt-1 text-sm text-slate-800">{formatDate(booking.date)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Time</dt>
              <dd className="mt-1 text-sm text-slate-800">
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expected Attendees</dt>
              <dd className="mt-1 text-sm text-slate-800">{booking.expectedAttendees ?? '--'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose</dt>
              <dd className="mt-1 text-sm text-slate-800">{booking.purpose || '--'}</dd>
            </div>
          </dl>

          {booking.status === 'REJECTED' && booking.rejectionReason && (
            <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              <span className="font-semibold">Rejection reason:</span> {booking.rejectionReason}
            </div>
          )}

          {canCancel && (
            <div className="mt-5">
              <button
                type="button"
                onClick={() => onCancel(booking.bookingId)}
                disabled={isCancelling}
                className="inline-flex items-center rounded-lg border border-rose-300 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          )}
        </div>
        {showQRCode && (
          <div className="self-center lg:self-start">
            <h4 className="mb-2 text-center text-sm font-semibold text-slate-700 lg:text-left">
              Check-in Pass
            </h4>
            <BookingQRCode booking={booking} />
          </div>
        )}
      </div>
    </article>
  );
}

export default BookingCard;
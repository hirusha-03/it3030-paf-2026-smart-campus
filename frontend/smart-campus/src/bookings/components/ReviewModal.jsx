import { useEffect, useMemo, useState } from "react";

function formatDate(dateValue) {
  if (!dateValue) {
    return "--";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTime(timeValue) {
  if (!timeValue) {
    return "--";
  }

  const [hourString = "0", minuteString = "0"] = String(timeValue).split(":");
  const hours = Number(hourString);
  const minutes = Number(minuteString);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return timeValue;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function ReviewModal({ booking, isOpen, onClose, onApprove, onReject }) {
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRejectMode(false);
      setRejectionReason("");
      setSubmitting(false);
    }
  }, [isOpen, booking?.bookingId]);

  const canSubmitReject = useMemo(() => rejectionReason.trim().length > 0, [rejectionReason]);

  if (!isOpen || !booking) {
    return null;
  }

  const resourceLabel = Array.isArray(booking.resourceIds) && booking.resourceIds.length > 0
    ? Array.isArray(booking.resourceNames) && booking.resourceNames.length > 0
      ? booking.resourceNames.join(", ")
      : booking.resourceIds.join(", ")
    : "--";

  const handleApprove = async () => {
    setSubmitting(true);
    try {
      await onApprove(booking);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectClick = () => {
    setIsRejectMode(true);
  };

  const handleConfirmReject = async () => {
    if (!canSubmitReject) {
      return;
    }

    setSubmitting(true);
    try {
      await onReject(booking, rejectionReason.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-slate-900">Review Booking Request</h2>
        </div>

        <dl className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">User</dt>
            <dd className="mt-1 text-sm text-slate-800">
              {booking.userName || "Unknown user"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Resource</dt>
            <dd className="mt-1 text-sm text-slate-800">{resourceLabel}</dd>
          </div>
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
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attendees</dt>
            <dd className="mt-1 text-sm text-slate-800">{booking.expectedAttendees ?? "--"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Purpose</dt>
            <dd className="mt-1 text-sm text-slate-800">{booking.purpose || "--"}</dd>
          </div>
        </dl>

        {isRejectMode && (
          <div className="mt-4">
            <label htmlFor="rejection-reason" className="block text-sm font-semibold text-slate-700">
              Rejection Reason
            </label>
            <textarea
              id="rejection-reason"
              rows={4}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="Please provide a reason for rejecting this request"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <p className="mt-1 text-xs text-slate-500">Reason is required before final rejection.</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleApprove}
            disabled={submitting || isRejectMode}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Approve
          </button>

          {!isRejectMode ? (
            <button
              type="button"
              onClick={handleRejectClick}
              disabled={submitting}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reject
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={submitting || !canSubmitReject}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Submit Rejection
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRejectMode ? "Cancel" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;

function formatDate(dateValue) {
  if (!dateValue) {
    return "--";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatTimeRange(startTime, endTime) {
  if (!startTime && !endTime) {
    return "--";
  }

  const formatTime = (timeValue) => {
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
  };

  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

function getStatusClasses(status) {
  const normalizedStatus = typeof status === "string" ? status.toUpperCase() : "PENDING";

  if (normalizedStatus === "APPROVED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedStatus === "REJECTED") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-amber-200 bg-amber-50 text-amber-700";
}

function BookingTable({ bookings, onReviewClick }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Resource</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Date</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Time</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Purpose</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                  No bookings found for this filter.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const normalizedStatus = typeof booking.status === "string"
                  ? booking.status.toUpperCase()
                  : "PENDING";
                const resourceLabel = Array.isArray(booking.resourceNames) && booking.resourceNames.length > 0
                  ? booking.resourceNames.join(", ")
                  : Array.isArray(booking.resourceIds) && booking.resourceIds.length > 0
                    ? booking.resourceIds.join(", ")
                  : "--";

                return (
                  <tr key={booking.bookingId} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 text-sm text-slate-700">{resourceLabel}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                      {formatDate(booking.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">{booking.purpose || "--"}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${getStatusClasses(normalizedStatus)}`}
                      >
                        {normalizedStatus}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onReviewClick(booking)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingTable;

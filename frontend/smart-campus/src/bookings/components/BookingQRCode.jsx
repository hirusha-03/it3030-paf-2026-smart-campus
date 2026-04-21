import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';

function BookingQRCode({ booking }) {
  const qrValue = useMemo(() => {
    if (!booking) {
      return JSON.stringify({
        bookingId: null,
        userId: null,
        date: null,
        time: null,
      });
    }

    return JSON.stringify({
      bookingId: booking.bookingId ?? null,
      userId: booking.userId ?? null,
      date: booking.date ?? null,
      time: {
        start: booking.startTime ?? null,
        end: booking.endTime ?? null,
      },
    });
  }, [booking]);

  return (
    <section className="inline-flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-white">
      <div className="rounded-xl bg-white p-2">
        <QRCodeSVG
          value={qrValue}
          size={180}
          includeMargin
          className="h-auto w-full max-w-45"
        />
      </div>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-600">
        Scan to Verify
      </p>
    </section>
  );
}

export default BookingQRCode;

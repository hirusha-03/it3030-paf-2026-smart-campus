import { QRCodeSVG } from 'qrcode.react';
import { useMemo } from 'react';

function BookingQRCode({ booking }) {
  const verificationUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const bookingId = booking?.bookingId;

    if (!bookingId) {
      return `${origin}/verify`;
    }

    return `${origin}/verify/${bookingId}`;
  }, [booking?.bookingId]);

  return (
    <section className="inline-flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-white">
      <div className="rounded-xl bg-white p-2">
        <QRCodeSVG
          value={verificationUrl}
          size={180}
          includeMargin
          className="h-auto w-full max-w-45"
        />
      </div>
      <p className="mt-3 text-xs font-medium tracking-wide text-slate-600">
        Scan to open digital pass
      </p>
    </section>
  );
}

export default BookingQRCode;

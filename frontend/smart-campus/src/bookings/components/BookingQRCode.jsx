import { QRCodeSVG } from 'qrcode.react';
import { useMemo, useRef, useState } from 'react';

function BookingQRCode({ booking }) {
  const containerRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const verificationUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const bookingId = booking?.bookingId;

    if (!bookingId) {
      return `${origin}/verify`;
    }

    return `${origin}/verify/${bookingId}`;
  }, [booking?.bookingId]);

  const handleDownload = async () => {
    const svgElement = containerRef.current?.querySelector('svg');
    if (!svgElement || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    setIsDownloading(true);

    try {
      const serializer = new XMLSerializer();
      const svgText = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      const size = 720;
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Canvas context unavailable');
      }

      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, size, size);
      context.drawImage(image, 0, 0, size, size);

      URL.revokeObjectURL(svgUrl);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `booking-pass-${booking?.bookingId ?? 'qr'}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch {
      const serializer = new XMLSerializer();
      const svgText = serializer.serializeToString(svgElement);
      const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      const fallbackLink = document.createElement('a');
      fallbackLink.href = svgDataUrl;
      fallbackLink.download = `booking-pass-${booking?.bookingId ?? 'qr'}.svg`;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      document.body.removeChild(fallbackLink);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="inline-flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-white">
      <div ref={containerRef} className="rounded-xl bg-white p-2">
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
      <button
        type="button"
        onClick={handleDownload}
        disabled={isDownloading}
        className="mt-3 inline-flex items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isDownloading ? 'Preparing...' : 'Download QR'}
      </button>
    </section>
  );
}

export default BookingQRCode;

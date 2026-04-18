const STATUS_CLASSES = {
  PENDING: 'border-amber-200 bg-amber-50 text-amber-700',
  APPROVED: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
};

function StatusBadge({ status }) {
  const normalizedStatus = typeof status === 'string' ? status.toUpperCase() : 'PENDING';
  const classes = STATUS_CLASSES[normalizedStatus] || 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold tracking-wide ${classes}`}>
      {normalizedStatus}
    </span>
  );
}

export default StatusBadge;
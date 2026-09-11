export const Badge = ({ status, className = '' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          dot: 'bg-emerald-500',
        };
      case 'Booked':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
          dot: 'bg-amber-500',
        };
      case 'Maintenance':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
          dot: 'bg-rose-500',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          dot: 'bg-slate-400',
        };
    }
  };

  const style = getStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot} animate-pulse`} />
      <span>{status}</span>
    </span>
  );
};

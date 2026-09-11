export const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  colorScheme = 'crimson',
  subtitle,
  onClick,
}) => {
  // Color configuration
  const colorMap = {
    crimson: {
      iconBg: 'bg-red-500/10 text-red-600 ring-red-500/20',
      accentBorder: 'hover:border-red-300',
    },
    red: {
      iconBg: 'bg-red-500/10 text-red-600 ring-red-500/20',
      accentBorder: 'hover:border-red-300',
    },
    rose: {
      iconBg: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
      accentBorder: 'hover:border-rose-300',
    },
    amber: {
      iconBg: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
      accentBorder: 'hover:border-amber-300',
    },
    emerald: {
      iconBg: 'bg-emerald-500/10 text-emerald-600 ring-emerald-500/20',
      accentBorder: 'hover:border-emerald-300',
    },
    indigo: {
      iconBg: 'bg-red-500/10 text-red-600 ring-red-500/20',
      accentBorder: 'hover:border-red-300',
    },
    cyan: {
      iconBg: 'bg-rose-500/10 text-rose-600 ring-rose-500/20',
      accentBorder: 'hover:border-rose-300',
    },
    violet: {
      iconBg: 'bg-amber-500/10 text-amber-600 ring-amber-500/20',
      accentBorder: 'hover:border-amber-300',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.crimson;

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${scheme.accentBorder}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ring-1 ${scheme.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
          <span
            className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded-md ${
              Number(trend) >= 0
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {Number(trend) >= 0 ? `+${trend}%` : `${trend}%`}
          </span>
          <span className="text-slate-500 font-medium">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};

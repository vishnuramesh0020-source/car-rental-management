import { AlertCircle, RefreshCw } from 'lucide-react';

export const LoadingSpinner = ({ label = 'Loading...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-red-600 animate-spin" />
      </div>
      {label && <p className="mt-4 text-sm font-semibold text-slate-600">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const CarCardSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs animate-pulse">
      <div className="h-52 bg-slate-200 w-full" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-5 bg-slate-200 rounded-md w-1/2" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-6 bg-slate-200 rounded w-24" />
          <div className="h-9 bg-slate-200 rounded-xl w-28" />
        </div>
      </div>
    </div>
  );
};

export const ErrorState = ({
  message = 'Failed to load data.',
  onRetry,
}) => {
  return (
    <div className="bg-rose-50/60 border border-rose-200 rounded-3xl p-8 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900">Something went wrong</h3>
      <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

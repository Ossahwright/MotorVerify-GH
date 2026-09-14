import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry: () => void;
  onReset: () => void;
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry, onReset, message }) => {
  return (
    <div
      className="w-full bg-white rounded-xl border border-red-200 shadow-sm p-8 sm:p-10 text-center my-6"
      role="alert"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 text-red-700 mb-5">
        <AlertTriangle className="w-7 h-7" aria-hidden="true" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">
        WE COULDN'T COMPLETE THE VERIFICATION
      </h2>

      <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
        {message || 'Please try again shortly.'}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 outline-none cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>TRY AGAIN</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm px-5 py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 outline-none cursor-pointer"
        >
          <span>CHECK ANOTHER VEHICLE</span>
        </button>
      </div>
    </div>
  );
};

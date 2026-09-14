import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  registration: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ registration }) => {
  return (
    <div
      className="w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center my-6"
      role="status"
      aria-live="polite"
    >
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-900 mb-5">
        <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
      </div>

      <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase mb-2">
        VERIFYING VEHICLE INSURANCE...
      </h2>

      <p className="text-slate-600 text-sm font-medium mb-3">
        Checking the NIC Motor Insurance Database.
      </p>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-700">
        <span>Registration:</span>
        <span className="text-blue-900 font-bold">{registration}</span>
      </div>
    </div>
  );
};



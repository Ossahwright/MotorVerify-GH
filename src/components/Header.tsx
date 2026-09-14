import React from 'react';
import { ShieldCheck, Car } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-blue-900 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 text-blue-300" aria-hidden="true" />
          </div>
          <div>
            <span className="block text-base sm:text-lg font-extrabold tracking-tight text-slate-900 uppercase">
              MOTORVERIFY GH
            </span>
            <span className="block text-xs font-medium text-slate-500">
              Ghana&apos;s Motor Insurance Verification Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <Car className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
          <span>NIC Motor Insurance Database</span>
        </div>
      </div>
    </header>
  );
};


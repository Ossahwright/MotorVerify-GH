import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Search, ShieldAlert, ArrowRight } from 'lucide-react';

interface VerificationFormProps {
  onSubmit: (registration: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  onSubmit,
  isLoading,
  initialValue = '',
}) => {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Allow uppercase letters, digits, spaces, and hyphens typical of Ghana vehicle registrations
    const formatted = rawVal.toUpperCase();
    setInputValue(formatted);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim().toUpperCase();

    if (!trimmed) {
      setErrorMessage('Please enter a vehicle registration number to verify.');
      return;
    }

    if (trimmed.length < 3) {
      setErrorMessage('Please enter a valid Ghana registration number (e.g., GS 638-24).');
      return;
    }

    setErrorMessage(null);
    onSubmit(trimmed);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
          Verify Motor Insurance
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Check vehicle insurance status using the Ghana National Insurance Commission (NIC) public Motor Insurance Database.
        </p>
      </div>

      {/* Verification Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleFormSubmit} noValidate>
          <div className="mb-6">
            <label
              htmlFor="vehicle-registration-input"
              className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-2"
            >
              Enter Vehicle Registration Number
            </label>

            <div className="relative">
              <input
                id="vehicle-registration-input"
                type="text"
                autoComplete="off"
                spellCheck="false"
                value={inputValue}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="e.g. GS 638-24"
                aria-describedby={errorMessage ? 'registration-error-msg' : undefined}
                className={`w-full text-base sm:text-lg font-mono font-medium px-4 py-3.5 rounded-lg border transition-all text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none ${
                  errorMessage
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-slate-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-600'
                } disabled:bg-slate-100 disabled:text-slate-400`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Search className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>

            {errorMessage ? (
              <div
                id="registration-error-msg"
                role="alert"
                className="flex items-center gap-1.5 mt-2.5 text-xs font-semibold text-red-600"
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-slate-500">
                Enter registration with or without spaces/hyphens (e.g., GS 638-24, GS638-24, GT 5544-23).
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 hover:bg-blue-950 active:bg-blue-950 text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-700 focus:ring-offset-2 outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            <span>VERIFY INSURANCE</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};


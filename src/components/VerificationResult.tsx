import React from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Calendar,
  Building2,
  Car,
  RotateCcw,
  Printer,
  FileText,
  Layers,
} from 'lucide-react';
import { VerificationResult as VerificationResultType } from '../types/verification';

interface VerificationResultProps {
  result: VerificationResultType;
  onReset: () => void;
  onRetry: () => void;
}

function formatVerifiedTimestamp(timestampStr: string): string {
  if (!timestampStr) return '—';
  try {
    const d = new Date(timestampStr);
    if (isNaN(d.getTime())) {
      return timestampStr;
    }
    const dateStr = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(d);
    return `${dateStr} • ${timeStr}`;
  } catch {
    return timestampStr;
  }
}

export const VerificationResult: React.FC<VerificationResultProps> = ({
  result,
  onReset,
  onRetry,
}) => {
  const {
    status,
    registration,
    insurer,
    expiryDate,
    vehicle,
    multipleRecords,
    records,
    rawResponse,
    reference,
    verifiedAt,
    source,
    channel,
    verificationId,
  } = result;

  const formattedVerifiedAt = formatVerifiedTimestamp(verifiedAt);
  const displayReference = reference || '—';

  const handlePrint = () => {
    window.print();
  };

  // Reusable Audit & Provider Trace section (Permanently visible on screen and included in print document)
  const renderAuditTrace = () => (
    <div className="audit-trace mt-6 pt-4 border-t border-slate-200 text-left">
      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
        <FileText className="w-3.5 h-3.5 text-slate-500" />
        <span>AUDIT &amp; PROVIDER TRACE</span>
      </div>
      <div className="text-xs font-mono bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-slate-600 space-y-1.5">
        <div>
          <span className="font-semibold text-slate-700">Verification Reference:</span> {displayReference}
        </div>
        {verificationId && (
          <div>
            <span className="font-semibold text-slate-700">Firestore Verification ID:</span> {verificationId}
          </div>
        )}
        <div>
          <span className="font-semibold text-slate-700">Provider Source:</span> {source || 'NIC_PUBLIC_USSD'}
        </div>
        <div>
          <span className="font-semibold text-slate-700">Channel:</span> {channel || 'WEB'}
        </div>
        {rawResponse && (
          <div className="mt-2 pt-2 border-t border-slate-200">
            <span className="block font-semibold text-slate-700 mb-1">Raw NIC Response:</span>
            <pre className="whitespace-pre-wrap font-mono text-slate-600 text-[11px] leading-relaxed">
              {rawResponse}
            </pre>
          </div>
        )}
      </div>
    </div>
  );

  // Case 1: Multiple Records Found
  if ((multipleRecords && records && records.length > 0) || (status as string) === 'MULTIPLE_RECORDS') {
    const recordsList = records || [];
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden my-6 printable-card">
        {/* Printable Official Header */}
        <div className="hidden print-only mb-6 border-b border-slate-300 pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            MOTORVERIFY GH
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
            Ghana&apos;s Motor Insurance Verification Platform
          </p>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 mt-2">
            MOTOR INSURANCE VERIFICATION
          </h2>
        </div>

        {/* Screen Banner (no-print) */}
        <div className="bg-amber-600 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-amber-100" />
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
              MULTIPLE INSURANCE RECORDS FOUND
            </h2>
          </div>
          <span className="text-xs font-semibold bg-amber-700/60 px-2.5 py-1 rounded">
            {recordsList.length} Records
          </span>
        </div>

        {/* Print-only Status Indicator */}
        <div className="hidden print-only mb-4 p-3 bg-amber-50 border border-amber-300 rounded text-amber-950 font-bold text-sm text-center uppercase">
          Insurance Status: MULTIPLE RECORDS FOUND
        </div>

        <div className="p-6 sm:p-8">
          {/* Registration Header */}
          <div className="border-b border-slate-200 pb-4 mb-6 text-center sm:text-left">
            <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Vehicle Registration Number
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900">
              {registration}
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Multiple insurance records were returned for this registration from the NIC database.
            </p>
          </div>

          {/* Records List */}
          {recordsList.length > 0 && (
            <div className="space-y-4 mb-6">
              {recordsList.map((record, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                      RECORD {index + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {record.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 mb-0.5 uppercase">INSURER</span>
                      <span className="font-semibold text-slate-900">{record.insurer || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-500 mb-0.5 uppercase">VEHICLE</span>
                      <span className="font-semibold text-slate-900">{record.vehicle || '—'}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-500 mb-0.5 uppercase">EXPIRY DATE</span>
                      <span className="font-semibold text-slate-900">{record.expiryDate || '—'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Verification Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFICATION REFERENCE
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {displayReference}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFIED
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                {formattedVerifiedAt}
              </span>
            </div>
          </div>

          {/* Verification Source */}
          <div className="mb-6 pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
              VERIFICATION SOURCE
            </span>
            <p className="text-xs text-slate-600">
              Verification performed through the NIC public motor insurance verification channel (Ghana National Insurance Commission Motor Insurance Database).
            </p>
          </div>

          {/* Audit & Provider Trace (Permanently open) */}
          {renderAuditTrace()}

          {/* Action Buttons (no-print) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 no-print">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHECK ANOTHER VEHICLE</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="print-verification-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer focus:ring-2 focus:ring-slate-400 outline-none"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>PRINT VERIFICATION</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: ACTIVE Policy Result
  if (status === 'ACTIVE') {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden my-6 printable-card">
        {/* Printable Official Header (visible during print) */}
        <div className="hidden print-only mb-6 border-b border-slate-300 pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            MOTORVERIFY GH
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
            Ghana&apos;s Motor Insurance Verification Platform
          </p>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 mt-2">
            MOTOR INSURANCE VERIFICATION
          </h2>
        </div>

        {/* Status Header Banner (Screen mode) */}
        <div className="bg-emerald-700 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-100" aria-hidden="true" />
            <div>
              <span className="block text-[11px] font-semibold text-emerald-200 uppercase tracking-wider">
                INSURANCE STATUS
              </span>
              <h2 className="text-lg font-bold tracking-wide uppercase">
                ACTIVE
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800/80 px-2.5 py-1 rounded">
            ✓ ACTIVE
          </span>
        </div>

        {/* Print-only Status Indicator */}
        <div className="hidden print-only mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-950 font-bold text-sm text-center uppercase">
          Insurance Status: ACTIVE
        </div>

        <div className="p-6 sm:p-8">
          {/* Registration Plate Display */}
          <div className="text-center py-4 px-6 bg-slate-50 rounded-lg border border-slate-200 mb-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Registration Number
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-wider text-slate-900">
              {registration}
            </div>
          </div>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            {/* Insurer Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                <Building2 className="w-4 h-4 text-blue-700 no-print" />
                <span>INSURER</span>
              </div>
              <div className="text-lg font-bold text-slate-900">
                {insurer || '—'}
              </div>
            </div>

            {/* Expiry Date Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                <Calendar className="w-4 h-4 text-blue-700 no-print" />
                <span>INSURANCE EXPIRY</span>
              </div>
              <div className="text-lg font-bold text-emerald-700">
                {expiryDate || '—'}
              </div>
            </div>

            {/* Vehicle Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 sm:col-span-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                <Car className="w-4 h-4 text-blue-700 no-print" />
                <span>VEHICLE</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900">
                {vehicle || '—'}
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFICATION REFERENCE
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {displayReference}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFIED
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                {formattedVerifiedAt}
              </span>
            </div>
          </div>

          {/* Verification Source */}
          <div className="mb-6 pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
              VERIFICATION SOURCE
            </span>
            <p className="text-xs text-slate-600">
              Verification performed through the NIC public motor insurance verification channel (Ghana National Insurance Commission Motor Insurance Database).
            </p>
          </div>

          {/* Audit & Provider Trace (Permanently open) */}
          {renderAuditTrace()}

          {/* Action Buttons (no-print) */}
          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHECK ANOTHER VEHICLE</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="print-verification-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer focus:ring-2 focus:ring-slate-400 outline-none"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>PRINT VERIFICATION</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: NOT_FOUND Result
  if (status === 'NOT_FOUND') {
    return (
      <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden my-6 printable-card">
        {/* Printable Official Header (visible during print) */}
        <div className="hidden print-only mb-6 border-b border-slate-300 pb-4 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
            MOTORVERIFY GH
          </h1>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
            Ghana&apos;s Motor Insurance Verification Platform
          </p>
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 mt-2">
            MOTOR INSURANCE VERIFICATION
          </h2>
        </div>

        {/* Banner (Screen mode) */}
        <div className="bg-slate-700 px-6 py-4 text-white flex items-center justify-between no-print">
          <div className="flex items-center space-x-2.5">
            <XCircle className="w-6 h-6 text-slate-300" aria-hidden="true" />
            <div>
              <span className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                INSURANCE STATUS
              </span>
              <h2 className="text-base sm:text-lg font-bold tracking-wide uppercase">
                NO INSURANCE RECORD FOUND
              </h2>
            </div>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider bg-slate-800 px-2.5 py-1 rounded">
            NOT FOUND
          </span>
        </div>

        {/* Print-only Status Indicator */}
        <div className="hidden print-only mb-4 p-3 bg-slate-100 border border-slate-300 rounded text-slate-950 font-bold text-sm text-center uppercase">
          Insurance Status: NO INSURANCE RECORD FOUND
        </div>

        <div className="p-6 sm:p-8 text-center">
          <div className="max-w-md mx-auto mb-6">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Registration Number
            </span>
            <div className="text-3xl sm:text-4xl font-mono font-extrabold text-slate-900 mb-4">
              {registration}
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              No insurance information was found for this vehicle in the NIC Motor Insurance Database.
            </p>
          </div>

          {/* Verification Details */}
          <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFICATION REFERENCE
              </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {displayReference}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
                VERIFIED
              </span>
              <span className="font-semibold text-slate-800 text-sm">
                {formattedVerifiedAt}
              </span>
            </div>
          </div>

          {/* Verification Source */}
          <div className="max-w-md mx-auto text-left mb-6 pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
              VERIFICATION SOURCE
            </span>
            <p className="text-xs text-slate-600">
              Verification performed through the NIC public motor insurance verification channel (Ghana National Insurance Commission Motor Insurance Database).
            </p>
          </div>

          {/* Audit & Provider Trace (Permanently open) */}
          <div className="max-w-md mx-auto">
            {renderAuditTrace()}
          </div>

          {/* Actions (no-print) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-100 no-print">
            <button
              type="button"
              onClick={onReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <RotateCcw className="w-4 h-4" />
              <span>CHECK ANOTHER VEHICLE</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="print-verification-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer focus:ring-2 focus:ring-slate-400 outline-none"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>PRINT VERIFICATION</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: UNKNOWN Result
  return (
    <div className="w-full bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden my-6 printable-card">
      {/* Printable Official Header (visible during print) */}
      <div className="hidden print-only mb-6 border-b border-slate-300 pb-4 text-center">
        <h1 className="text-xl font-bold uppercase tracking-wider text-slate-900">
          MOTORVERIFY GH
        </h1>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
          Ghana&apos;s Motor Insurance Verification Platform
        </p>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 mt-2">
          MOTOR INSURANCE VERIFICATION
        </h2>
      </div>

      <div className="bg-amber-600 px-6 py-4 text-white flex items-center justify-between no-print">
        <div className="flex items-center space-x-2.5">
          <HelpCircle className="w-6 h-6 text-amber-100" aria-hidden="true" />
          <div>
            <span className="block text-[11px] font-semibold text-amber-200 uppercase tracking-wider">
              VERIFICATION STATUS
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-wide uppercase">
              UNABLE TO DETERMINE
            </h2>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider bg-amber-700 px-2.5 py-1 rounded">
          UNKNOWN
        </span>
      </div>

      {/* Print-only Status Indicator */}
      <div className="hidden print-only mb-4 p-3 bg-amber-50 border border-amber-300 rounded text-amber-950 font-bold text-sm text-center uppercase">
        Verification Status: UNABLE TO DETERMINE
      </div>

      <div className="p-6 sm:p-8 text-center">
        <div className="max-w-md mx-auto mb-6">
          <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Vehicle Registration Number
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold text-slate-900 mb-3">
            {registration}
          </div>

          <p className="text-slate-600 text-sm leading-relaxed">
            The NIC verification service returned a response that could not be fully determined.
          </p>
        </div>

        {/* Verification Details */}
        <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-left">
          <div>
            <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
              VERIFICATION REFERENCE
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {displayReference}
            </span>
          </div>
          <div>
            <span className="block font-bold text-slate-500 uppercase tracking-wide text-[11px] mb-0.5">
              VERIFIED
            </span>
            <span className="font-semibold text-slate-800 text-sm">
              {formattedVerifiedAt}
            </span>
          </div>
        </div>

        {/* Verification Source */}
        <div className="max-w-md mx-auto text-left mb-6 pt-3 border-t border-slate-100">
          <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">
            VERIFICATION SOURCE
          </span>
          <p className="text-xs text-slate-600">
            Verification performed through the NIC public motor insurance verification channel (Ghana National Insurance Commission Motor Insurance Database).
          </p>
        </div>

        {/* Audit & Provider Trace (Permanently open) */}
        <div className="max-w-md mx-auto">
          {renderAuditTrace()}
        </div>

        {/* Actions (no-print) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onRetry}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-700 outline-none"
          >
            <span>TRY AGAIN</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="print-verification-button w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm px-5 py-2.5 rounded-lg border border-slate-200 transition-colors cursor-pointer focus:ring-2 focus:ring-slate-400 outline-none"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>PRINT VERIFICATION</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto inline-flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <span>CHECK ANOTHER VEHICLE</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Header } from './components/Header';
import { VerificationForm } from './components/VerificationForm';
import { VerificationResult } from './components/VerificationResult';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { verifyVehicle, VerificationServiceError } from './services/verificationService';
import { VerificationResult as VerificationResultType } from './types/verification';

export default function App() {
  const [currentRegistration, setCurrentRegistration] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResultType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (registration: string) => {
    const trimmed = registration.trim().toUpperCase();
    if (!trimmed) return;

    setCurrentRegistration(trimmed);
    setIsLoading(true);
    setErrorMessage(null);
    setVerificationResult(null);

    try {
      const data = await verifyVehicle(trimmed);
      setVerificationResult(data);
    } catch (err: unknown) {
      if (err instanceof VerificationServiceError) {
        setErrorMessage(err.userFriendlyMessage);
      } else {
        setErrorMessage("We couldn't complete the verification. Please try again shortly.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVerificationResult(null);
    setErrorMessage(null);
    setIsLoading(false);
  };

  const handleRetry = () => {
    if (currentRegistration) {
      handleVerify(currentRegistration);
    } else {
      handleReset();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        {/* Loading State */}
        {isLoading && (
          <LoadingState registration={currentRegistration} />
        )}

        {/* Error State */}
        {!isLoading && errorMessage && (
          <ErrorState
            message={errorMessage}
            onRetry={handleRetry}
            onReset={handleReset}
          />
        )}

        {/* Result State */}
        {!isLoading && !errorMessage && verificationResult && (
          <VerificationResult
            result={verificationResult}
            onReset={handleReset}
            onRetry={handleRetry}
          />
        )}

        {/* Form State (when not viewing a result) */}
        {!isLoading && !errorMessage && !verificationResult && (
          <VerificationForm
            onSubmit={handleVerify}
            isLoading={isLoading}
            initialValue={currentRegistration}
          />
        )}
      </main>

      {/* Trust & Compliance Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 mt-auto no-print">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 text-center sm:text-left">
          <span>
            <strong className="text-slate-700">MOTORVERIFY GH</strong> — Ghana&apos;s Motor Insurance Verification Platform
          </span>
          <span>
            Verification performed through the NIC public motor insurance verification channel.
          </span>
        </div>
      </footer>
    </div>
  );
}



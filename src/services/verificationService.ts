import { VerificationResult, HealthCheckResult } from '../types/verification';

/**
 * Gets the configured base API URL or falls back to empty string (relative to current origin).
 */
function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return 'http://localhost:3000';
}

export class VerificationServiceError extends Error {
  public code?: string;
  public userFriendlyMessage: string;

  constructor(userFriendlyMessage: string, code?: string) {
    super(userFriendlyMessage);
    this.name = 'VerificationServiceError';
    this.userFriendlyMessage = userFriendlyMessage;
    this.code = code;
  }
}

/**
 * Verifies motor insurance status for a given vehicle registration number.
 * Communicates strictly with the Express backend REST endpoint:
 * GET /api/verify?registration=<encoded_reg>
 */
export async function verifyVehicle(registration: string): Promise<VerificationResult> {
  const trimmed = registration.trim().toUpperCase();
  if (!trimmed) {
    throw new VerificationServiceError('Please enter a valid vehicle registration number.');
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/verify?registration=${encodeURIComponent(trimmed)}`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      let serverErrorMessage = '';
      try {
        const errorJson = await response.json();
        serverErrorMessage = errorJson.error || errorJson.message || '';
      } catch {
        // Response was not JSON
      }

      if (response.status === 409 || serverErrorMessage.toLowerCase().includes('in progress')) {
        throw new VerificationServiceError(
          serverErrorMessage || 'Another vehicle verification is currently in progress. Please try again shortly.',
          'SESSION_IN_PROGRESS'
        );
      }

      throw new VerificationServiceError(
        serverErrorMessage || "We couldn't complete the verification. Please try again shortly.",
        `HTTP_${response.status}`
      );
    }

    const data = await response.json();

    if (data.success === false && !data.status) {
      throw new VerificationServiceError(
        data.error || data.message || "We couldn't complete the verification. Please try again shortly.",
        'API_UNSUCCESSFUL'
      );
    }

    return {
      success: data.success !== false,
      registration: data.registration || trimmed,
      status: data.status || 'UNKNOWN',
      insurer: data.insurer ?? null,
      expiryDate: data.expiryDate ?? null,
      vehicle: data.vehicle ?? null,
      rawResponse: data.rawResponse || '',
      reference: data.reference || '',
      verifiedAt: data.verifiedAt || new Date().toISOString(),
      source: data.source || 'NIC_PUBLIC_USSD',
      channel: data.channel || 'WEB',
      verificationId: data.verificationId,
      multipleRecords: Boolean(data.multipleRecords),
      recordsFound: typeof data.recordsFound === 'number' ? data.recordsFound : undefined,
      records: Array.isArray(data.records) ? data.records : undefined,
    };
  } catch (err: unknown) {
    if (err instanceof VerificationServiceError) {
      throw err;
    }
    // Generic fallback for network dropped, CORS, or DNS failures
    throw new VerificationServiceError(
      "We couldn't complete the verification. Please check your connection and try again shortly.",
      'NETWORK_OR_PARSING_ERROR'
    );
  }
}

/**
 * Checks system health via GET /health.
 * Prepared for monitoring and health inspection.
 */
export async function checkHealth(): Promise<HealthCheckResult> {
  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/health`;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check returned status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    return {
      success: false,
      service: 'NIC USSD Bridge',
      phoneConnected: false,
    };
  }
}

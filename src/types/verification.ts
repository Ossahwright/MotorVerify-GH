export type VerificationStatus = "ACTIVE" | "NOT_FOUND" | "UNKNOWN";

export interface SingleInsuranceRecord {
  insurer: string | null;
  vehicle: string | null;
  expiryDate: string | null;
  status: VerificationStatus;
}

export interface VerificationResult {
  success?: boolean;
  registration: string;
  status: VerificationStatus;
  insurer: string | null;
  expiryDate: string | null;
  vehicle: string | null;
  rawResponse: string;
  reference: string;
  verifiedAt: string;
  source?: string;
  channel?: string;
  verificationId?: string;
  multipleRecords?: boolean;
  recordsFound?: number;
  records?: SingleInsuranceRecord[];
}

export interface HealthCheckResult {
  success: boolean;
  service: string;
  phoneConnected?: boolean;
}

export interface VerificationHistoryItem {
  id: string;
  registration: string;
  status: VerificationStatus;
  insurer: string | null;
  vehicle: string | null;
  expiryDate: string | null;
  reference: string;
  verifiedAt: string;
}


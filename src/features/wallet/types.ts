export type WalletCredential = {
  id: string;
  type: string;
  issuerName: string;
  payloadHash: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  expiresAt: string;
};

export type ReceiveCredentialInput = {
  type: string;
  issuerName: string;
};

export type SubmissionRequest = {
  id: string;
  requestedTypes: string[];
  status: "PENDING" | "APPROVED" | "EXPIRED";
  expiresAt: string;
};

export type SubmissionResponse = {
  id: string;
  requestId: string;
  credentialId: string;
  result: "APPROVED" | "REJECTED";
  createdAt: string;
};

export type WalletErrorResponse = {
  message?: string;
};

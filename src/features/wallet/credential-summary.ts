import { WalletCredential } from "./types";

export type CredentialSummary = {
  total: number;
  active: number;
};

export const summarizeCredentials = (credentials: WalletCredential[]): CredentialSummary => ({
  active: credentials.filter((credential) => credential.status === "ACTIVE").length,
  total: credentials.length,
});

export const selectSubmissionCredential = (
  credentials: WalletCredential[],
  requestedTypes: string[],
): WalletCredential | undefined => {
  return credentials.find((credential) => (
    credential.status === "ACTIVE" && requestedTypes.includes(credential.type)
  ));
};

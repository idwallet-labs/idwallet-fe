import { WalletCredential } from "./api";

export type CredentialSummary = {
  total: number;
  active: number;
};

export const summarizeCredentials = (credentials: WalletCredential[]): CredentialSummary => ({
  active: credentials.filter((credential) => credential.status === "ACTIVE").length,
  total: credentials.length,
});

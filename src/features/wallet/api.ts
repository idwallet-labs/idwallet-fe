import ky from "ky";

export type WalletCredential = {
  id: string;
  type: string;
  issuerName: string;
  payloadHash: string;
  status: "ACTIVE" | "REVOKED" | "EXPIRED";
  expiresAt: string;
};

const api = ky.create({
  prefix: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api",
  timeout: 8000,
});

export const walletApi = {
  credentials: () => api.get("wallet/credentials").json<WalletCredential[]>(),
};

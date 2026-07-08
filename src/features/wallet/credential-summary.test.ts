import { describe, expect, it } from "vitest";

import { summarizeCredentials } from "./credential-summary";
import { WalletCredential } from "./api";

const credential = (status: WalletCredential["status"]): WalletCredential => ({
  expiresAt: "2027-12-31",
  id: `credential-${status}`,
  issuerName: "IDWallet Demo Issuer",
  status,
  type: "교육 수료 증명",
});

describe("summarizeCredentials", () => {
  it("counts total and active credentials", () => {
    expect(summarizeCredentials([
      credential("ACTIVE"),
      credential("REVOKED"),
      credential("EXPIRED"),
    ])).toEqual({
      active: 1,
      total: 3,
    });
  });
});

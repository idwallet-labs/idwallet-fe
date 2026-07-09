import { describe, expect, it } from "vitest";

import { selectSubmissionCredential, summarizeCredentials } from "./credential-summary";
import { WalletCredential } from "./types";

const credential = (status: WalletCredential["status"]): WalletCredential => ({
  expiresAt: "2027-12-31",
  id: `credential-${status}`,
  issuerName: "IDWallet Demo Issuer",
  payloadHash: `hash-${status}`,
  status,
  type: "교육 수료 증명",
});

describe("selectSubmissionCredential", () => {
  it("selects an active credential that matches the requested type", () => {
    const credentials = [
      credential("REVOKED"),
      { ...credential("ACTIVE"), id: "credential-active-employment", type: "재직 증명" },
    ];

    expect(selectSubmissionCredential(credentials, ["재직 증명"])?.id).toBe("credential-active-employment");
  });

  it("does not select revoked credentials", () => {
    expect(selectSubmissionCredential([credential("REVOKED")], ["교육 수료 증명"])).toBeUndefined();
  });
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

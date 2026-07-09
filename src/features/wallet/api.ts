import ky from "ky";

import { SubmissionRequest, SubmissionResponse, WalletCredential, WalletErrorResponse } from "./types";

const api = ky.create({
  prefix: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api",
  timeout: 8000,
});

export const apiErrorMessage = async (error: unknown) => {
  if (error instanceof Error && "response" in error) {
    const response = error.response as Response;
    const body = await response.json().catch((): WalletErrorResponse => ({}));
    return body.message ?? `API 요청 실패 (${response.status})`;
  }

  return error instanceof Error ? error.message : "알 수 없는 오류";
};

export const walletApi = {
  credentials: () => api.get("wallet/credentials").json<WalletCredential[]>(),
  createSubmission: (requestedTypes: string[]) =>
    api.post("submission-requests", { json: { requestedTypes } }).json<SubmissionRequest>(),
  submission: (id: string) => api.get(`submission-requests/${id}`).json<SubmissionRequest>(),
  approveSubmission: (id: string, credentialId: string) =>
    api.post(`submission-requests/${id}/responses`, { json: { credentialId } }).json<SubmissionResponse>(),
};

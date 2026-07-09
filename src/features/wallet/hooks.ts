import { useEffect, useMemo, useState } from "react";

import { apiErrorMessage, walletApi } from "./api";
import { selectSubmissionCredential, summarizeCredentials } from "./credential-summary";
import { SubmissionRequest, SubmissionResponse, WalletCredential } from "./types";

export type WalletViewState = {
  credentials: WalletCredential[];
  errorMessage: string | null;
  isLoading: boolean;
  isSubmitting: boolean;
  selectedCredential: WalletCredential | undefined;
  submission: SubmissionRequest | null;
  submissionMessage: string;
  submissionResponse: SubmissionResponse | null;
  summary: ReturnType<typeof summarizeCredentials>;
  approveSubmission: () => Promise<void>;
  createSubmission: () => Promise<void>;
  loadCredentials: () => Promise<void>;
  receiveCredential: () => Promise<void>;
};

export const useWalletSubmission = (): WalletViewState => {
  const [credentials, setCredentials] = useState<WalletCredential[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState<SubmissionRequest | null>(null);
  const [submissionResponse, setSubmissionResponse] = useState<SubmissionResponse | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState("검증자 제출 요청을 생성하세요");
  const summary = useMemo(() => summarizeCredentials(credentials), [credentials]);
  const selectedCredential = useMemo(() => (
    submission ? selectSubmissionCredential(credentials, submission.requestedTypes) : undefined
  ), [credentials, submission]);

  const loadCredentials = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setCredentials(await walletApi.credentials());
    } catch (error) {
      setCredentials([]);
      setErrorMessage(await apiErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadCredentials();
  }, []);

  const createSubmission = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const request = await walletApi.createSubmission(["교육 수료 증명"]);
      setSubmission(request);
      setSubmissionResponse(null);
      setSubmissionMessage("검증자가 교육 수료 증명을 요청했습니다");
    } catch (error) {
      setErrorMessage(await apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const receiveCredential = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await walletApi.receiveCredential({
        issuerName: "BDGEN Academy Issuer",
        type: "교육 수료 증명",
      });
      await loadCredentials();
      setSubmissionMessage("발급기관에서 교육 수료 증명을 지갑에 추가했습니다");
    } catch (error) {
      setErrorMessage(await apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveSubmission = async () => {
    if (!submission) {
      setSubmissionMessage("먼저 제출 요청을 생성하세요");
      return;
    }

    if (!selectedCredential) {
      setSubmissionMessage("요청 조건에 맞는 활성 증명이 없습니다");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await walletApi.approveSubmission(submission.id, selectedCredential.id);
      setSubmission({ ...submission, status: "APPROVED" });
      setSubmissionResponse(response);
      setSubmissionMessage("선택한 증명을 검증자에게 제출했습니다");
    } catch (error) {
      setErrorMessage(await apiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    approveSubmission,
    createSubmission,
    credentials,
    errorMessage,
    isLoading,
    isSubmitting,
    loadCredentials,
    receiveCredential,
    selectedCredential,
    submission,
    submissionMessage,
    submissionResponse,
    summary,
  };
};

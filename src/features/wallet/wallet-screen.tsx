import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { useWalletSubmission } from "./hooks";

const requestedType = "교육 수료 증명";

const credentialStatusLabel = {
  ACTIVE: "제출 가능",
  EXPIRED: "만료됨",
  REVOKED: "폐기됨",
};

export const WalletScreen = () => {
  const wallet = useWalletSubmission();
  const submitDisabled = wallet.isSubmitting || !wallet.submission || !wallet.selectedCredential;
  const hasSubmissionRequest = Boolean(wallet.submission);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.eyebrow}>DID 모바일 지갑</Text>
        <Text style={styles.title}>모바일 증명 제출</Text>
        <Text style={styles.description}>
          QR 또는 deep link로 제출 요청을 받은 뒤, 발급기관에서 받은 활성 증명만 선택해 검증자에게 제출한다.
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>보유 증명</Text>
            <Text style={styles.metricValue}>{wallet.summary.total}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>제출 가능</Text>
            <Text style={styles.metricValue}>{wallet.summary.active}</Text>
          </View>
        </View>

        {wallet.errorMessage ? (
          <View accessibilityRole="alert" style={styles.errorCard}>
            <Text style={styles.errorTitle}>처리 오류</Text>
            <Text style={styles.errorText}>{wallet.errorMessage}</Text>
            <Pressable
              accessibilityLabel="증명 다시 불러오기"
              accessibilityRole="button"
              onPress={wallet.loadCredentials}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>다시 불러오기</Text>
            </Pressable>
          </View>
        ) : null}

        <View accessibilityLabel="Submission request intake" style={styles.submissionCard}>
          <Text style={styles.sectionLabel}>제출 요청 수신</Text>
          <Text style={styles.cardTitle}>QR / deep link 요청</Text>
          <Text style={styles.cardMeta}>
            상태: {wallet.submission ? `${wallet.submission.id} · ${wallet.submission.status}` : wallet.submissionMessage}
          </Text>
          <Text style={styles.cardMeta}>요청 항목: {wallet.submission?.requestedTypes.join(", ") ?? requestedType}</Text>
          <View style={styles.actionRow}>
            <Pressable
              accessibilityLabel="QR 제출 요청 받기"
              accessibilityRole="button"
              accessibilityState={{ disabled: wallet.isSubmitting }}
              disabled={wallet.isSubmitting}
              onPress={wallet.createSubmission}
              style={wallet.isSubmitting ? styles.disabledButton : styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>{wallet.isSubmitting ? "처리 중" : "QR 요청 받기"}</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Deep link 제출 요청 받기"
              accessibilityRole="button"
              accessibilityState={{ disabled: wallet.isSubmitting }}
              disabled={wallet.isSubmitting}
              onPress={wallet.createSubmission}
              style={wallet.isSubmitting ? styles.disabledButton : styles.secondaryButton}
            >
              <Text style={wallet.isSubmitting ? styles.disabledButtonText : styles.secondaryButtonText}>Deep link</Text>
            </Pressable>
          </View>
        </View>

        <View accessibilityLabel="Credential receive flow" style={styles.card}>
          <Text style={styles.sectionLabel}>증명 추가</Text>
          <Text style={styles.cardTitle}>발급기관에서 증명 받기</Text>
          <Text style={styles.cardMeta}>
            지갑은 빈 상태에서 시작하며, 사용자가 발급기관의 증명을 받은 뒤 제출 가능 목록에 추가된다.
          </Text>
          <Pressable
            accessibilityLabel="교육 수료 증명 발급받기"
            accessibilityRole="button"
            accessibilityState={{ disabled: wallet.isSubmitting }}
            disabled={wallet.isSubmitting}
            onPress={wallet.receiveCredential}
            style={wallet.isSubmitting ? styles.disabledButton : styles.secondaryButton}
          >
            <Text style={wallet.isSubmitting ? styles.disabledButtonText : styles.secondaryButtonText}>교육 수료 증명 받기</Text>
          </Pressable>
        </View>

        <View accessibilityLabel="Selective disclosure submission" style={styles.submissionCard}>
          <Text style={styles.sectionLabel}>선택 제출</Text>
          <Text style={styles.cardTitle}>요청 조건에 맞는 증명 확인</Text>
          <Text style={styles.cardMeta}>
            선택 증명: {wallet.selectedCredential ? `${wallet.selectedCredential.type} (${wallet.selectedCredential.id})` : "제출 가능한 증명 없음"}
          </Text>
          <Pressable
            accessibilityLabel="선택한 증명 제출"
            accessibilityRole="button"
            accessibilityState={{ disabled: submitDisabled }}
            disabled={submitDisabled}
            onPress={wallet.approveSubmission}
            style={submitDisabled ? styles.disabledButton : styles.secondaryButton}
          >
            <Text style={submitDisabled ? styles.disabledButtonText : styles.secondaryButtonText}>선택 제출</Text>
          </Pressable>
          {!hasSubmissionRequest ? (
            <Text accessibilityRole="alert" style={styles.warningText}>먼저 QR 또는 deep link 제출 요청을 받아야 합니다.</Text>
          ) : null}
          {hasSubmissionRequest && !wallet.selectedCredential ? (
            <Text accessibilityRole="alert" style={styles.warningText}>요청 조건에 맞는 활성 증명이 없어서 제출할 수 없습니다.</Text>
          ) : null}
          {wallet.submissionResponse ? (
            <Text style={styles.resultText}>
              제출 완료: {wallet.submissionResponse.result} · {wallet.submissionResponse.credentialId}
            </Text>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>보유 증명</Text>
        {wallet.isLoading ? <Text style={styles.cardMeta}>증명을 불러오는 중입니다</Text> : null}
        {!wallet.isLoading && wallet.credentials.length === 0 ? (
          <Text style={styles.cardMeta}>아직 보유 증명이 없습니다. 발급기관에서 증명을 받은 뒤 제출할 수 있습니다.</Text>
        ) : null}
        {wallet.credentials.map((credential) => (
          <View accessibilityLabel={`${credential.type} ${credential.status}`} key={credential.id} style={styles.card}>
            <Text style={styles.cardTitle}>{credential.type}</Text>
            <Text style={styles.cardMeta}>발급기관: {credential.issuerName}</Text>
            <Text style={styles.cardMeta}>증명 ID: {credential.id}</Text>
            <Text style={styles.cardMeta}>무결성 해시: {credential.payloadHash}</Text>
            <Text style={credential.status === "ACTIVE" ? styles.activeBadge : styles.inactiveBadge}>
              {credentialStatusLabel[credential.status]} · 만료 {credential.expiresAt}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  activeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#101827",
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 13,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d7dedb",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  cardMeta: {
    color: "#667085",
    fontSize: 14,
  },
  cardTitle: {
    color: "#101827",
    fontSize: 18,
    fontWeight: "700",
  },
  container: {
    backgroundColor: "#f7faf9",
    flex: 1,
  },
  content: {
    gap: 18,
    padding: 24,
  },
  description: {
    color: "#475467",
    fontSize: 16,
    lineHeight: 24,
  },
  disabledButton: {
    alignItems: "center",
    backgroundColor: "#d0d5dd",
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  disabledButtonText: {
    color: "#667085",
    fontSize: 14,
    fontWeight: "700",
  },
  errorCard: {
    backgroundColor: "#fff5f5",
    borderColor: "#f5b5b5",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  errorText: {
    color: "#9f1239",
    fontSize: 14,
  },
  errorTitle: {
    color: "#9f1239",
    fontSize: 16,
    fontWeight: "800",
  },
  eyebrow: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  inactiveBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#667085",
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 13,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  metricCard: {
    backgroundColor: "#ffffff",
    borderColor: "#d7dedb",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    padding: 16,
  },
  metricLabel: {
    color: "#667085",
    fontSize: 13,
  },
  metricRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricValue: {
    color: "#101827",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#101827",
    borderRadius: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  resultText: {
    color: "#047857",
    fontSize: 14,
    fontWeight: "700",
  },
  secondaryButton: {
    alignItems: "center",
    borderColor: "#101827",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: "#101827",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionLabel: {
    color: "#101827",
    fontSize: 15,
    fontWeight: "800",
  },
  submissionCard: {
    backgroundColor: "#ffffff",
    borderColor: "#b7d7ca",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  title: {
    color: "#101827",
    fontSize: 34,
    fontWeight: "800",
  },
  warningText: {
    color: "#9a3412",
    fontSize: 14,
    fontWeight: "700",
  },
});

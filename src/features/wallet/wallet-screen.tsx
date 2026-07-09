import { StatusBar } from "expo-status-bar";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

import { useWalletSubmission } from "./hooks";

const requestedType = "교육 수료 증명";

export const WalletScreen = () => {
  const wallet = useWalletSubmission();
  const submitDisabled = wallet.isSubmitting || !wallet.submission || !wallet.selectedCredential;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.eyebrow}>DID 모바일 지갑</Text>
        <Text style={styles.title}>증명 선택 제출</Text>
        <Text style={styles.description}>
          검증자가 요청한 증명 조건을 확인하고, 지갑 안의 활성 증명만 선택해 제출한다.
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
            <Text style={styles.errorTitle}>API 연결 오류</Text>
            <Text style={styles.errorText}>{wallet.errorMessage}</Text>
            <Pressable accessibilityRole="button" onPress={wallet.loadCredentials} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>다시 불러오기</Text>
            </Pressable>
          </View>
        ) : null}

        <View accessibilityLabel="Submission session" style={styles.submissionCard}>
          <Text style={styles.sectionLabel}>제출 요청</Text>
          <Text style={styles.cardTitle}>검증자가 요구한 증명</Text>
          <Text style={styles.cardMeta}>
            상태: {wallet.submission ? `${wallet.submission.id} · ${wallet.submission.status}` : wallet.submissionMessage}
          </Text>
          <Text style={styles.cardMeta}>요청 항목: {wallet.submission?.requestedTypes.join(", ") ?? requestedType}</Text>
          <Text style={styles.cardMeta}>
            선택 증명: {wallet.selectedCredential ? `${wallet.selectedCredential.type} (${wallet.selectedCredential.id})` : "선택 가능한 증명 없음"}
          </Text>
          <View style={styles.actionRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: wallet.isSubmitting }}
              disabled={wallet.isSubmitting}
              onPress={wallet.createSubmission}
              style={wallet.isSubmitting ? styles.disabledButton : styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>{wallet.isSubmitting ? "처리 중" : "요청 생성"}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: submitDisabled }}
              disabled={submitDisabled}
              onPress={wallet.approveSubmission}
              style={submitDisabled ? styles.disabledButton : styles.secondaryButton}
            >
              <Text style={submitDisabled ? styles.disabledButtonText : styles.secondaryButtonText}>선택 제출</Text>
            </Pressable>
          </View>
          {wallet.submissionResponse ? (
            <Text style={styles.resultText}>
              제출 결과: {wallet.submissionResponse.result} · {wallet.submissionResponse.credentialId}
            </Text>
          ) : null}
        </View>

        <Text style={styles.sectionLabel}>보유 증명</Text>
        {wallet.isLoading ? <Text style={styles.cardMeta}>증명을 불러오는 중입니다</Text> : null}
        {!wallet.isLoading && wallet.credentials.length === 0 ? (
          <Text style={styles.cardMeta}>보유 증명이 없습니다</Text>
        ) : null}
        {wallet.credentials.map((credential) => (
          <View accessibilityLabel={`${credential.type} ${credential.status}`} key={credential.id} style={styles.card}>
            <Text style={styles.cardTitle}>{credential.type}</Text>
            <Text style={styles.cardMeta}>발급기관: {credential.issuerName}</Text>
            <Text style={styles.cardMeta}>증명 ID: {credential.id}</Text>
            <Text style={styles.cardMeta}>무결성 해시: {credential.payloadHash}</Text>
            <Text style={credential.status === "ACTIVE" ? styles.activeBadge : styles.inactiveBadge}>
              {credential.status} · 만료 {credential.expiresAt}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: "row",
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
    backgroundColor: "#d0d5dd",
    borderRadius: 8,
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
    backgroundColor: "#101827",
    borderRadius: 8,
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
    borderColor: "#101827",
    borderRadius: 8,
    borderWidth: 1,
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
});

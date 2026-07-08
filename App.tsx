import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

import { summarizeCredentials, WalletCredential, walletApi } from "./src/features/wallet";

const fallbackCredentials: WalletCredential[] = [
  {
    id: "wallet-vc-1",
    type: "교육 수료 증명",
    issuerName: "IDWallet Demo Issuer",
    status: "ACTIVE",
    expiresAt: "2027-12-31",
  },
  {
    id: "wallet-vc-2",
    type: "재직 증명",
    issuerName: "IDWallet Demo Issuer",
    status: "ACTIVE",
    expiresAt: "2026-10-31",
  },
];

const App = () => {
  const [credentials, setCredentials] = useState<WalletCredential[]>(fallbackCredentials);
  const summary = summarizeCredentials(credentials);

  useEffect(() => {
    walletApi.credentials().then(setCredentials).catch(() => setCredentials(fallbackCredentials));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.eyebrow}>Mobile identity wallet</Text>
        <Text style={styles.title}>IDWallet selective submission</Text>
        <Text style={styles.description}>
          모바일 지갑에서 증명을 선택하고 QR 제출 세션으로 승인하는 DID 지갑 흐름을 검증한다.
        </Text>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Credentials</Text>
            <Text style={styles.metricValue}>{summary.total}</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Active</Text>
            <Text style={styles.metricValue}>{summary.active}</Text>
          </View>
        </View>

        {credentials.map((credential) => (
          <View accessibilityLabel={`${credential.type} ${credential.status}`} key={credential.id} style={styles.card}>
            <Text style={styles.cardTitle}>{credential.type}</Text>
            <Text style={styles.cardMeta}>{credential.issuerName}</Text>
            <Text style={styles.badge}>{credential.status} · {credential.expiresAt}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faf9",
  },
  content: {
    gap: 18,
    padding: 24,
  },
  eyebrow: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    color: "#101827",
    fontSize: 34,
    fontWeight: "800",
  },
  description: {
    color: "#475467",
    fontSize: 16,
    lineHeight: 24,
  },
  metricRow: {
    flexDirection: "row",
    gap: 12,
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
  metricValue: {
    color: "#101827",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderColor: "#d7dedb",
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 18,
  },
  cardTitle: {
    color: "#101827",
    fontSize: 18,
    fontWeight: "700",
  },
  cardMeta: {
    color: "#667085",
    fontSize: 14,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#101827",
    borderRadius: 999,
    color: "#ffffff",
    fontSize: 13,
    overflow: "hidden",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});

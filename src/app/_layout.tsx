import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.EXPO_PUBLIC_SENTRY_DSN),
  tracesSampleRate: 0.1,
});

const RootLayout = () => (
  <SafeAreaProvider>
    <Stack screenOptions={{ headerShown: false }} />
  </SafeAreaProvider>
);

export default Sentry.wrap(RootLayout);

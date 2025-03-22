import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/authContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="home" options={{ headerShown: false, }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </AuthProvider>
  )
}
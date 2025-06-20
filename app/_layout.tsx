import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  const isReady = useFrameworkReady();

  if (!isReady) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/support-preferences" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/journey-selection" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/community-guidelines" options={{ headerShown: false }} />
        <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
        <Stack.Screen name="peer-detail" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="requests" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/journal" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/gratitude" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/affirmations" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/focus-timer" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/quick-breathe" options={{ headerShown: false }} />
        <Stack.Screen name="mindfulness/strengths" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
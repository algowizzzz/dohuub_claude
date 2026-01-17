import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../src/store/authStore';
import { colors, fontSize } from '../src/constants/theme';

/**
 * Splash screen matching wireframe:
 * - Package icon (cube)
 * - DoHuub brand
 * - "Infinite Services" tagline
 * - Auto-navigates based on auth state
 */
export default function SplashScreen() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else if (hasCompletedOnboarding) {
        router.replace('/(auth)/welcome');
      } else {
        router.replace('/onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="cube-outline" size={80} color={colors.gray[800]} />
        <Text style={styles.logo}>DoHuub</Text>
        <Text style={styles.tagline}>Infinite Services</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.gray[900],
    marginTop: 16,
    marginBottom: 8,
  },
  tagline: {
    fontSize: fontSize.lg,
    color: colors.gray[600],
  },
});

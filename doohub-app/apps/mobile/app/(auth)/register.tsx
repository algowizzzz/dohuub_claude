import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderWidth } from '../../src/constants/theme';
import { Button, Input } from '../../src/components/ui';
import { AuthHeader } from '../../src/components/composite';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email Registration screen matching wireframe:
 * - Back button header
 * - Email input only
 * - Continue button (triggers OTP)
 */
export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const { register, isLoading } = useAuthStore();

  // Compute validity inline - recalculates on every render when email changes
  const trimmedEmail = email.trim();
  const isEmailValid = trimmedEmail.length > 0 && EMAIL_REGEX.test(trimmedEmail);

  const handleContinue = async () => {
    if (!isEmailValid) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      await register(trimmedEmail);
      // Registration successful - navigate to profile setup
      router.push({
        pathname: '/(auth)/profile-setup',
        params: { email: trimmedEmail },
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        Alert.alert(
          'Account Exists',
          'An account with this email already exists. Please sign in.',
          [
            { text: 'Sign In', onPress: () => router.push('/(auth)/signin') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || error.message || 'Registration failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <Text style={styles.title}>Enter Your Email</Text>
        <Text style={styles.subtitle}>
          Create your account to get started
        </Text>

        <View style={styles.form}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoFocus
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            loading={isLoading}
            fullWidth
            disabled={!isEmailValid}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    marginBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
  },
});

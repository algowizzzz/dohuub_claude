import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button, Input } from '../../src/components/ui';
import { AuthHeader } from '../../src/components/composite';

/**
 * Sign In screen matching wireframe:
 * - Back button
 * - Package icon + branding
 * - "Sign In to Your Account" heading
 * - Google Sign In button (outline)
 * - Email Sign In button (primary)
 * - Link to Sign Up
 */
export default function SignInScreen() {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [email, setEmail] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleGoogleSignIn = () => {
    // TODO: Implement Google Sign-In
    alert('Google Sign-In coming soon!');
  };

  const handleEmailSignIn = async () => {
    if (!showEmailInput) {
      setShowEmailInput(true);
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await login(email);
      // Login successful - navigate to home
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.response?.status === 404) {
        Alert.alert(
          'Not Found',
          'No account found with this email. Please register first.',
          [
            { text: 'Register', onPress: () => router.push('/(auth)/welcome') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert('Error', error.response?.data?.error || error.message || 'Login failed');
      }
    }
  };

  // If showing email input, show simplified form
  if (showEmailInput) {
    return (
      <View style={styles.container}>
        <AuthHeader showBack onBack={() => setShowEmailInput(false)} />

        <View style={styles.content}>
          <Text style={styles.title}>Enter Your Email</Text>
          <Text style={styles.subtitle}>
            Sign in to your account
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
              onPress={handleEmailSignIn}
              loading={isLoading}
              fullWidth
              disabled={!email.trim()}
            />
          </View>
        </View>
      </View>
    );
  }

  // Main sign in screen with buttons
  return (
    <View style={styles.container}>
      <AuthHeader showBack onBack={() => router.back()} />

      <View style={styles.centeredContent}>
        {/* Logo */}
        <Ionicons
          name="cube-outline"
          size={80}
          color={colors.gray[800]}
          style={styles.icon}
        />

        {/* Brand */}
        <Text style={styles.brand}>DoHuub</Text>
        <Text style={styles.tagline}>Infinite Services</Text>
        <Text style={styles.heading}>Sign In to Your Account</Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
            <View style={styles.googleIcon}>
              <Ionicons name="logo-google" size={20} color={colors.gray[600]} />
            </View>
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <Button
            title="Sign In with Email"
            onPress={handleEmailSignIn}
            fullWidth
            icon={<Ionicons name="mail" size={20} color={colors.text.inverse} />}
          />
        </View>

        {/* Sign Up Link */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/welcome')}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
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
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  icon: {
    marginBottom: spacing.lg,
  },
  brand: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    marginBottom: spacing.sm,
  },
  heading: {
    fontSize: fontSize.lg,
    color: colors.gray[700],
    marginBottom: spacing.xxl,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    minHeight: 52,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signUpText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  signUpLink: {
    fontSize: fontSize.md,
    color: colors.gray[800],
    textDecorationLine: 'underline',
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

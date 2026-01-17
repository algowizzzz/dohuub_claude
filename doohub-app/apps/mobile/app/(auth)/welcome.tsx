import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button } from '../../src/components/ui';

/**
 * Welcome/Auth screen matching wireframe exactly:
 * - Package icon (box)
 * - "DoHuub" title
 * - "Infinite Services" subtitle
 * - "Create Your Account" heading
 * - Google Sign Up button (outline)
 * - Email Sign Up button (primary)
 * - Link to Sign In
 * - Terms footer
 */
export default function WelcomeScreen() {
  const handleGoogleSignUp = () => {
    // TODO: Implement Google Sign-In
    alert('Google Sign-In coming soon!');
  };

  const handleEmailSignUp = () => {
    router.push('/(auth)/register');
  };

  const handleSignIn = () => {
    router.push('/(auth)/signin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo - Package Icon */}
        <Ionicons
          name="cube-outline"
          size={80}
          color={colors.gray[800]}
          style={styles.icon}
        />

        {/* Brand */}
        <Text style={styles.brand}>DoHuub</Text>
        <Text style={styles.tagline}>Infinite Services</Text>
        <Text style={styles.heading}>Create Your Account</Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
            <View style={styles.googleIcon}>
              <Ionicons name="logo-google" size={20} color={colors.gray[600]} />
            </View>
            <Text style={styles.googleButtonText}>Sign Up with Google</Text>
          </TouchableOpacity>

          <Button
            title="Sign Up with Email"
            onPress={handleEmailSignUp}
            fullWidth
            icon={<Ionicons name="mail" size={20} color={colors.text.inverse} />}
          />
        </View>

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleSignIn}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.termsLink}>Terms of Service</Text>
          {' '}and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
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
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  signInText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  signInLink: {
    fontSize: fontSize.md,
    color: colors.gray[800],
    textDecorationLine: 'underline',
  },
  terms: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    textAlign: 'center',
    marginTop: spacing.xl,
    maxWidth: 280,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
});


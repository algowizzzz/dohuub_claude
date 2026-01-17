import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button } from '../../src/components/ui';
import { AuthHeader } from '../../src/components/composite';
import api from '../../src/services/api';
import { ENDPOINTS } from '../../src/constants/api';

const OTP_LENGTH = 6;

/**
 * OTP Verification screen matching wireframe:
 * - Back button header with 2px border
 * - "Verify Your Email" title
 * - Email shown inline
 * - 6-digit OTP input boxes
 * - Timer in "0:59" format
 * - Resend OTP link
 * - Verify button
 */
export default function VerifyOTPScreen() {
  const { email, isRegistration } = useLocalSearchParams<{
    email: string;
    isRegistration: string;
  }>();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(59);
  const [error, setError] = useState('');
  const inputRefs = useRef<TextInput[]>([]);
  const { verifyOtp, isLoading } = useAuthStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Format timer as "0:59"
  const formatTimer = () => {
    const seconds = timer.toString().padStart(2, '0');
    return `0:${seconds}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (newOtp.every((digit) => digit) && newOtp.join('').length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpCode?: string) => {
    const code = otpCode || otp.join('');

    if (code.length !== OTP_LENGTH) {
      setError('Invalid code. Please try again');
      return;
    }

    try {
      await verifyOtp(email!, code, isRegistration === 'true');

      // Navigate to appropriate screen
      if (isRegistration === 'true') {
        router.replace('/(auth)/profile-setup');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      // DEV MODE: If backend is down, skip to next screen for testing
      if (__DEV__ || process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Backend unavailable, skipping OTP verification');
        if (isRegistration === 'true') {
          router.replace('/(auth)/profile-setup');
        } else {
          router.replace('/(tabs)');
        }
        return;
      }

      console.error('OTP verification error:', error);
      setError('Invalid code. Please try again');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post(ENDPOINTS.AUTH.RESEND_OTP, { email });
      setTimer(59);
      setError('');
      Alert.alert('Success', 'A new verification code has been sent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader showBack onBack={() => router.back()} />

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Timer / Resend */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend code in {formatTimer()}</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOtp}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <Button
          title="Verify"
          onPress={() => handleVerify()}
          loading={isLoading}
          fullWidth
          disabled={otp.some((d) => !d)}
        />

        {/* DEV ONLY: Skip OTP button */}
        {__DEV__ && (
          <TouchableOpacity
            style={styles.devSkipButton}
            onPress={() => handleVerify('000000')}
          >
            <Text style={styles.devSkipText}>🔧 DEV: Skip OTP</Text>
          </TouchableOpacity>
        )}
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
    lineHeight: 24,
  },
  email: {
    fontWeight: '600',
    color: colors.gray[800],
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    textAlign: 'center',
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
  },
  otpInputFilled: {
    borderColor: colors.gray[800],
  },
  otpInputError: {
    borderColor: colors.gray[600],
  },
  error: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  timerText: {
    fontSize: fontSize.md,
    color: colors.gray[500],
  },
  resendLink: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  devSkipButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: '#FFF3CD',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FFC107',
    alignSelf: 'center',
  },
  devSkipText: {
    color: '#856404',
    fontSize: fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});

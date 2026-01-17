import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button, Input, Stepper, PhoneInput } from '../../src/components/ui';

/**
 * Profile Setup screen (Step 1 of 2) matching wireframe:
 * - Step indicator "Step 1 of 2"
 * - Camera icon for profile photo upload
 * - Full Name input (single field)
 * - Phone number with country code dropdown
 * - Continue button
 */
export default function ProfileSetupScreen() {
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const { updateProfile, isLoading } = useAuthStore();

  const handleContinue = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    try {
      // Split full name for API (backend expects firstName/lastName)
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      await updateProfile({
        firstName,
        lastName,
        phone: phoneNumber ? `${countryCode}${phoneNumber}` : undefined,
      });

      // Navigate to address setup (Step 2)
      router.push('/(auth)/address-setup');
    } catch (error) {
      // DEV MODE: If backend is down, skip to next screen for testing
      if (__DEV__ || process.env.NODE_ENV === 'development') {
        console.log('DEV MODE: Backend unavailable, skipping profile save');
        router.push('/(auth)/address-setup');
        return;
      }
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handlePhotoPress = () => {
    // TODO: Implement photo picker
    Alert.alert('Coming Soon', 'Photo upload will be available soon!');
  };

  return (
    <View style={styles.container}>
      {/* Step Indicator */}
      <Stepper currentStep={1} totalSteps={2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Complete Your Profile</Text>
            <Text style={styles.subtitle}>Tell us a bit about yourself</Text>

            {/* Profile Photo */}
            <TouchableOpacity style={styles.photoContainer} onPress={handlePhotoPress}>
              <View style={styles.photoCircle}>
                <Ionicons name="camera" size={40} color={colors.gray[400]} />
              </View>
              <View style={styles.photoEditBadge}>
                <Ionicons name="camera" size={16} color={colors.text.inverse} />
              </View>
            </TouchableOpacity>

            {/* Form Fields */}
            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                required
              />

              <PhoneInput
                label="Phone Number"
                countryCode={countryCode}
                phoneNumber={phoneNumber}
                onCountryCodeChange={setCountryCode}
                onPhoneNumberChange={setPhoneNumber}
                placeholder="(555) 123-4567"
              />
            </View>

            {/* Continue Button */}
            <Button
              title="Continue"
              onPress={handleContinue}
              loading={isLoading}
              fullWidth
              disabled={!fullName.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  photoContainer: {
    alignSelf: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[800],
    borderWidth: borderWidth.default,
    borderColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
});

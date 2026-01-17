import React from 'react';
import { View, Text, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { colors, spacing, fontSize, borderRadius } from '../src/constants/theme';
import { Button } from '../src/components/ui';

/**
 * Location Permission screen matching wireframe:
 * - Location icon
 * - Title and description
 * - "Allow Location" button (primary)
 * - "Enter Manually" button (outline)
 */
export default function LocationPermissionScreen() {
  const handleAllowLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        console.log('Location:', location);

        // Navigate to main app
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Permission Denied',
          'Location access is required for the best experience. You can enable it later in Settings.',
          [
            { text: 'Enter Manually', onPress: handleEnterManually },
            { text: 'Try Again', onPress: handleAllowLocation },
          ]
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Error', 'Failed to get location. Please try again or enter manually.');
    }
  };

  const handleEnterManually = () => {
    // Navigate to main app - user can set location from there
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Location Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={64} color={colors.gray[800]} />
        </View>

        {/* Title and Description */}
        <Text style={styles.title}>Enable Location</Text>
        <Text style={styles.description}>
          DoHuub needs your location to show you services available in your area.
          {'\n\n'}
          Your location is only used to find nearby service providers and will never be shared without your consent.
        </Text>

        {/* Buttons */}
        <View style={styles.buttons}>
          <Button
            title="Allow Location"
            onPress={handleAllowLocation}
            fullWidth
            icon={<Ionicons name="location" size={20} color={colors.text.inverse} />}
          />

          <Button
            title="Enter Location Manually"
            onPress={handleEnterManually}
            variant="outline"
            fullWidth
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
    maxWidth: 320,
  },
  buttons: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
});


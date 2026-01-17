import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, borderRadius, borderWidth, fontSize } from '../../constants/theme';

interface MainHeaderProps {
  locationLabel?: string;
  onLocationPress?: () => void;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  hasUnreadNotifications?: boolean;
}

/**
 * Main header matching wireframe:
 * - Location selector dropdown on left
 * - Notification bell + profile icon on right
 */
export function MainHeader({
  locationLabel = 'Select Location',
  onLocationPress,
  onNotificationsPress,
  onProfilePress,
  hasUnreadNotifications = false,
}: MainHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Location Selector */}
      <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
        <Ionicons name="location" size={20} color={colors.gray[600]} />
        <Text style={styles.locationText}>{locationLabel}</Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>

      {/* Right Side Icons */}
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onNotificationsPress}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.gray[700]} />
          {hasUnreadNotifications && <View style={styles.notificationDot} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onProfilePress || (() => router.push('/(tabs)/profile'))}
        >
          <Ionicons name="person-circle-outline" size={32} color={colors.gray[700]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  locationText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  dropdownArrow: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.error,
  },
});


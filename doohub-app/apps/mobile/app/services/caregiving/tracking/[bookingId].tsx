import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button } from '../../../../src/components/ui';

const STATUS_STEPS = [
  { id: 'confirmed', label: 'Booking Confirmed', icon: 'checkmark-circle' },
  { id: 'en_route', label: 'Provider En Route', icon: 'navigate' },
  { id: 'arrived', label: 'Provider Arrived', icon: 'location' },
  { id: 'in_progress', label: 'Service In Progress', icon: 'heart' },
  { id: 'completed', label: 'Service Completed', icon: 'checkmark-done-circle' },
];

const MOCK_BOOKING = {
  id: 'CARE123',
  type: 'companion', // or 'ride'
  status: 'en_route',
  scheduledTime: 'Jan 15, 2026 at 10:00 AM',
  provider: {
    name: 'Sarah Johnson',
    phone: '+1234567890',
    rating: 4.9,
  },
  service: {
    type: 'Companion Care',
    duration: '4 hours',
    address: '123 Main Street, Apt 4B, New York, NY',
  },
  estimatedArrival: '10:00 AM - 10:15 AM',
  total: 100.00,
};

/**
 * Caregiving Tracking Screen matching wireframe:
 * - Booking ID
 * - Status timeline
 * - Provider info with contact button
 * - Service details
 * - Estimated arrival/completion
 * - Contact support
 */
export default function CaregivingTrackingScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const [booking] = useState(MOCK_BOOKING);

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === booking.status);

  const handleContactProvider = () => {
    if (booking.provider?.phone) {
      Linking.openURL(`tel:${booking.provider.phone}`);
    }
  };

  const handleContactSupport = () => {
    // TODO: Open support chat or phone
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Booking Status" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking ID */}
        <View style={styles.bookingIdContainer}>
          <Text style={styles.bookingIdLabel}>Booking ID</Text>
          <Text style={styles.bookingId}>{booking.id}</Text>
        </View>

        {/* Estimated Arrival */}
        <View style={styles.estimatedArrival}>
          <Text style={styles.estimatedLabel}>
            {booking.status === 'completed' ? 'Completed' : 'Estimated Arrival'}
          </Text>
          <Text style={styles.estimatedTime}>
            {booking.status === 'completed' ? 'Thank you!' : booking.estimatedArrival}
          </Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <View key={status.id} style={styles.timelineItem}>
                  <View style={styles.timelineIconContainer}>
                    <View
                      style={[
                        styles.timelineIcon,
                        isCompleted && styles.timelineIconCompleted,
                        isCurrent && styles.timelineIconCurrent,
                      ]}
                    >
                      <Ionicons
                        name={status.icon as any}
                        size={18}
                        color={isCompleted ? colors.text.inverse : colors.gray[400]}
                      />
                    </View>
                    {index < STATUS_STEPS.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isCompleted && index < currentStatusIndex && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isCompleted && styles.timelineLabelCompleted,
                        isCurrent && styles.timelineLabelCurrent,
                      ]}
                    >
                      {status.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Provider</Text>
          <View style={styles.providerCard}>
            <View style={styles.providerAvatar}>
              <Ionicons name="person" size={24} color={colors.gray[400]} />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{booking.provider.name}</Text>
              <Text style={styles.providerRating}>
                ⭐ {booking.provider.rating} rating
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleContactProvider}>
              <Ionicons name="call" size={20} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="heart-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{booking.service.type}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.detailLabel}>Duration:</Text>
              <Text style={styles.detailValue}>{booking.service.duration}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.detailLabel}>Scheduled:</Text>
              <Text style={styles.detailValue}>{booking.scheduledTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>{booking.service.address}</Text>
            </View>
            <View style={[styles.detailRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${booking.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Ionicons name="help-circle-outline" size={20} color={colors.gray[600]} />
          <Text style={styles.supportText}>Need help with your booking?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  bookingIdLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  bookingId: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
    fontFamily: 'monospace',
  },
  estimatedArrival: {
    padding: spacing.lg,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  estimatedLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[300],
    marginBottom: spacing.xs,
  },
  estimatedTime: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineIconCurrent: {
    backgroundColor: colors.gray[800],
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  timelineLabel: {
    fontSize: fontSize.md,
    color: colors.gray[400],
  },
  timelineLabelCompleted: {
    color: colors.gray[700],
  },
  timelineLabelCurrent: {
    color: colors.gray[900],
    fontWeight: '600',
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  providerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  providerRating: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsCard: {
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    width: 70,
  },
  detailValue: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[800],
  },
  totalRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  supportText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textDecorationLine: 'underline',
  },
});


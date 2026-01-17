import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';

const STATUS_TIMELINE = [
  { id: 'booked', label: 'Booking Placed', icon: 'checkmark-circle' },
  { id: 'accepted', label: 'Accepted by Provider', icon: 'checkmark-circle' },
  { id: 'in_progress', label: 'In Progress', icon: 'time' },
  { id: 'completed', label: 'Completed', icon: 'checkmark-done-circle' },
];

// Mock data
const MOCK_BOOKING = {
  id: 'BK123456',
  serviceName: 'Deep Cleaning',
  vendorName: 'DoHuub Premium Cleaning',
  status: 'ACCEPTED',
  date: '2026-01-15',
  time: '10:00 AM',
  address: '123 Main St, City, State 12345',
  total: 160,
  notes: 'We have pets, please be mindful',
  createdAt: '2026-01-10',
};

/**
 * Booking Detail screen matching wireframe:
 * - Header with back button
 * - Status timeline
 * - Booking details
 * - Track Order button (for active bookings)
 * - Re-book option
 * - Cancel booking option
 */
export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking] = useState(MOCK_BOOKING);

  const currentStatusIndex = 1; // 0: booked, 1: accepted, 2: in progress, 3: completed
  const isInProgress = booking.status === 'IN_PROGRESS' || booking.status === 'ACCEPTED';
  const isCompleted = booking.status === 'COMPLETED';

  const handleTrackOrder = () => {
    router.push(`/bookings/${id}/tracking`);
  };

  const handleRebook = () => {
    // Navigate to booking form with pre-filled data
    Alert.alert('Re-book', 'This will create a new booking with the same details.');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleLeaveReview = () => {
    router.push(`/review/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Booking Details" showBack />

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

        {/* Track Order Button - for active bookings */}
        {isInProgress && (
          <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
            <View style={styles.trackButtonContent}>
              <Ionicons name="navigate" size={20} color={colors.text.inverse} />
              <Text style={styles.trackButtonText}>Track Order</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.text.inverse} />
          </TouchableOpacity>
        )}

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {STATUS_TIMELINE.map((status, index) => (
              <View key={status.id} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View
                    style={[
                      styles.timelineIcon,
                      index <= currentStatusIndex && styles.timelineIconActive,
                    ]}
                  >
                    <Ionicons
                      name={status.icon as any}
                      size={20}
                      color={index <= currentStatusIndex ? colors.text.inverse : colors.gray[400]}
                    />
                  </View>
                  {index < STATUS_TIMELINE.length - 1 && (
                    <View
                      style={[
                        styles.timelineLine,
                        index < currentStatusIndex && styles.timelineLineActive,
                      ]}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    index <= currentStatusIndex && styles.timelineLabelActive,
                  ]}
                >
                  {status.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Details</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Service</Text>
              <Text style={styles.detailValue}>{booking.serviceName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Provider</Text>
              <Text style={styles.detailValue}>{booking.vendorName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{booking.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{booking.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{booking.address}</Text>
            </View>
            {booking.notes && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Notes</Text>
                <Text style={styles.detailValue}>{booking.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Paid</Text>
              <Text style={styles.totalValue}>${booking.total}</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          {isCompleted ? (
            <Button title="Leave a Review" onPress={handleLeaveReview} fullWidth />
          ) : (
            <>
              <Button title="Re-book This Service" onPress={handleRebook} fullWidth variant="outline" />
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
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
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  trackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  trackButtonText: {
    fontSize: fontSize.md,
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
    alignItems: 'flex-start',
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconActive: {
    backgroundColor: colors.status.success,
  },
  timelineLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.gray[200],
  },
  timelineLineActive: {
    backgroundColor: colors.status.success,
  },
  timelineLabel: {
    fontSize: fontSize.md,
    color: colors.gray[400],
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  timelineLabelActive: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  detailsCard: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    flex: 1,
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  actionsSection: {
    gap: spacing.md,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cancelButtonText: {
    fontSize: fontSize.md,
    color: colors.status.error,
    fontWeight: '500',
  },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { Button } from '../../src/components/ui';

/**
 * Booking confirmation screen matching wireframe:
 * - Success checkmark
 * - "Booking Confirmed" title
 * - Booking details summary
 * - Booking ID
 * - "View Booking" and "Back to Home" buttons
 */
export default function ConfirmationScreen() {
  const { serviceName, amount, date, time, bookingId } = useLocalSearchParams<{
    serviceName: string;
    amount: string;
    date: string;
    time: string;
    bookingId: string;
  }>();

  const handleViewBooking = () => {
    router.replace({
      pathname: '/bookings/[id]',
      params: { id: bookingId },
    });
  };

  const handleBackToHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark" size={64} color={colors.text.inverse} />
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your booking has been successfully placed.
        </Text>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Service</Text>
            <Text style={styles.detailValue}>{serviceName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid</Text>
            <Text style={styles.detailValue}>${amount}</Text>
          </View>
          <View style={[styles.detailRow, styles.bookingIdRow]}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.bookingId}>{bookingId}</Text>
          </View>
        </View>

        {/* Info Notice */}
        <View style={styles.infoNotice}>
          <Ionicons name="information-circle" size={20} color={colors.gray[600]} />
          <Text style={styles.infoText}>
            You'll receive a confirmation email shortly. The service provider will contact you to confirm the appointment.
          </Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <Button title="View Booking" onPress={handleViewBooking} fullWidth />
        <Button
          title="Back to Home"
          onPress={handleBackToHome}
          variant="outline"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  detailsCard: {
    width: '100%',
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  detailValue: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
  },
  bookingIdRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  bookingId: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    fontFamily: 'monospace',
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
    width: '100%',
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  buttonsContainer: {
    padding: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
});


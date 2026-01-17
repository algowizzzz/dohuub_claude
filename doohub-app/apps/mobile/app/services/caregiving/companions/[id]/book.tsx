import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../../src/constants/theme';
import { ScreenHeader } from '../../../../../src/components/composite';
import { Button } from '../../../../../src/components/ui';

const DURATION_OPTIONS = [
  { hours: 2, label: '2 hours' },
  { hours: 4, label: '4 hours' },
  { hours: 6, label: '6 hours' },
  { hours: 8, label: '8 hours' },
];

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

/**
 * Companion Booking Form Screen matching wireframe:
 * - Duration selector (2hr, 4hr, 6hr, 8hr)
 * - Date picker
 * - Time slot selection
 * - Service address
 * - Special notes
 * - Price summary
 * - "Confirm Booking" button
 */
export default function CompanionBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedDuration, setSelectedDuration] = useState(4);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const hourlyRate = 25;
  const totalPrice = selectedDuration * hourlyRate;

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      // TODO: Call API to create booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/services/caregiving/tracking/COMP123');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Book Companion" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Duration Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How long do you need?</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.hours}
                style={[
                  styles.durationOption,
                  selectedDuration === option.hours && styles.durationOptionActive,
                ]}
                onPress={() => setSelectedDuration(option.hours)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration === option.hours && styles.durationTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.durationPrice,
                    selectedDuration === option.hours && styles.durationPriceActive,
                  ]}
                >
                  ${option.hours * hourlyRate}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Ionicons name="calendar-outline" size={20} color={colors.gray[600]} />
            <Text style={selectedDate ? styles.dateText : styles.datePlaceholder}>
              {selectedDate || 'Choose a date'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        </View>

        {/* Time Slots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Start Time</Text>
          <View style={styles.timeSlotsGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  selectedTime === time && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Service Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <View style={styles.addressInput}>
            <Ionicons name="location-outline" size={20} color={colors.gray[600]} />
            <TextInput
              style={styles.input}
              placeholder="Enter address where service will be provided"
              placeholderTextColor={colors.gray[400]}
              value={address}
              onChangeText={setAddress}
            />
          </View>
        </View>

        {/* Special Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special needs, preferences, or instructions..."
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{selectedDuration} hours × ${hourlyRate}/hr</Text>
            <Text style={styles.priceValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Confirm Booking - $${totalPrice.toFixed(2)}`}
          onPress={handleConfirmBooking}
          fullWidth
          loading={isBooking}
          disabled={!selectedTime || !address}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  durationOption: {
    width: '48%',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  durationOptionActive: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  durationText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  durationTextActive: {
    color: colors.gray[900],
  },
  durationPrice: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  durationPriceActive: {
    color: colors.gray[700],
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  dateText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  datePlaceholder: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[400],
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlot: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
  },
  timeSlotActive: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[800],
  },
  timeSlotText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  timeSlotTextActive: {
    color: colors.text.inverse,
  },
  addressInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  notesInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray[900],
    minHeight: 100,
  },
  priceSummary: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  priceValue: {
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  totalRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[300],
    marginTop: spacing.sm,
    paddingTop: spacing.md,
  },
  totalLabel: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


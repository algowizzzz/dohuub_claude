import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button, Input } from '../../../../src/components/ui';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM',
];

const SERVICES = [
  { id: '1', name: 'Deep Cleaning', price: 150 },
  { id: '2', name: 'Regular Cleaning', price: 100 },
  { id: '3', name: 'Move-in/Move-out', price: 200 },
];

/**
 * Booking form screen matching wireframe:
 * - Service selection
 * - Date picker
 * - Time slot selection
 * - Address selection
 * - Notes field
 * - Price summary
 * - Proceed to Payment button
 */
export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      full: date.toISOString().split('T')[0],
    };
  });

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        amount: selectedService.price.toString(),
        date: selectedDate,
        time: selectedTime,
        notes,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Book Service" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Service</Text>
          <View style={styles.serviceList}>
            {SERVICES.map((service) => (
              <TouchableOpacity
                key={service.id}
                style={[
                  styles.serviceOption,
                  selectedService.id === service.id && styles.serviceOptionActive,
                ]}
                onPress={() => setSelectedService(service)}
              >
                <Text
                  style={[
                    styles.serviceName,
                    selectedService.id === service.id && styles.serviceNameActive,
                  ]}
                >
                  {service.name}
                </Text>
                <Text
                  style={[
                    styles.servicePrice,
                    selectedService.id === service.id && styles.servicePriceActive,
                  ]}
                >
                  ${service.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates.map((d) => (
                <TouchableOpacity
                  key={d.full}
                  style={[
                    styles.dateOption,
                    selectedDate === d.full && styles.dateOptionActive,
                  ]}
                  onPress={() => setSelectedDate(d.full)}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      selectedDate === d.full && styles.dateDayActive,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      selectedDate === d.full && styles.dateNumberActive,
                    ]}
                  >
                    {d.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  selectedTime === time && styles.timeOptionActive,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === time && styles.timeTextActive,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="E.g., We have pets, focus on kitchen..."
            placeholderTextColor={colors.gray[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{selectedService.name}</Text>
            <Text style={styles.priceValue}>${selectedService.price}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>$10</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${selectedService.price + 10}</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title="Proceed to Payment"
          onPress={handleProceedToPayment}
          fullWidth
          disabled={!selectedDate || !selectedTime}
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
    paddingBottom: spacing.xxl,
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
  serviceList: {
    gap: spacing.sm,
  },
  serviceOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  serviceOptionActive: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  serviceName: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  serviceNameActive: {
    color: colors.gray[900],
    fontWeight: '600',
  },
  servicePrice: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[600],
  },
  servicePriceActive: {
    color: colors.gray[900],
  },
  dateList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateOption: {
    width: 60,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  dateOptionActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  dateDay: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  dateDayActive: {
    color: colors.gray[300],
  },
  dateNumber: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  dateNumberActive: {
    color: colors.text.inverse,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeOption: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
  },
  timeOptionActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  timeTextActive: {
    color: colors.text.inverse,
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
    color: colors.gray[800],
  },
  totalRow: {
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
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


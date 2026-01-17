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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button } from '../../../../src/components/ui';

const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
  '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
];

const DURATION_OPTIONS = [
  { id: '2', label: '2 hours', hours: 2 },
  { id: '4', label: '4 hours', hours: 4 },
  { id: '8', label: '8 hours', hours: 8 },
  { id: '12', label: 'Overnight', hours: 12 },
];

const SERVICES = [
  { id: '1', name: 'Elder Care', pricePerHour: 25 },
  { id: '2', name: 'Child Care', pricePerHour: 20 },
  { id: '3', name: 'Companion Care', pricePerHour: 22 },
  { id: '4', name: 'Overnight Care', pricePerHour: 18 },
];

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[1]);
  const [notes, setNotes] = useState('');

  const dates = Array.from({ length: 14 }, (_, i) => {
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

    const total = selectedService.pricePerHour * selectedDuration.hours;

    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceId: selectedService.id,
        serviceName: `${selectedService.name} (${selectedDuration.label})`,
        amount: total.toString(),
        date: selectedDate,
        time: selectedTime,
        duration: selectedDuration.hours.toString(),
        notes,
      },
    });
  };

  const subtotal = selectedService.pricePerHour * selectedDuration.hours;
  const serviceFee = 10;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Book Care Service" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Care</Text>
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
                  ${service.pricePerHour}/hr
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map((duration) => (
              <TouchableOpacity
                key={duration.id}
                style={[
                  styles.durationOption,
                  selectedDuration.id === duration.id && styles.durationOptionActive,
                ]}
                onPress={() => setSelectedDuration(duration)}
              >
                <Text
                  style={[
                    styles.durationText,
                    selectedDuration.id === duration.id && styles.durationTextActive,
                  ]}
                >
                  {duration.label}
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
          <Text style={styles.sectionTitle}>Start Time</Text>
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
          <Text style={styles.sectionTitle}>Care Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="E.g., Dietary restrictions, medication schedule, emergency contacts..."
            placeholderTextColor={colors.gray[400]}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Price Summary */}
        <View style={styles.priceSummary}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              {selectedService.name} × {selectedDuration.hours} hrs
            </Text>
            <Text style={styles.priceValue}>${subtotal}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service Fee</Text>
            <Text style={styles.priceValue}>${serviceFee}</Text>
          </View>
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${subtotal + serviceFee}</Text>
          </View>
        </View>
      </ScrollView>

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
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  durationOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  durationOptionActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  durationText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  durationTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
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
    minHeight: 120,
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


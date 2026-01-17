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
import { Button } from '../../../../src/components/ui';

const VEHICLES = [
  { id: '1', name: 'Economy Car', price: 45, priceUnit: 'day' },
  { id: '2', name: 'SUV', price: 75, priceUnit: 'day' },
  { id: '3', name: 'Luxury Sedan', price: 120, priceUnit: 'day' },
  { id: '4', name: 'Van/Minivan', price: 85, priceUnit: 'day' },
];

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [pickupDate, setPickupDate] = useState<string | null>(null);
  const [returnDate, setReturnDate] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.getDate().toString(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      full: date.toISOString().split('T')[0],
    };
  });

  const calculateDays = () => {
    if (!pickupDate || !returnDate) return 1;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diff = Math.ceil((returnD.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  };

  const handleProceedToPayment = () => {
    if (!pickupDate || !returnDate) {
      Alert.alert('Error', 'Please select pickup and return dates');
      return;
    }

    const days = calculateDays();
    const total = selectedVehicle.price * days;

    router.push({
      pathname: '/checkout/payment',
      params: {
        serviceId: selectedVehicle.id,
        serviceName: `${selectedVehicle.name} (${days} days)`,
        amount: total.toString(),
        date: pickupDate,
        returnDate,
        notes,
      },
    });
  };

  const days = calculateDays();
  const subtotal = selectedVehicle.price * days;
  const serviceFee = 15;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Reserve Vehicle" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vehicle Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Vehicle</Text>
          <View style={styles.serviceList}>
            {VEHICLES.map((vehicle) => (
              <TouchableOpacity
                key={vehicle.id}
                style={[
                  styles.serviceOption,
                  selectedVehicle.id === vehicle.id && styles.serviceOptionActive,
                ]}
                onPress={() => setSelectedVehicle(vehicle)}
              >
                <View style={styles.vehicleInfo}>
                  <Ionicons name="car-outline" size={24} color={colors.gray[600]} />
                  <Text
                    style={[
                      styles.serviceName,
                      selectedVehicle.id === vehicle.id && styles.serviceNameActive,
                    ]}
                  >
                    {vehicle.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.servicePrice,
                    selectedVehicle.id === vehicle.id && styles.servicePriceActive,
                  ]}
                >
                  ${vehicle.price}/{vehicle.priceUnit}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pickup Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates.map((d) => (
                <TouchableOpacity
                  key={`pickup-${d.full}`}
                  style={[
                    styles.dateOption,
                    pickupDate === d.full && styles.dateOptionActive,
                  ]}
                  onPress={() => {
                    setPickupDate(d.full);
                    if (returnDate && returnDate < d.full) {
                      setReturnDate(null);
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.dateDay,
                      pickupDate === d.full && styles.dateDayActive,
                    ]}
                  >
                    {d.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateNumber,
                      pickupDate === d.full && styles.dateNumberActive,
                    ]}
                  >
                    {d.date}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      pickupDate === d.full && styles.dateMonthActive,
                    ]}
                  >
                    {d.month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Return Date */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Return Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates
                .filter((d) => !pickupDate || d.full >= pickupDate)
                .map((d) => (
                  <TouchableOpacity
                    key={`return-${d.full}`}
                    style={[
                      styles.dateOption,
                      returnDate === d.full && styles.dateOptionActive,
                    ]}
                    onPress={() => setReturnDate(d.full)}
                  >
                    <Text
                      style={[
                        styles.dateDay,
                        returnDate === d.full && styles.dateDayActive,
                      ]}
                    >
                      {d.day}
                    </Text>
                    <Text
                      style={[
                        styles.dateNumber,
                        returnDate === d.full && styles.dateNumberActive,
                      ]}
                    >
                      {d.date}
                    </Text>
                    <Text
                      style={[
                        styles.dateMonth,
                        returnDate === d.full && styles.dateMonthActive,
                      ]}
                    >
                      {d.month}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="E.g., Need car seat, preferred pickup location..."
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
            <Text style={styles.priceLabel}>
              {selectedVehicle.name} × {days} {days === 1 ? 'day' : 'days'}
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
          disabled={!pickupDate || !returnDate}
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
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    width: 70,
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
  dateMonth: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  dateMonthActive: {
    color: colors.gray[300],
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


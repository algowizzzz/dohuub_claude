import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../../src/constants/theme';
import { ScreenHeader } from '../../../../../src/components/composite';
import { Button, Input } from '../../../../../src/components/ui';

/**
 * Ride Booking Form Screen matching wireframe:
 * - Pickup location input
 * - Add multiple stops (+ button)
 * - Final destination
 * - Round trip toggle
 * - Date/time selection
 * - Special needs notes
 * - Price estimate
 * - "Confirm Booking" button
 */
export default function RideBookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pickup, setPickup] = useState('');
  const [stops, setStops] = useState<string[]>([]);
  const [destination, setDestination] = useState('');
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [specialNeeds, setSpecialNeeds] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  const estimatedPrice = 25.00; // Would be calculated based on distance

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleConfirmBooking = async () => {
    setIsBooking(true);
    try {
      // TODO: Call API to create booking
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/services/caregiving/tracking/RIDE123');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Book Ride" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pickup Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Location</Text>
          <View style={styles.locationInput}>
            <Ionicons name="location" size={20} color={colors.gray[600]} />
            <TextInput
              style={styles.input}
              placeholder="Enter pickup address"
              placeholderTextColor={colors.gray[400]}
              value={pickup}
              onChangeText={setPickup}
            />
          </View>
        </View>

        {/* Stops */}
        {stops.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stops</Text>
            {stops.map((stop, index) => (
              <View key={index} style={styles.stopRow}>
                <View style={[styles.locationInput, { flex: 1 }]}>
                  <Ionicons name="ellipse-outline" size={16} color={colors.gray[500]} />
                  <TextInput
                    style={styles.input}
                    placeholder={`Stop ${index + 1}`}
                    placeholderTextColor={colors.gray[400]}
                    value={stop}
                    onChangeText={(value) => handleStopChange(index, value)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveStop(index)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.gray[400]} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Add Stop Button */}
        <TouchableOpacity style={styles.addStopButton} onPress={handleAddStop}>
          <Ionicons name="add-circle-outline" size={20} color={colors.gray[700]} />
          <Text style={styles.addStopText}>Add a stop</Text>
        </TouchableOpacity>

        {/* Destination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Destination</Text>
          <View style={styles.locationInput}>
            <Ionicons name="flag" size={20} color={colors.status.success} />
            <TextInput
              style={styles.input}
              placeholder="Enter destination address"
              placeholderTextColor={colors.gray[400]}
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        {/* Round Trip Toggle */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Round Trip</Text>
            <Text style={styles.toggleDescription}>Return to pickup location after destination</Text>
          </View>
          <Switch
            value={isRoundTrip}
            onValueChange={setIsRoundTrip}
            trackColor={{ false: colors.gray[300], true: colors.gray[600] }}
            thumbColor={colors.background}
          />
        </View>

        {/* Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <TouchableOpacity style={styles.dateTimeInput}>
              <Ionicons name="calendar-outline" size={20} color={colors.gray[600]} />
              <Text style={selectedDate ? styles.dateTimeText : styles.dateTimePlaceholder}>
                {selectedDate || 'Select date'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dateTimeInput}>
              <Ionicons name="time-outline" size={20} color={colors.gray[600]} />
              <Text style={selectedTime ? styles.dateTimeText : styles.dateTimePlaceholder}>
                {selectedTime || 'Select time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Needs Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Requirements (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g., Wheelchair assistance, walker, oxygen tank..."
            placeholderTextColor={colors.gray[400]}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={specialNeeds}
            onChangeText={setSpecialNeeds}
          />
        </View>

        {/* Price Estimate */}
        <View style={styles.priceEstimate}>
          <Text style={styles.priceLabel}>Estimated Price</Text>
          <Text style={styles.priceValue}>${estimatedPrice.toFixed(2)}</Text>
          {isRoundTrip && <Text style={styles.priceNote}>(includes return trip)</Text>}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title="Confirm Booking"
          onPress={handleConfirmBooking}
          fullWidth
          loading={isBooking}
          disabled={!pickup || !destination}
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
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  locationInput: {
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
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  removeButton: {
    padding: spacing.xs,
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    borderStyle: 'dashed',
    marginBottom: spacing.lg,
  },
  addStopText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  toggleDescription: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  dateTimeInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  dateTimeText: {
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  dateTimePlaceholder: {
    fontSize: fontSize.md,
    color: colors.gray[400],
  },
  notesInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray[900],
    minHeight: 80,
  },
  priceEstimate: {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  priceValue: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  priceNote: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


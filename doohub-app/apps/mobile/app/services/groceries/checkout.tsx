import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button } from '../../../src/components/ui';
import { useCartStore } from '../../../src/store/cartStore';
import { useAuthStore } from '../../../src/store/authStore';

const DELIVERY_TIMES = [
  { id: 'asap', label: 'ASAP', sublabel: '30-45 min' },
  { id: 'scheduled', label: 'Schedule', sublabel: 'Pick a time' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'cash', label: 'Cash on Delivery', icon: 'cash-outline' },
];

/**
 * Groceries Checkout Screen matching wireframe:
 * - Delivery address confirmation
 * - Delivery time selection
 * - Order summary
 * - Payment method selection
 * - "Place Order" button
 */
export default function CheckoutScreen() {
  const { subtotal, clearCart } = useCartStore();
  const { addresses, selectedAddressId } = useAuthStore();
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('asap');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);
  const deliveryFee = 4.99;
  const serviceFee = 1.99;
  const total = subtotal + deliveryFee + serviceFee;

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      // TODO: Call API to place order
      await new Promise(resolve => setTimeout(resolve, 1500));
      await clearCart();
      router.replace('/services/groceries/tracking/ORDER123');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Checkout" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <Ionicons name="location" size={24} color={colors.gray[800]} />
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>{selectedAddress?.label || 'Home'}</Text>
              <Text style={styles.addressText}>
                {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile/addresses')}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Time</Text>
          <View style={styles.optionsRow}>
            {DELIVERY_TIMES.map((time) => (
              <TouchableOpacity
                key={time.id}
                style={[
                  styles.timeOption,
                  selectedDeliveryTime === time.id && styles.timeOptionActive,
                ]}
                onPress={() => setSelectedDeliveryTime(time.id)}
              >
                <Text
                  style={[
                    styles.timeLabel,
                    selectedDeliveryTime === time.id && styles.timeLabelActive,
                  ]}
                >
                  {time.label}
                </Text>
                <Text
                  style={[
                    styles.timeSublabel,
                    selectedDeliveryTime === time.id && styles.timeSublabelActive,
                  ]}
                >
                  {time.sublabel}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>${serviceFee.toFixed(2)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryTotal]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentOption,
                selectedPayment === method.id && styles.paymentOptionActive,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons
                name={method.icon as any}
                size={24}
                color={selectedPayment === method.id ? colors.gray[900] : colors.gray[500]}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  selectedPayment === method.id && styles.paymentLabelActive,
                ]}
              >
                {method.label}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  selectedPayment === method.id && styles.radioOuterActive,
                ]}
              >
                {selectedPayment === method.id && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Place Order CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Place Order - $${total.toFixed(2)}`}
          onPress={handlePlaceOrder}
          fullWidth
          loading={isPlacingOrder}
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
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  changeText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  timeOption: {
    flex: 1,
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  timeOptionActive: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  timeLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  timeLabelActive: {
    color: colors.gray[900],
  },
  timeSublabel: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  timeSublabelActive: {
    color: colors.gray[700],
  },
  summaryCard: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  summaryValue: {
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  summaryTotal: {
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
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  paymentOptionActive: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  paymentLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  paymentLabelActive: {
    color: colors.gray[900],
    fontWeight: '500',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: colors.gray[800],
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gray[800],
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


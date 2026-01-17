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
import { Button, Input } from '../../src/components/ui';

/**
 * Payment screen matching wireframe:
 * - Order summary
 * - Payment method selection
 * - Card input fields (Stripe integration placeholder)
 * - Pay Now button
 */
export default function PaymentScreen() {
  const { serviceName, amount, date, time, notes } = useLocalSearchParams<{
    serviceName: string;
    amount: string;
    date: string;
    time: string;
    notes?: string;
  }>();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalAmount = parseInt(amount || '0') + 10; // Add service fee

  const handlePayNow = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiry || !cvc) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.replace({
        pathname: '/checkout/confirmation',
        params: {
          serviceName,
          amount: totalAmount.toString(),
          date,
          time,
          bookingId: 'BK' + Date.now(),
        },
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{serviceName}</Text>
              <Text style={styles.summaryValue}>${amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{date}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{time}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>$10</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'card' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons
              name="card"
              size={24}
              color={paymentMethod === 'card' ? colors.gray[900] : colors.gray[500]}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'card' && styles.paymentOptionTextActive,
              ]}
            >
              Credit / Debit Card
            </Text>
            <View style={styles.radioOuter}>
              {paymentMethod === 'card' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === 'apple' && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod('apple')}
          >
            <Ionicons
              name="logo-apple"
              size={24}
              color={paymentMethod === 'apple' ? colors.gray[900] : colors.gray[500]}
            />
            <Text
              style={[
                styles.paymentOptionText,
                paymentMethod === 'apple' && styles.paymentOptionTextActive,
              ]}
            >
              Apple Pay
            </Text>
            <View style={styles.radioOuter}>
              {paymentMethod === 'apple' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <Input
              placeholder="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={styles.cardRow}>
              <View style={styles.halfInput}>
                <Input
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  placeholder="CVC"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {/* Secure Payment Notice */}
        <View style={styles.secureNotice}>
          <Ionicons name="lock-closed" size={16} color={colors.gray[500]} />
          <Text style={styles.secureText}>
            Your payment is secured by Stripe. We never store your card details.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button
          title={`Pay $${totalAmount}`}
          onPress={handlePayNow}
          loading={isProcessing}
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
  },
  paymentOptionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  paymentOptionTextActive: {
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
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.gray[800],
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  secureNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
  },
  secureText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[500],
    lineHeight: 18,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


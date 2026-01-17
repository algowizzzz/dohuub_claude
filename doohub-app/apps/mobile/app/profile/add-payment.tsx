import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';

/**
 * Add Payment Method Screen matching wireframe:
 * - Card number input
 * - Expiry date input
 * - CVC input
 * - Cardholder name
 * - Set as default toggle
 * - "Add Card" button
 */
export default function AddPaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleAddCard = async () => {
    setIsAdding(true);
    try {
      // TODO: Call Stripe API to tokenize and save card
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.back();
    } finally {
      setIsAdding(false);
    }
  };

  const isFormValid = cardNumber.length >= 18 && expiry.length === 5 && cvc.length >= 3 && cardholderName.trim() !== '';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Add Payment Method" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewTop}>
            <Ionicons name="card" size={32} color={colors.text.inverse} />
            <Text style={styles.cardPreviewType}>Credit Card</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>CARDHOLDER</Text>
              <Text style={styles.cardPreviewValue}>
                {cardholderName.toUpperCase() || 'YOUR NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
              <Text style={styles.cardPreviewValue}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        {/* Card Number */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card-outline" size={20} color={colors.gray[500]} />
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.gray[400]}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              keyboardType="numeric"
              maxLength={19}
            />
          </View>
        </View>

        {/* Expiry and CVC Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor={colors.gray[400]}
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>CVC</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="123"
                placeholderTextColor={colors.gray[400]}
                value={cvc}
                onChangeText={setCvc}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        {/* Cardholder Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cardholder Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={colors.gray[500]} />
            <TextInput
              style={styles.input}
              placeholder="Name on card"
              placeholderTextColor={colors.gray[400]}
              value={cardholderName}
              onChangeText={setCardholderName}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Set as Default */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Set as default</Text>
            <Text style={styles.toggleDescription}>
              Use this card for all payments
            </Text>
          </View>
          <Switch
            value={setAsDefault}
            onValueChange={setSetAsDefault}
            trackColor={{ false: colors.gray[300], true: colors.gray[600] }}
            thumbColor={colors.background}
          />
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Ionicons name="lock-closed" size={16} color={colors.gray[500]} />
          <Text style={styles.securityText}>
            Your card information is securely encrypted
          </Text>
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.footer}>
        <Button
          title="Add Card"
          onPress={handleAddCard}
          fullWidth
          loading={isAdding}
          disabled={!isFormValid}
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
  cardPreview: {
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  cardPreviewTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardPreviewType: {
    fontSize: fontSize.sm,
    color: colors.gray[400],
  },
  cardPreviewNumber: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.inverse,
    letterSpacing: 2,
    fontFamily: 'monospace',
    marginBottom: spacing.lg,
  },
  cardPreviewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardPreviewLabel: {
    fontSize: fontSize.xs,
    color: colors.gray[400],
    marginBottom: spacing.xs,
  },
  cardPreviewValue: {
    fontSize: fontSize.sm,
    color: colors.text.inverse,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
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
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  securityText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


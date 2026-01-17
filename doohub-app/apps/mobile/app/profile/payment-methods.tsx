import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, EmptyState } from '../../src/components/ui';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: '1', type: 'visa', last4: '4242', expiry: '12/26', isDefault: true },
  { id: '2', type: 'mastercard', last4: '8888', expiry: '08/27', isDefault: false },
];

const getCardIcon = (type: string) => {
  switch (type) {
    case 'visa':
      return '💳';
    case 'mastercard':
      return '💳';
    case 'amex':
      return '💳';
    default:
      return '💳';
  }
};

const getCardName = (type: string) => {
  switch (type) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'American Express';
    default:
      return 'Card';
  }
};

/**
 * Payment Methods List Screen matching wireframe:
 * - Header: "Payment Methods"
 * - List of saved cards
 * - Default card indicator
 * - Add new card button
 */
export default function PaymentMethodsScreen() {
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch payment methods from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddCard = () => {
    router.push('/profile/add-payment');
  };

  const handleEditCard = (cardId: string) => {
    router.push(`/profile/edit-payment/${cardId}`);
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => handleEditCard(item.id)}
    >
      <View style={styles.cardIcon}>
        <Text style={styles.cardEmoji}>{getCardIcon(item.type)}</Text>
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{getCardName(item.type)}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>
        <Text style={styles.cardExpiry}>Expires {item.expiry}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment Methods" showBack />

      {paymentMethods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            icon="card-outline"
            title="No payment methods"
            message="Add a card to make payments faster and easier"
          />
          <Button
            title="Add Payment Method"
            onPress={handleAddCard}
            style={styles.addButtonEmpty}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={paymentMethods}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentMethod}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <Button
              title="Add Payment Method"
              onPress={handleAddCard}
              fullWidth
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  addButtonEmpty: {
    marginTop: spacing.lg,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginRight: spacing.sm,
  },
  defaultBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.status.success,
    borderRadius: borderRadius.sm,
  },
  defaultText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  cardNumber: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontFamily: 'monospace',
    marginBottom: spacing.xs,
  },
  cardExpiry: {
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


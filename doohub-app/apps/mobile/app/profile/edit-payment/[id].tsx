import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Switch,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button } from '../../../src/components/ui';
import { ConfirmModal } from '../../../src/components/modals';

const MOCK_CARD = {
  id: '1',
  type: 'visa',
  last4: '4242',
  expiry: '12/26',
  cardholderName: 'JOHN DOE',
  isDefault: true,
};

/**
 * Edit Payment Method Screen matching wireframe:
 * - Card info display
 * - Set as default toggle
 * - Delete card button
 */
export default function EditPaymentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [card] = useState(MOCK_CARD);
  const [isDefault, setIsDefault] = useState(card.isDefault);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Call API to update card
      await new Promise(resolve => setTimeout(resolve, 500));
      router.back();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      // TODO: Call API to delete card
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowDeleteModal(false);
      router.back();
    } catch (error) {
      console.error('Failed to delete card:', error);
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

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Edit Payment Method" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <View style={styles.cardPreviewTop}>
            <Ionicons name="card" size={32} color={colors.text.inverse} />
            <Text style={styles.cardPreviewType}>{getCardName(card.type)}</Text>
          </View>
          <Text style={styles.cardPreviewNumber}>
            •••• •••• •••• {card.last4}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <View>
              <Text style={styles.cardPreviewLabel}>CARDHOLDER</Text>
              <Text style={styles.cardPreviewValue}>{card.cardholderName}</Text>
            </View>
            <View>
              <Text style={styles.cardPreviewLabel}>EXPIRES</Text>
              <Text style={styles.cardPreviewValue}>{card.expiry}</Text>
            </View>
          </View>
        </View>

        {/* Card Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Card Type</Text>
            <Text style={styles.detailValue}>{getCardName(card.type)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Card Number</Text>
            <Text style={styles.detailValue}>•••• {card.last4}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Expiry</Text>
            <Text style={styles.detailValue}>{card.expiry}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Cardholder</Text>
            <Text style={styles.detailValue}>{card.cardholderName}</Text>
          </View>
        </View>

        {/* Set as Default */}
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Default Payment Method</Text>
            <Text style={styles.toggleDescription}>
              Use this card for all payments
            </Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: colors.gray[300], true: colors.gray[600] }}
            thumbColor={colors.background}
          />
        </View>

        {/* Save Button */}
        <Button
          title="Save Changes"
          onPress={handleSave}
          fullWidth
          loading={isSaving}
          style={styles.saveButton}
        />

        {/* Delete Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteModal(true)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.status.error} />
          <Text style={styles.deleteText}>Remove Card</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Remove Card"
        message="Are you sure you want to remove this payment method?"
        type="danger"
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[100],
  },
  detailLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  detailValue: {
    fontSize: fontSize.md,
    color: colors.gray[900],
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
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
  saveButton: {
    marginBottom: spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  deleteText: {
    fontSize: fontSize.md,
    color: colors.status.error,
  },
});


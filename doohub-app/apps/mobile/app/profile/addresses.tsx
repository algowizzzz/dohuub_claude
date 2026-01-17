import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';

const ADDRESS_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Work: 'briefcase',
  Doctor: 'medkit',
  Pharmacy: 'medical',
  Other: 'location',
};

/**
 * Saved Addresses screen matching wireframe:
 * - List of saved addresses
 * - Edit/Delete options
 * - Add new address button
 */
export default function AddressesScreen() {
  const { addresses } = useAuthStore();

  const handleEditAddress = (addressId: string) => {
    router.push({
      pathname: '/profile/add-address',
      params: { id: addressId, edit: 'true' },
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleAddAddress = () => {
    router.push('/profile/add-address');
  };

  const renderAddress = ({ item }: { item: any }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressIcon}>
        <Ionicons
          name={ADDRESS_ICONS[item.label] || 'location'}
          size={24}
          color={colors.gray[600]}
        />
      </View>
      <View style={styles.addressInfo}>
        <Text style={styles.addressLabel}>{item.label}</Text>
        <Text style={styles.addressStreet}>{item.street}</Text>
        <Text style={styles.addressCity}>
          {item.city}, {item.state} {item.zipCode}
        </Text>
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEditAddress(item.id)}
        >
          <Ionicons name="create-outline" size={20} color={colors.gray[600]} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteAddress(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={colors.status.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="location-outline" size={64} color={colors.gray[400]} />
      </View>
      <Text style={styles.emptyTitle}>No addresses saved</Text>
      <Text style={styles.emptyText}>Add your frequently used addresses for faster booking</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Saved Addresses" showBack />

      <FlatList
        data={addresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.ctaContainer}>
        <Button
          title="Add New Address"
          onPress={handleAddAddress}
          fullWidth
          icon={<Ionicons name="add" size={20} color={colors.text.inverse} />}
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
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  addressCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
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
  addressStreet: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  addressCity: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  addressActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    maxWidth: 280,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
});


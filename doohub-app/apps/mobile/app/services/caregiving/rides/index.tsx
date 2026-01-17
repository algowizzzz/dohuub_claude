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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Rating } from '../../../../src/components/ui';

const VEHICLE_TYPES = ['All', 'Sedan', 'SUV', 'Wheelchair Accessible', 'Medical Transport'];

const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'DoHuub Ride Care',
    rating: 4.9,
    reviewCount: 156,
    vehicleTypes: ['Sedan', 'SUV'],
    pricePerMile: 2.50,
    isPoweredByDoHuub: true,
  },
  {
    id: '2',
    name: 'Senior Transport Plus',
    rating: 4.8,
    reviewCount: 98,
    vehicleTypes: ['Wheelchair Accessible', 'Medical Transport'],
    pricePerMile: 3.00,
    isPoweredByDoHuub: false,
  },
  {
    id: '3',
    name: 'Comfort Rides',
    rating: 4.7,
    reviewCount: 124,
    vehicleTypes: ['Sedan', 'SUV'],
    pricePerMile: 2.25,
    isPoweredByDoHuub: false,
  },
];

/**
 * Ride Providers List Screen matching wireframe:
 * - Header: "Ride Assistance"
 * - Provider cards (name, rating, vehicle type, price)
 * - Filter by: vehicle type, rating
 */
export default function RideProvidersScreen() {
  const [selectedVehicleType, setSelectedVehicleType] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredProviders = selectedVehicleType === 'All'
    ? MOCK_PROVIDERS
    : MOCK_PROVIDERS.filter(p => p.vehicleTypes.includes(selectedVehicleType));

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/services/caregiving/rides/${providerId}`);
  };

  const renderProvider = ({ item }: { item: typeof MOCK_PROVIDERS[0] }) => (
    <TouchableOpacity
      style={styles.providerCard}
      onPress={() => handleProviderPress(item.id)}
    >
      <View style={styles.providerIcon}>
        <Ionicons name="car" size={32} color={colors.gray[400]} />
      </View>
      <View style={styles.providerInfo}>
        <View style={styles.providerHeader}>
          <Text style={styles.providerName}>{item.name}</Text>
          {item.isPoweredByDoHuub && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DoHuub</Text>
            </View>
          )}
        </View>
        <Rating rating={item.rating} reviewCount={item.reviewCount} />
        <View style={styles.providerMeta}>
          <Text style={styles.vehicleTypesText}>
            {item.vehicleTypes.join(', ')}
          </Text>
          <Text style={styles.priceText}>${item.pricePerMile.toFixed(2)}/mile</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Ride Assistance" showBack />

      {/* Vehicle Type Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={VEHICLE_TYPES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedVehicleType === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedVehicleType(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedVehicleType === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={renderProvider}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.gray[800],
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.lg,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  providerIcon: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  providerInfo: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  providerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginRight: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  providerMeta: {
    marginTop: spacing.xs,
  },
  vehicleTypesText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  priceText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
});


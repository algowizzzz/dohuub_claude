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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Badge, Rating } from '../../../src/components/ui';

interface Property {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  isPoweredByDoHuub: boolean;
}

const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Luxury Downtown Apartment',
    address: '123 Main St, Downtown',
    bedrooms: 2,
    bathrooms: 2,
    price: 150,
    priceUnit: '/night',
    rating: 4.9,
    reviewCount: 89,
    amenities: ['WiFi', 'Kitchen', 'Parking'],
    isPoweredByDoHuub: true,
  },
  {
    id: '2',
    name: 'Cozy Studio Near Park',
    address: '456 Oak Ave',
    bedrooms: 1,
    bathrooms: 1,
    price: 85,
    priceUnit: '/night',
    rating: 4.7,
    reviewCount: 56,
    amenities: ['WiFi', 'Laundry'],
    isPoweredByDoHuub: false,
  },
];

const FILTERS = [
  { id: 'bedrooms', name: 'Bedrooms', icon: 'bed' },
  { id: 'price', name: 'Price', icon: 'cash' },
  { id: 'amenities', name: 'Amenities', icon: 'options' },
];

export default function RentalsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [properties] = useState(MOCK_PROPERTIES);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/services/rentals/${propertyId}`);
  };

  const renderFilters = () => (
    <View style={styles.filters}>
      {FILTERS.map((filter) => (
        <TouchableOpacity key={filter.id} style={styles.filterPill}>
          <Ionicons name={filter.icon as any} size={16} color={colors.gray[700]} />
          <Text style={styles.filterText}>{filter.name}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.gray[500]} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProperty = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() => handlePropertyPress(item.id)}
    >
      <View style={styles.propertyImage}>
        <Ionicons name="home" size={48} color={colors.gray[400]} />
      </View>
      <View style={styles.propertyContent}>
        {item.isPoweredByDoHuub && (
          <Badge text="Powered by DoHuub" variant="dohuub" />
        )}
        <Text style={styles.propertyName}>{item.name}</Text>
        <Text style={styles.propertyAddress}>{item.address}</Text>
        <View style={styles.propertyDetails}>
          <Text style={styles.detailText}>{item.bedrooms} bed</Text>
          <Text style={styles.detailDot}>•</Text>
          <Text style={styles.detailText}>{item.bathrooms} bath</Text>
        </View>
        <View style={styles.propertyFooter}>
          <Rating rating={item.rating} reviewCount={item.reviewCount} size="sm" />
          <Text style={styles.propertyPrice}>
            ${item.price}{item.priceUnit}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Rental Properties" showBack />

      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderFilters}
        renderItem={renderProperty}
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
  listContent: {
    padding: spacing.lg,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  propertyCard: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  propertyImage: {
    height: 160,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  propertyName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  propertyAddress: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  detailDot: {
    color: colors.gray[400],
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  propertyPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
});


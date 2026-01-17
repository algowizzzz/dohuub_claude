import React, { useState, useEffect } from 'react';
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
import { ScreenHeader, ProviderCard } from '../../../src/components/composite';

// Mock data - would come from API
const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'DoHuub Premium Cleaning',
    rating: 4.9,
    reviewCount: 234,
    distance: '0.5 mi',
    startingPrice: 150,
    priceUnit: '/service',
    isPoweredByDoHuub: true,
  },
  {
    id: '2',
    name: 'Sparkle Clean Services',
    rating: 4.7,
    reviewCount: 156,
    distance: '1.2 mi',
    startingPrice: 120,
    priceUnit: '/service',
    isPoweredByDoHuub: false,
  },
  {
    id: '3',
    name: 'Fresh Home Cleaners',
    rating: 4.5,
    reviewCount: 89,
    distance: '2.0 mi',
    startingPrice: 100,
    priceUnit: '/service',
    isPoweredByDoHuub: false,
  },
];

const SUB_CATEGORIES = [
  { id: 'deep', name: 'Deep Cleaning', icon: 'sparkles' },
  { id: 'laundry', name: 'Laundry', icon: 'water' },
  { id: 'office', name: 'Office Cleaning', icon: 'business' },
];

/**
 * Cleaning Services listing screen matching wireframe:
 * - Header with back button
 * - Sub-category pills (Deep Cleaning, Laundry, Office)
 * - Provider list with Michelle's first
 */
export default function CleaningServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [providers, setProviders] = useState(MOCK_PROVIDERS);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch providers from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/services/cleaning/${providerId}`);
  };

  const renderSubCategories = () => (
    <View style={styles.subCategories}>
      {SUB_CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.subCategoryPill,
            selectedCategory === cat.id && styles.subCategoryPillActive,
          ]}
          onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
        >
          <Ionicons
            name={cat.icon as any}
            size={16}
            color={selectedCategory === cat.id ? colors.text.inverse : colors.gray[700]}
          />
          <Text
            style={[
              styles.subCategoryText,
              selectedCategory === cat.id && styles.subCategoryTextActive,
            ]}
          >
            {cat.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Cleaning Services" showBack />

      <FlatList
        data={providers}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderSubCategories}
        renderItem={({ item }) => (
          <ProviderCard
            id={item.id}
            name={item.name}
            rating={item.rating}
            reviewCount={item.reviewCount}
            distance={item.distance}
            startingPrice={item.startingPrice}
            priceUnit={item.priceUnit}
            isPoweredByDoHuub={item.isPoweredByDoHuub}
            onPress={() => handleProviderPress(item.id)}
          />
        )}
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
  subCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  subCategoryPill: {
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
  subCategoryPillActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  subCategoryText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  subCategoryTextActive: {
    color: colors.text.inverse,
  },
});


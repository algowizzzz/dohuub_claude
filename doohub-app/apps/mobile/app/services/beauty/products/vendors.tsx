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

const MOCK_VENDORS = [
  {
    id: '1',
    name: 'GlowSkin Beauty',
    rating: 4.8,
    reviewCount: 234,
    productCount: 45,
    categories: ['Skincare', 'Tools'],
    isPoweredByDoHuub: true,
  },
  {
    id: '2',
    name: 'HairLux',
    rating: 4.7,
    reviewCount: 189,
    productCount: 32,
    categories: ['Haircare'],
    isPoweredByDoHuub: false,
  },
  {
    id: '3',
    name: 'BeautyPro',
    rating: 4.9,
    reviewCount: 312,
    productCount: 68,
    categories: ['Makeup', 'Tools'],
    isPoweredByDoHuub: true,
  },
  {
    id: '4',
    name: 'Luxe Fragrances',
    rating: 4.6,
    reviewCount: 156,
    productCount: 24,
    categories: ['Fragrance'],
    isPoweredByDoHuub: false,
  },
];

/**
 * Beauty Products Vendors List matching wireframe:
 * - List of beauty product vendors
 * - Vendor cards (logo, name, rating, product count)
 * - Filter by product type
 */
export default function BeautyVendorsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleVendorPress = (vendorId: string) => {
    router.push(`/services/beauty/products/vendors/${vendorId}`);
  };

  const renderVendor = ({ item }: { item: typeof MOCK_VENDORS[0] }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item.id)}
    >
      <View style={styles.vendorLogo}>
        <Ionicons name="storefront" size={32} color={colors.gray[400]} />
      </View>
      <View style={styles.vendorInfo}>
        <View style={styles.vendorHeader}>
          <Text style={styles.vendorName}>{item.name}</Text>
          {item.isPoweredByDoHuub && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>DoHuub</Text>
            </View>
          )}
        </View>
        <Rating rating={item.rating} reviewCount={item.reviewCount} />
        <View style={styles.vendorMeta}>
          <Text style={styles.productCount}>{item.productCount} products</Text>
          <Text style={styles.categoriesText}>
            {item.categories.join(', ')}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Beauty Vendors" showBack />

      <FlatList
        data={MOCK_VENDORS}
        keyExtractor={(item) => item.id}
        renderItem={renderVendor}
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
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  vendorLogo: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  vendorName: {
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
  vendorMeta: {
    marginTop: spacing.xs,
  },
  productCount: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    marginBottom: spacing.xs,
  },
  categoriesText: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
  },
});


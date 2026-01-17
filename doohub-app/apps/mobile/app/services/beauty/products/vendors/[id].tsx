import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../../src/constants/theme';
import { ScreenHeader } from '../../../../../src/components/composite';
import { Rating, Badge } from '../../../../../src/components/ui';
import { useCartStore } from '../../../../../src/store/cartStore';

const MOCK_VENDOR = {
  id: '1',
  name: 'GlowSkin Beauty',
  description: 'Premium skincare and beauty products for all skin types.',
  rating: 4.8,
  reviewCount: 234,
  categories: ['Serums', 'Moisturizers', 'Cleansers', 'Tools'],
  isPoweredByDoHuub: true,
};

const MOCK_PRODUCTS = [
  { id: '1', name: 'Vitamin C Serum', price: 45.99, category: 'Serums' },
  { id: '2', name: 'Hyaluronic Acid', price: 38.99, category: 'Serums' },
  { id: '3', name: 'Daily Moisturizer', price: 32.00, category: 'Moisturizers' },
  { id: '4', name: 'Night Repair Cream', price: 55.00, category: 'Moisturizers' },
  { id: '5', name: 'Gentle Cleanser', price: 24.99, category: 'Cleansers' },
  { id: '6', name: 'Jade Roller', price: 28.00, category: 'Tools' },
];

/**
 * Beauty Products Vendor Profile matching wireframe:
 * - Vendor header
 * - Product categories
 * - Products grid
 * - Add to cart
 * - Reviews section
 */
export default function VendorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor] = useState(MOCK_VENDOR);
  const [selectedCategory, setSelectedCategory] = useState('Serums');
  const { items, addItem } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const filteredProducts = MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
  };

  const handleViewCart = () => {
    router.push('/services/groceries/cart');
  };

  const handleViewReviews = () => {
    router.push(`/reviews/${id}`);
  };

  const renderProduct = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Ionicons name="sparkles-outline" size={24} color={colors.gray[400]} />
      </View>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item.id)}
      >
        <Ionicons name="add" size={18} color={colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader showBack title={vendor.name} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Vendor Header */}
        <View style={styles.vendorHeader}>
          <View style={styles.vendorLogo}>
            <Ionicons name="storefront" size={40} color={colors.gray[400]} />
          </View>
          <View style={styles.vendorInfo}>
            {vendor.isPoweredByDoHuub && (
              <Badge text="Powered by DoHuub" variant="dohuub" />
            )}
            <TouchableOpacity onPress={handleViewReviews}>
              <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description}>{vendor.description}</Text>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {vendor.categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && styles.categoryTabActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  selectedCategory === category && styles.categoryTabTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productWrapper}>
              {renderProduct({ item: product })}
            </View>
          ))}
        </View>

        {/* Reviews Preview */}
        <TouchableOpacity style={styles.reviewsSection} onPress={handleViewReviews}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <Text style={styles.seeAllLink}>See All</Text>
          </View>
          <Text style={styles.reviewsPreview}>
            {vendor.reviewCount} reviews with {vendor.rating} average rating
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Floating Cart Button */}
      {cartItemCount > 0 && (
        <TouchableOpacity style={styles.cartButton} onPress={handleViewCart}>
          <View style={styles.cartButtonContent}>
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
            <Text style={styles.cartButtonText}>View Cart</Text>
            <Ionicons name="cart" size={20} color={colors.text.inverse} />
          </View>
        </TouchableOpacity>
      )}
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
    paddingBottom: 100,
  },
  vendorHeader: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  vendorLogo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  vendorInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 22,
    padding: spacing.lg,
  },
  categoryTabs: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  categoryTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  categoryTabActive: {
    backgroundColor: colors.gray[800],
  },
  categoryTabText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  categoryTabTextActive: {
    color: colors.text.inverse,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  productWrapper: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  productCard: {
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
    minHeight: 36,
  },
  productPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewsSection: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reviewsTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  seeAllLink: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  reviewsPreview: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  cartButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    backgroundColor: colors.status.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  cartBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  cartButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.inverse,
    marginRight: spacing.sm,
  },
});


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
import { useCartStore } from '../../../../src/store/cartStore';

const CATEGORIES = ['All', 'Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Tools'];

const MOCK_PRODUCTS = [
  { id: '1', name: 'Hydrating Face Serum', brand: 'GlowSkin', price: 45.99, category: 'Skincare' },
  { id: '2', name: 'Repair Shampoo', brand: 'HairLux', price: 28.99, category: 'Haircare' },
  { id: '3', name: 'Matte Lipstick Set', brand: 'BeautyPro', price: 35.00, category: 'Makeup' },
  { id: '4', name: 'Deep Conditioner', brand: 'HairLux', price: 32.99, category: 'Haircare' },
  { id: '5', name: 'Vitamin C Cream', brand: 'GlowSkin', price: 52.00, category: 'Skincare' },
  { id: '6', name: 'Eau de Parfum', brand: 'Luxe', price: 89.99, category: 'Fragrance' },
];

/**
 * Beauty Products Catalog matching wireframe:
 * - Header: "Beauty Products"
 * - Category filter (skincare, haircare, makeup, etc.)
 * - Product cards grid
 * - Add to cart functionality
 * - Filter/sort options
 */
export default function BeautyProductsCatalogScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const { items, addItem } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = selectedCategory === 'All'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
  };

  const handleViewVendors = () => {
    router.push('/services/beauty/products/vendors');
  };

  const handleViewCart = () => {
    router.push('/services/groceries/cart');
  };

  const renderProduct = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Ionicons name="sparkles-outline" size={32} color={colors.gray[400]} />
      </View>
      <Text style={styles.productBrand}>{item.brand}</Text>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleAddToCart(item.id)}
      >
        <Ionicons name="add" size={20} color={colors.text.inverse} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Beauty Products"
        showBack
        rightIcon="storefront-outline"
        onRightAction={handleViewVendors}
      />

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={CATEGORIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedCategory === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

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
  filterContainer: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
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
  productList: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productBrand: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  productName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
    minHeight: 40,
  },
  productPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: spacing.sm,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
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


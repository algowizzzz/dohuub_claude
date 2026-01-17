import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Rating } from '../../../../src/components/ui';
import { useCartStore } from '../../../../src/store/cartStore';

// Mock data
const MOCK_STORE = {
  id: '1',
  name: 'Fresh Market Groceries',
  rating: 4.6,
  reviewCount: 423,
  deliveryTime: '30-45 min',
  deliveryFee: 4.99,
  categories: ['Fresh Produce', 'Dairy & Eggs', 'Meat & Seafood', 'Bakery', 'Pantry'],
};

const MOCK_PRODUCTS = [
  { id: '1', category: 'Fresh Produce', name: 'Organic Bananas', price: 2.99, unit: 'bunch' },
  { id: '2', category: 'Fresh Produce', name: 'Avocados', price: 1.99, unit: 'each' },
  { id: '3', category: 'Fresh Produce', name: 'Spinach', price: 3.49, unit: 'bag' },
  { id: '4', category: 'Dairy & Eggs', name: 'Whole Milk', price: 4.99, unit: 'gallon' },
  { id: '5', category: 'Dairy & Eggs', name: 'Large Eggs', price: 5.99, unit: 'dozen' },
  { id: '6', category: 'Meat & Seafood', name: 'Chicken Breast', price: 8.99, unit: 'lb' },
  { id: '7', category: 'Bakery', name: 'Sourdough Bread', price: 4.99, unit: 'loaf' },
  { id: '8', category: 'Pantry', name: 'Olive Oil', price: 12.99, unit: 'bottle' },
];

/**
 * Grocery Store Detail Screen matching wireframe:
 * - Store header
 * - Category navigation
 * - Product listing with prices
 * - Search within store
 * - Add to cart
 */
export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store] = useState(MOCK_STORE);
  const [selectedCategory, setSelectedCategory] = useState('Fresh Produce');
  const [searchQuery, setSearchQuery] = useState('');
  const { items, addItem } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = async (productId: string) => {
    await addItem(productId);
  };

  const handleViewCart = () => {
    router.push('/services/groceries/cart');
  };

  const renderProduct = ({ item }: { item: typeof MOCK_PRODUCTS[0] }) => (
    <View style={styles.productCard}>
      <View style={styles.productImage}>
        <Ionicons name="cube-outline" size={32} color={colors.gray[400]} />
      </View>
      <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.productUnit}>{item.unit}</Text>
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
      <ScreenHeader showBack title={store.name} />

      {/* Store Header */}
      <View style={styles.storeHeader}>
        <Rating rating={store.rating} reviewCount={store.reviewCount} />
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryText}>{store.deliveryTime}</Text>
          <Text style={styles.deliveryDot}>•</Text>
          <Text style={styles.deliveryText}>${store.deliveryFee} delivery</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.gray[400]} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.gray[400]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryNav}
        contentContainerStyle={styles.categoryNavContent}
      >
        {store.categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productList}
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
  storeHeader: {
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  deliveryText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  deliveryDot: {
    marginHorizontal: spacing.xs,
    color: colors.gray[400],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[900],
  },
  categoryNav: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  categoryNavContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: colors.gray[800],
  },
  categoryButtonText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  categoryButtonTextActive: {
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
  productName: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  productUnit: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginBottom: spacing.xs,
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


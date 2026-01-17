import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button, Badge, Rating } from '../../../../src/components/ui';
import { useCartStore } from '../../../../src/store/cartStore';

// Mock data
const MOCK_VENDOR = {
  id: '1',
  name: 'Quick Bites Restaurant',
  rating: 4.7,
  reviewCount: 245,
  deliveryTime: '25-35 min',
  deliveryFee: 2.99,
  minOrder: 12,
  categories: ['Appetizers', 'Main Courses', 'Desserts', 'Drinks'],
};

const MOCK_MENU = [
  { id: '1', category: 'Appetizers', name: 'Spring Rolls', price: 8.99, description: 'Crispy vegetable rolls' },
  { id: '2', category: 'Appetizers', name: 'Chicken Wings', price: 12.99, description: '6 pieces with dipping sauce' },
  { id: '3', category: 'Main Courses', name: 'Grilled Salmon', price: 18.99, description: 'With seasonal vegetables' },
  { id: '4', category: 'Main Courses', name: 'Pasta Primavera', price: 14.99, description: 'Fresh vegetables in cream sauce' },
  { id: '5', category: 'Desserts', name: 'Cheesecake', price: 7.99, description: 'New York style' },
  { id: '6', category: 'Drinks', name: 'Fresh Lemonade', price: 4.99, description: 'Freshly squeezed' },
];

/**
 * Food Vendor Detail Screen matching wireframe:
 * - Vendor header (logo, name, rating)
 * - Category tabs
 * - Product/dish grid
 * - Add to cart buttons
 * - Floating cart button with count
 */
export default function VendorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vendor] = useState(MOCK_VENDOR);
  const [selectedCategory, setSelectedCategory] = useState('Appetizers');
  const { items, addItem } = useCartStore();

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = MOCK_MENU.filter(item => item.category === selectedCategory);

  const handleAddToCart = async (itemId: string) => {
    await addItem(itemId);
  };

  const handleViewCart = () => {
    router.push('/services/groceries/cart');
  };

  const renderMenuItem = ({ item }: { item: typeof MOCK_MENU[0] }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuItemImage}>
        <Ionicons name="restaurant-outline" size={32} color={colors.gray[400]} />
      </View>
      <View style={styles.menuItemInfo}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      </View>
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
      <ScreenHeader showBack title={vendor.name} />

      {/* Vendor Header */}
      <View style={styles.vendorHeader}>
        <View style={styles.vendorLogo}>
          <Ionicons name="restaurant" size={40} color={colors.gray[400]} />
        </View>
        <View style={styles.vendorInfo}>
          <Rating rating={vendor.rating} reviewCount={vendor.reviewCount} />
          <View style={styles.deliveryInfo}>
            <Text style={styles.deliveryText}>{vendor.deliveryTime}</Text>
            <Text style={styles.deliveryDot}>•</Text>
            <Text style={styles.deliveryText}>${vendor.deliveryFee} delivery</Text>
            <Text style={styles.deliveryDot}>•</Text>
            <Text style={styles.deliveryText}>${vendor.minOrder} min</Text>
          </View>
        </View>
      </View>

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

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={renderMenuItem}
        contentContainerStyle={styles.menuList}
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
  vendorHeader: {
    flexDirection: 'row',
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
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
    justifyContent: 'center',
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
  categoryTabs: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  categoryTabsContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
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
  menuList: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  menuItemName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  menuItemDescription: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginBottom: spacing.xs,
  },
  menuItemPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
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


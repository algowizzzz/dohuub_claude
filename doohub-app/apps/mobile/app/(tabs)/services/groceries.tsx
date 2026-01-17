import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../src/services/api';
import { ENDPOINTS } from '../../../src/constants/api';
import { useCartStore } from '../../../src/store/cartStore';
import { Card, Rating, Badge, Button, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

export default function GroceriesScreen() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { items: cartItems, addItem } = useCartStore();

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (selectedVendor) {
      fetchListings();
    }
  }, [selectedVendor, selectedCategory]);

  const fetchVendors = async () => {
    try {
      const response: any = await api.get(`${ENDPOINTS.SERVICES.GROCERIES}/vendors/list`);
      setVendors(response.data || []);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      const params: any = { vendorId: selectedVendor };
      if (selectedCategory !== 'all') params.category = selectedCategory;
      const response: any = await api.get(ENDPOINTS.SERVICES.GROCERIES, params);
      setListings(response.data || []);
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedVendor) {
      await fetchListings();
    } else {
      await fetchVendors();
    }
    setRefreshing(false);
  };

  const handleAddToCart = async (listingId: string) => {
    try {
      await addItem(listingId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const renderVendorCard = ({ item }: { item: any }) => (
    <Card style={styles.vendorCard} onPress={() => setSelectedVendor(item.id)}>
      <View style={styles.vendorImage}>
        <Ionicons name="storefront" size={40} color={colors.text.muted} />
      </View>
      <View style={styles.vendorContent}>
        {item.isMichelle && <PoweredByDoHuubBadge />}
        <Text style={styles.vendorName}>{item.businessName}</Text>
        <Text style={styles.vendorDescription} numberOfLines={2}>{item.description}</Text>
        <Rating rating={item.rating || 0} reviewCount={item.reviewCount || 0} size="sm" />
      </View>
    </Card>
  );

  const renderProductCard = ({ item }: { item: any }) => {
    const inCart = cartItems.some(ci => ci.listingId === item.id);
    
    return (
      <Card style={styles.productCard}>
        <View style={styles.productImage}>
          <Ionicons name="nutrition" size={32} color={colors.text.muted} />
        </View>
        <View style={styles.productContent}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price}/{item.unit}</Text>
            <TouchableOpacity
              style={[styles.addButton, inCart && styles.addButtonActive]}
              onPress={() => handleAddToCart(item.id)}
            >
              <Ionicons 
                name={inCart ? "checkmark" : "add"} 
                size={20} 
                color={inCart ? colors.text.inverse : colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    );
  };

  if (selectedVendor) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setSelectedVendor(null)}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Products</Text>
          <TouchableOpacity onPress={() => router.push('/cart' as any)}>
            <View style={styles.cartButton}>
              <Ionicons name="cart" size={24} color={colors.text.primary} />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTab, selectedCategory === 'all' && styles.filterTabActive]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text style={[styles.filterTabText, selectedCategory === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.filterTab, selectedCategory === cat && styles.filterTabActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.filterTabText, selectedCategory === cat && styles.filterTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={listings}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productGrid}
          columnWrapperStyle={styles.productRow}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Groceries & Food</Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={vendors}
        renderItem={renderVendorCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No grocery vendors available</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: { padding: spacing.xs },
  title: { fontSize: fontSize.lg, fontWeight: '600', color: colors.text.primary },
  placeholder: { width: 32 },
  cartButton: { position: 'relative', padding: spacing.xs },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.status.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { fontSize: 10, color: colors.text.inverse, fontWeight: '600' },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
  },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: fontSize.sm, color: colors.text.secondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.text.inverse },
  listContent: { padding: spacing.lg },
  vendorCard: { marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center' },
  vendorImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  vendorContent: { flex: 1 },
  vendorName: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary },
  vendorDescription: { fontSize: fontSize.sm, color: colors.text.secondary, marginVertical: spacing.xs },
  productGrid: { padding: spacing.md },
  productRow: { justifyContent: 'space-between' },
  productCard: { width: '48%', marginBottom: spacing.md, padding: spacing.sm },
  productImage: {
    height: 80,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  productContent: { flex: 1 },
  productName: { fontSize: fontSize.sm, fontWeight: '600', color: colors.text.primary },
  productCategory: { fontSize: fontSize.xs, color: colors.text.muted },
  productFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  productPrice: { fontSize: fontSize.md, fontWeight: '600', color: colors.primary },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonActive: { backgroundColor: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.md },
});


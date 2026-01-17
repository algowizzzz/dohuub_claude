import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../src/services/api';
import { ENDPOINTS } from '../../../src/constants/api';
import { Card, Rating, Badge, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const PROPERTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'Apartment', label: 'Apartments' },
  { id: 'House', label: 'Houses' },
  { id: 'Condo', label: 'Condos' },
  { id: 'Studio', label: 'Studios' },
];

export default function RentalsScreen() {
  const [listings, setListings] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [selectedType]);

  const fetchListings = async () => {
    try {
      const params: any = {};
      if (selectedType !== 'all') params.propertyType = selectedType;
      const response: any = await api.get(ENDPOINTS.SERVICES.RENTALS, params);
      setListings(response.data || []);
    } catch (error) {
      console.error('Failed to fetch listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  };

  const renderListingCard = ({ item }: { item: any }) => (
    <Card style={styles.listingCard}>
      <View style={styles.listingImage}>
        <Ionicons name="home" size={40} color={colors.text.muted} />
      </View>
      
      <View style={styles.listingContent}>
        {item.vendor?.isMichelle && <PoweredByDoHuubBadge />}
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingLocation}>{item.city}, {item.state}</Text>
        
        <View style={styles.propertyDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{item.bedrooms} bed</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>{item.bathrooms} bath</Text>
          </View>
        </View>
        
        <View style={styles.amenitiesRow}>
          {item.amenities?.slice(0, 3).map((amenity: string, i: number) => (
            <Badge key={i} text={amenity} variant="info" size="sm" />
          ))}
          {item.amenities?.length > 3 && (
            <Text style={styles.moreAmenities}>+{item.amenities.length - 3}</Text>
          )}
        </View>
        
        <View style={styles.listingFooter}>
          <Rating rating={item.vendor?.rating || 0} reviewCount={item.vendor?.reviewCount || 0} size="sm" />
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.pricePerNight}</Text>
            <Text style={styles.priceUnit}>/night</Text>
          </View>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Rental Properties</Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filterTabs}>
        {PROPERTY_TYPES.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.filterTab, selectedType === type.id && styles.filterTabActive]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text style={[styles.filterTabText, selectedType === type.id && styles.filterTabTextActive]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={listings}
        renderItem={renderListingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No rental properties available</Text>
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
  listingCard: { marginBottom: spacing.md, padding: 0, overflow: 'hidden' },
  listingImage: {
    height: 150,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingContent: { padding: spacing.md },
  listingTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginTop: spacing.xs },
  listingLocation: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm },
  propertyDetails: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.sm },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  detailText: { fontSize: fontSize.sm, color: colors.text.secondary },
  amenitiesRow: { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm, flexWrap: 'wrap' },
  moreAmenities: { fontSize: fontSize.sm, color: colors.text.muted },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: fontSize.lg, fontWeight: '600', color: colors.primary },
  priceUnit: { fontSize: fontSize.sm, color: colors.text.secondary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.md },
});


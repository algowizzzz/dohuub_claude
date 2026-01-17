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
import { Card, Rating, Badge, PoweredByDoHuubBadge } from '../../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../../src/constants/theme';

const BEAUTY_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'MAKEUP', label: 'Makeup' },
  { id: 'HAIR', label: 'Hair' },
  { id: 'NAILS', label: 'Nails' },
  { id: 'WELLNESS', label: 'Wellness' },
];

export default function BeautyServicesScreen() {
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
      if (selectedType !== 'all') params.type = selectedType;
      const response: any = await api.get(ENDPOINTS.SERVICES.BEAUTY, params);
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
        <Ionicons name="cut" size={40} color={colors.text.muted} />
      </View>
      
      <View style={styles.listingContent}>
        {item.vendor?.isMichelle && <PoweredByDoHuubBadge />}
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.vendorName}>{item.vendor?.businessName}</Text>
        
        <View style={styles.listingMeta}>
          <Badge 
            text={BEAUTY_TYPES.find(t => t.id === item.beautyType)?.label || item.beautyType}
            variant="primary"
            size="sm"
          />
          {item.duration && (
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={colors.text.secondary} />
              <Text style={styles.metaText}>{item.duration} min</Text>
            </View>
          )}
        </View>
        
        <View style={styles.listingFooter}>
          <Rating rating={item.vendor?.rating || 0} reviewCount={item.vendor?.reviewCount || 0} size="sm" />
          <Text style={styles.price}>${item.basePrice}</Text>
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
        <Text style={styles.title}>Beauty Services</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.filterTabs}>
        {BEAUTY_TYPES.map((type) => (
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
            <Ionicons name="cut-outline" size={48} color={colors.text.muted} />
            <Text style={styles.emptyText}>No beauty services available</Text>
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
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
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
    height: 100,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listingContent: { padding: spacing.md },
  listingTitle: { fontSize: fontSize.md, fontWeight: '600', color: colors.text.primary, marginTop: spacing.xs },
  vendorName: { fontSize: fontSize.sm, color: colors.text.secondary, marginBottom: spacing.sm },
  listingMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText: { fontSize: fontSize.sm, color: colors.text.secondary },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  price: { fontSize: fontSize.lg, fontWeight: '600', color: colors.primary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxl * 2 },
  emptyText: { fontSize: fontSize.md, color: colors.text.muted, marginTop: spacing.md },
});


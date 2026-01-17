import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { MainHeader } from '../../src/components/composite';

interface ServiceCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  available: boolean;
  restrictedForWork?: boolean;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cleaning', name: 'Cleaning Services', icon: 'sparkles', route: '/services/cleaning', available: true },
  { id: 'handyman', name: 'Handyman Services', icon: 'hammer', route: '/services/handyman', available: true },
  { id: 'groceries', name: 'Groceries & Food', icon: 'basket', route: '/services/groceries', available: true },
  { id: 'beauty', name: 'Beauty Services and Products', icon: 'cut', route: '/services/beauty', available: true },
  { id: 'rentals', name: 'Rental Properties', icon: 'home', route: '/services/rentals', available: true },
  { id: 'caregiving', name: 'Caregiving Services', icon: 'heart', route: '/services/caregiving', available: true, restrictedForWork: true },
];

/**
 * Home Dashboard matching wireframe exactly:
 * - Location selector header
 * - Notification bell + profile icons
 * - Location banner
 * - Search bar (links to AI chat)
 * - 2-column category grid with gray icons
 * - NO Featured Services section
 * - NO Quick Actions section
 */
export default function HomeScreen() {
  const { addresses, selectedAddressId } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const displayLabel = selectedAddress?.label || 'Select Location';

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCategoryPress = (category: ServiceCategory) => {
    // Check if caregiving is restricted for work address
    if (category.restrictedForWork && selectedAddress?.type === 'Work') {
      return;
    }
    router.push(category.route as any);
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/chat');
  };

  const handleLocationPress = () => {
    // Navigate to address management
    router.push('/profile/addresses');
  };

  const handleNotificationsPress = () => {
    router.push('/notifications');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MainHeader
          locationLabel={displayLabel}
          onLocationPress={handleLocationPress}
          onNotificationsPress={handleNotificationsPress}
          hasUnreadNotifications={false}
        />

        {/* Location Banner */}
        {selectedAddress && (
          <View style={styles.locationBanner}>
            <Ionicons name="location-outline" size={16} color={colors.gray[600]} />
            <Text style={styles.locationText} numberOfLines={1}>
              {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state}
            </Text>
            <TouchableOpacity onPress={handleLocationPress}>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}

        {!selectedAddress && addresses.length === 0 && (
          <View style={styles.locationBannerEmpty}>
            <Ionicons name="location-outline" size={16} color={colors.status.warning} />
            <Text style={styles.locationTextEmpty}>Add an address to get started</Text>
            <TouchableOpacity onPress={handleLocationPress}>
              <Text style={styles.changeTextEmpty}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={handleSearchPress}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <Text style={styles.searchPlaceholder}>What service do you need?</Text>
        </TouchableOpacity>

        {/* Categories Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Services</Text>
          <View style={styles.categoriesGrid}>
            {SERVICE_CATEGORIES.map((category) => {
              // Check if caregiving is restricted for work address
              const isAvailable = category.restrictedForWork
                ? selectedAddress?.type !== 'Work'
                : category.available;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    !isAvailable && styles.categoryCardDisabled,
                  ]}
                  onPress={() => handleCategoryPress(category)}
                  disabled={!isAvailable}
                >
                  <View style={[
                    styles.categoryIcon,
                    !isAvailable && styles.categoryIconDisabled,
                  ]}>
                    <Ionicons
                      name={category.icon}
                      size={32}
                      color={isAvailable ? colors.gray[700] : colors.gray[400]}
                    />
                  </View>
                  <Text style={[
                    styles.categoryName,
                    !isAvailable && styles.categoryNameDisabled,
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingTop: 60,
    borderBottomWidth: borderWidth.default,
    borderBottomColor: colors.gray[200],
  },
  locationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
  },
  locationText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  changeText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  locationBannerEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: '#FEF3C7',
    borderWidth: borderWidth.default,
    borderColor: '#FCD34D',
    borderRadius: borderRadius.lg,
  },
  locationTextEmpty: {
    flex: 1,
    fontSize: fontSize.sm,
    color: '#92400E',
  },
  changeTextEmpty: {
    fontSize: fontSize.sm,
    color: '#92400E',
    textDecorationLine: 'underline',
  },
  content: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  searchPlaceholder: {
    fontSize: fontSize.md,
    color: colors.gray[400],
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    color: colors.gray[700],
    marginBottom: spacing.md,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '47%',
    padding: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  categoryCardDisabled: {
    borderColor: colors.gray[200],
    backgroundColor: colors.gray[50],
    opacity: 0.6,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryIconDisabled: {
    backgroundColor: colors.gray[100],
  },
  categoryName: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.gray[800],
    textAlign: 'center',
  },
  categoryNameDisabled: {
    color: colors.gray[400],
  },
});

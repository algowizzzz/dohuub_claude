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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader, ProviderCard } from '../../../src/components/composite';

const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'DoHuub Beauty Studio',
    rating: 4.9,
    reviewCount: 267,
    distance: '0.5 mi',
    startingPrice: 50,
    priceUnit: '/service',
    isPoweredByDoHuub: true,
  },
  {
    id: '2',
    name: 'Glam Squad Mobile',
    rating: 4.8,
    reviewCount: 178,
    distance: '1.0 mi',
    startingPrice: 45,
    priceUnit: '/service',
    isPoweredByDoHuub: false,
  },
];

const SUB_CATEGORIES = [
  { id: 'makeup', name: 'Makeup', icon: 'color-palette' },
  { id: 'hair', name: 'Hair', icon: 'cut' },
  { id: 'nails', name: 'Nails', icon: 'hand-left' },
  { id: 'wellness', name: 'Wellness', icon: 'leaf' },
];

export default function BeautyServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [providers] = useState(MOCK_PROVIDERS);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleProviderPress = (providerId: string) => {
    router.push(`/services/beauty/${providerId}`);
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
      <ScreenHeader title="Beauty Services" showBack />

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


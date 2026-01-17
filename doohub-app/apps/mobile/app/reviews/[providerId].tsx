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
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader, ReviewCard } from '../../src/components/composite';
import { Rating, EmptyState } from '../../src/components/ui';

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

// Mock data
const MOCK_PROVIDER = {
  id: '1',
  name: 'DoHuub Premium Cleaning',
  rating: 4.9,
  totalReviews: 234,
};

const MOCK_REVIEWS = [
  {
    id: '1',
    authorName: 'Sarah M.',
    rating: 5,
    date: 'Jan 10, 2026',
    comment: 'Excellent service! The team was professional, thorough, and left my apartment sparkling clean. Will definitely book again.',
  },
  {
    id: '2',
    authorName: 'John D.',
    rating: 5,
    date: 'Jan 8, 2026',
    comment: 'Very impressed with the deep cleaning service. They even cleaned areas I hadn\'t thought of.',
  },
  {
    id: '3',
    authorName: 'Emily R.',
    rating: 4,
    date: 'Jan 5, 2026',
    comment: 'Great service overall. Only minor issue was they arrived 15 minutes late, but the quality was excellent.',
  },
  {
    id: '4',
    authorName: 'Michael T.',
    rating: 5,
    date: 'Jan 3, 2026',
    comment: 'Best cleaning service I\'ve used. Professional, punctual, and very thorough.',
  },
  {
    id: '5',
    authorName: 'Lisa K.',
    rating: 4,
    date: 'Dec 28, 2025',
    comment: 'Good value for money. The house was noticeably cleaner after their visit.',
  },
];

/**
 * All Reviews Screen matching wireframe:
 * - Header: "Reviews" with back button
 * - Provider summary (name, avg rating, total reviews)
 * - Filter tabs: All, 5★, 4★, 3★, 2★, 1★
 * - Review cards list (reuse ReviewCard)
 * - Load more / pagination
 */
export default function AllReviewsScreen() {
  const { providerId } = useLocalSearchParams<{ providerId: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [reviews] = useState(MOCK_REVIEWS);
  const [provider] = useState(MOCK_PROVIDER);

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch reviews from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === 'All') return true;
    const starRating = parseInt(activeFilter);
    return review.rating === starRating;
  });

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Provider Summary */}
      <View style={styles.providerSummary}>
        <Text style={styles.providerName}>{provider.name}</Text>
        <View style={styles.ratingRow}>
          <Rating value={provider.rating} size="lg" showValue />
          <Text style={styles.reviewCount}>({provider.totalReviews} reviews)</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.filterTab,
              activeFilter === tab && styles.filterTabActive,
            ]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeFilter === tab && styles.filterTabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="star-outline"
      title="No reviews yet"
      message={activeFilter === 'All' 
        ? "This provider doesn't have any reviews yet."
        : `No ${activeFilter} reviews found.`}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Reviews" showBack />

      <FlatList
        data={filteredReviews}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <ReviewCard
              id={item.id}
              authorName={item.authorName}
              rating={item.rating}
              date={item.date}
              comment={item.comment}
            />
          </View>
        )}
        ListEmptyComponent={renderEmptyState}
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
  headerContent: {
    marginBottom: spacing.lg,
  },
  providerSummary: {
    padding: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  providerName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  reviewCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
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
    backgroundColor: colors.gray[100],
  },
  filterTabActive: {
    backgroundColor: colors.gray[800],
  },
  filterTabText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    flexGrow: 1,
  },
  reviewItem: {
    marginBottom: spacing.sm,
  },
});


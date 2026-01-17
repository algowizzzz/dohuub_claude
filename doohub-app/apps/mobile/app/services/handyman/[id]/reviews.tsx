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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader, ReviewCard } from '../../../../src/components/composite';
import { Rating, EmptyState } from '../../../../src/components/ui';

const FILTER_TABS = ['All', '5★', '4★', '3★', '2★', '1★'];

const MOCK_REVIEWS = [
  {
    id: '1',
    authorName: 'Mike T.',
    rating: 5,
    date: 'Jan 10, 2026',
    comment: 'Fixed my plumbing issue quickly and professionally. Great work!',
  },
  {
    id: '2',
    authorName: 'Rachel K.',
    rating: 5,
    date: 'Jan 7, 2026',
    comment: 'Excellent electrical work. Very knowledgeable and fair pricing.',
  },
  {
    id: '3',
    authorName: 'David L.',
    rating: 4,
    date: 'Jan 4, 2026',
    comment: 'Good service. Arrived on time and completed the job well.',
  },
];

/**
 * Handyman Service Reviews Screen
 */
export default function HandymanReviewsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [reviews] = useState(MOCK_REVIEWS);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredReviews = reviews.filter((review) => {
    if (activeFilter === 'All') return true;
    const starRating = parseInt(activeFilter);
    return review.rating === starRating;
  });

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.summary}>
        <View style={styles.ratingBig}>
          <Text style={styles.ratingValue}>4.8</Text>
          <Rating value={4.8} size="md" />
          <Text style={styles.reviewCount}>{reviews.length} reviews</Text>
        </View>
      </View>

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
        ListEmptyComponent={
          <EmptyState
            icon="star-outline"
            title="No reviews"
            message="No reviews found for this filter."
          />
        }
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
  summary: {
    padding: spacing.lg,
    alignItems: 'center',
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  ratingBig: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  ratingValue: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    color: colors.gray[900],
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


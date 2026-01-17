import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';
import { Button, Badge, Rating } from '../../../src/components/ui';
import { ReportModal } from '../../../src/components/modals';

// Mock data - would come from API
const MOCK_STORE = {
  id: '1',
  name: 'Fresh Market Groceries',
  description: 'Your neighborhood grocery store with fresh produce, organic options, and everyday essentials delivered to your door.',
  rating: 4.6,
  reviewCount: 423,
  isPoweredByDoHuub: true,
  categories: [
    { id: '1', name: 'Fresh Produce', itemCount: 120 },
    { id: '2', name: 'Dairy & Eggs', itemCount: 45 },
    { id: '3', name: 'Meat & Seafood', itemCount: 60 },
    { id: '4', name: 'Bakery', itemCount: 35 },
    { id: '5', name: 'Pantry Essentials', itemCount: 200 },
  ],
  deliveryFee: 4.99,
  minOrder: 15,
  deliveryTime: '30-45 min',
};

/**
 * Store Detail screen matching wireframe
 */
export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [store] = useState(MOCK_STORE);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleBrowse = () => {
    router.push(`/services/groceries/stores/${id}`);
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/services/groceries/${id}/category/${categoryId}`);
  };

  const handleReport = (reason: string, comment: string) => {
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setShowReportModal(false);
    }, 1000);
  };

  const handleViewReviews = () => {
    router.push(`/reviews/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        showBack
        rightIcon="ellipsis-vertical"
        onRightAction={() => {}}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={styles.heroImage}>
          <Ionicons name="basket" size={64} color={colors.gray[400]} />
        </View>

        {/* Header Info */}
        <View style={styles.headerInfo}>
          {store.isPoweredByDoHuub && (
            <Badge text="Powered by DoHuub" variant="dohuub" />
          )}
          <Text style={styles.name}>{store.name}</Text>
          <Rating rating={store.rating} reviewCount={store.reviewCount} />
          
          {/* Delivery Info */}
          <View style={styles.deliveryInfo}>
            <View style={styles.deliveryItem}>
              <Ionicons name="time-outline" size={16} color={colors.gray[600]} />
              <Text style={styles.deliveryText}>{store.deliveryTime}</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="bicycle-outline" size={16} color={colors.gray[600]} />
              <Text style={styles.deliveryText}>${store.deliveryFee} delivery</Text>
            </View>
            <View style={styles.deliveryItem}>
              <Ionicons name="card-outline" size={16} color={colors.gray[600]} />
              <Text style={styles.deliveryText}>${store.minOrder} min</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{store.description}</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          {store.categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(category.id)}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.itemCount} items</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Reviews Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity onPress={handleViewReviews}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewsPreview}>
            <Text style={styles.noReviewsText}>
              {store.reviewCount} reviews with {store.rating} average rating
            </Text>
          </View>
        </View>

        {/* Report Listing */}
        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReportModal(true)}>
          <Ionicons name="flag-outline" size={16} color={colors.gray[600]} />
          <Text style={styles.reportText}>Report Listing</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button title="Start Shopping" onPress={handleBrowse} fullWidth />
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        loading={isSubmittingReport}
        listingName={store.name}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  heroImage: {
    height: 200,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    padding: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
    marginTop: spacing.xs,
  },
  deliveryInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  deliveryText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  seeAllLink: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
    textDecorationLine: 'underline',
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[100],
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
  },
  categoryCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  reviewsPreview: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.md,
  },
  noReviewsText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  reportText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});

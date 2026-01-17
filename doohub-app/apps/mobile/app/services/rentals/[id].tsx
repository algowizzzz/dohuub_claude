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
const MOCK_PROVIDER = {
  id: '1',
  name: 'DoHuub Car Rentals',
  description: 'Premium vehicle rentals for all your transportation needs. From economy cars to luxury vehicles, we have you covered.',
  rating: 4.7,
  reviewCount: 156,
  isPoweredByDoHuub: true,
  services: [
    { id: '1', name: 'Economy Car', price: 45, duration: 'per day' },
    { id: '2', name: 'SUV', price: 75, duration: 'per day' },
    { id: '3', name: 'Luxury Sedan', price: 120, duration: 'per day' },
    { id: '4', name: 'Van/Minivan', price: 85, duration: 'per day' },
  ],
  availability: 'Mon-Sun, 24/7 pickup',
};

/**
 * Provider Detail screen matching wireframe
 */
export default function ProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider] = useState(MOCK_PROVIDER);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleBookNow = () => {
    router.push(`/services/rentals/${id}/book`);
  };

  const handleReport = (reason: string, comment: string) => {
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setShowReportModal(false);
    }, 1000);
  };

  const handleViewReviews = () => {
    router.push(`/services/rentals/${id}/reviews`);
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
          <Ionicons name="car" size={64} color={colors.gray[400]} />
        </View>

        {/* Header Info */}
        <View style={styles.headerInfo}>
          {provider.isPoweredByDoHuub && (
            <Badge text="Powered by DoHuub" variant="dohuub" />
          )}
          <Text style={styles.name}>{provider.name}</Text>
          <Rating rating={provider.rating} reviewCount={provider.reviewCount} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{provider.description}</Text>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicles</Text>
          {provider.services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}>{service.duration}</Text>
              </View>
              <Text style={styles.servicePrice}>${service.price}</Text>
            </View>
          ))}
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityRow}>
            <Ionicons name="time-outline" size={20} color={colors.gray[600]} />
            <Text style={styles.availabilityText}>{provider.availability}</Text>
          </View>
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
              {provider.reviewCount} reviews with {provider.rating} average rating
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
        <Button title="Reserve Now" onPress={handleBookNow} fullWidth />
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        loading={isSubmittingReport}
        listingName={provider.name}
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
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[100],
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
  },
  serviceDuration: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  servicePrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  availabilityText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
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

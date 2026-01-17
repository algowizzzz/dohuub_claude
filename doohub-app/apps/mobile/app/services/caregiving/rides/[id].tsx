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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button, Badge, Rating } from '../../../../src/components/ui';
import { ReportModal } from '../../../../src/components/modals';

const MOCK_PROVIDER = {
  id: '1',
  name: 'DoHuub Ride Care',
  description: 'Professional and compassionate ride assistance for seniors and individuals with mobility needs. Our trained drivers ensure safe and comfortable transportation.',
  rating: 4.9,
  reviewCount: 156,
  isPoweredByDoHuub: true,
  vehicleTypes: [
    { type: 'Sedan', capacity: '1-3 passengers', pricePerMile: 2.50 },
    { type: 'SUV', capacity: '1-5 passengers', pricePerMile: 3.00 },
  ],
  serviceAreas: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'],
  availability: 'Mon-Sun, 6AM - 10PM',
};

/**
 * Ride Provider Detail Screen matching wireframe:
 * - Provider info
 * - Vehicle details
 * - Service areas
 * - Pricing
 * - Reviews
 * - "Book Ride" button
 */
export default function RideProviderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [provider] = useState(MOCK_PROVIDER);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleBookRide = () => {
    router.push(`/services/caregiving/rides/${id}/book`);
  };

  const handleReport = (reason: string, comment: string) => {
    setIsSubmittingReport(true);
    setTimeout(() => {
      setIsSubmittingReport(false);
      setShowReportModal(false);
    }, 1000);
  };

  const handleViewReviews = () => {
    router.push(`/services/caregiving/${id}/reviews`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader showBack />

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

        {/* Vehicle Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Options</Text>
          {provider.vehicleTypes.map((vehicle) => (
            <View key={vehicle.type} style={styles.vehicleItem}>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle.type}</Text>
                <Text style={styles.vehicleCapacity}>{vehicle.capacity}</Text>
              </View>
              <Text style={styles.vehiclePrice}>${vehicle.pricePerMile.toFixed(2)}/mi</Text>
            </View>
          ))}
        </View>

        {/* Service Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Areas</Text>
          <View style={styles.areasContainer}>
            {provider.serviceAreas.map((area) => (
              <View key={area} style={styles.areaChip}>
                <Text style={styles.areaText}>{area}</Text>
              </View>
            ))}
          </View>
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
            <Text style={styles.reviewsText}>
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
        <Button title="Book Ride" onPress={handleBookRide} fullWidth />
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
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[100],
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
  },
  vehicleCapacity: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  vehiclePrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  areasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  areaChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.full,
  },
  areaText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
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
  reviewsText: {
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


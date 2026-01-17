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
import { Button, Rating } from '../../../../src/components/ui';
import { ReportModal } from '../../../../src/components/modals';

const MOCK_COMPANION = {
  id: '1',
  name: 'Sarah Johnson',
  bio: 'Certified caregiver with 8 years of experience providing compassionate companionship care. I specialize in dementia care and creating meaningful connections with seniors.',
  rating: 4.9,
  reviewCount: 78,
  specialties: ['Dementia Care', 'Meal Preparation', 'Light Housekeeping', 'Medication Reminders'],
  hourlyRate: 25,
  yearsExperience: 8,
  certifications: ['Certified Nursing Assistant', 'Dementia Care Certified', 'First Aid/CPR'],
  availability: {
    Mon: ['9AM-5PM'],
    Tue: ['9AM-5PM'],
    Wed: ['9AM-5PM'],
    Thu: ['9AM-5PM'],
    Fri: ['9AM-3PM'],
    Sat: ['By appointment'],
    Sun: ['Unavailable'],
  },
};

/**
 * Companion Detail Screen matching wireframe:
 * - Companion profile photo
 * - Bio/about
 * - Specialties
 * - Hourly rate
 * - Availability calendar
 * - Reviews
 * - "Book Companion" button
 */
export default function CompanionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [companion] = useState(MOCK_COMPANION);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const handleBookCompanion = () => {
    router.push(`/services/caregiving/companions/${id}/book`);
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
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person" size={64} color={colors.gray[400]} />
          </View>
          <Text style={styles.profileName}>{companion.name}</Text>
          <Rating rating={companion.rating} reviewCount={companion.reviewCount} />
          <View style={styles.profileMeta}>
            <Text style={styles.metaText}>{companion.yearsExperience} years experience</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.rateText}>${companion.hourlyRate}/hour</Text>
          </View>
        </View>

        {/* Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{companion.bio}</Text>
        </View>

        {/* Specialties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesGrid}>
            {companion.specialties.map((specialty) => (
              <View key={specialty} style={styles.specialtyChip}>
                <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          {companion.certifications.map((cert) => (
            <View key={cert} style={styles.certItem}>
              <Ionicons name="ribbon-outline" size={20} color={colors.gray[600]} />
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityCard}>
            {Object.entries(companion.availability).map(([day, times]) => (
              <View key={day} style={styles.availabilityRow}>
                <Text style={styles.dayText}>{day}</Text>
                <Text style={[
                  styles.timeText,
                  times[0] === 'Unavailable' && styles.unavailableText
                ]}>
                  {times.join(', ')}
                </Text>
              </View>
            ))}
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
              {companion.reviewCount} reviews with {companion.rating} average rating
            </Text>
          </View>
        </View>

        {/* Report Listing */}
        <TouchableOpacity style={styles.reportButton} onPress={() => setShowReportModal(true)}>
          <Ionicons name="flag-outline" size={16} color={colors.gray[600]} />
          <Text style={styles.reportText}>Report Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <Button title="Book Companion" onPress={handleBookCompanion} fullWidth />
      </View>

      {/* Report Modal */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReport}
        loading={isSubmittingReport}
        listingName={companion.name}
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
  profileHeader: {
    alignItems: 'center',
    padding: spacing.xl,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileName: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  metaText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  metaDot: {
    marginHorizontal: spacing.sm,
    color: colors.gray[400],
  },
  rateText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
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
  bioText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 24,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  specialtyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.full,
  },
  specialtyText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  certText: {
    fontSize: fontSize.md,
    color: colors.gray[700],
  },
  availabilityCard: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  dayText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    width: 40,
  },
  timeText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  unavailableText: {
    color: colors.gray[400],
    fontStyle: 'italic',
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


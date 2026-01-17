import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';

/**
 * Leave Review screen matching wireframe:
 * - Star rating (1-5)
 * - Review text input
 * - Photo upload option
 * - Submit button
 */
export default function LeaveReviewScreen() {
  const { bookingId, serviceName, providerName } = useLocalSearchParams<{
    bookingId: string;
    serviceName?: string;
    providerName?: string;
  }>();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleAddPhoto = () => {
    // TODO: Implement image picker
    Alert.alert('Coming Soon', 'Photo upload will be available soon');
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    if (reviewText.trim().length < 10) {
      Alert.alert('Error', 'Please write at least 10 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call to submit review
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      
      Alert.alert(
        'Review Submitted',
        'Thank you for your feedback!',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = () => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Tap to rate';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Leave a Review" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Info */}
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{serviceName || 'Service'}</Text>
          <Text style={styles.providerName}>{providerName || 'Provider'}</Text>
        </View>

        {/* Star Rating */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleStarPress(star)}
                style={styles.starButton}
              >
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color={star <= rating ? colors.rating : colors.gray[300]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.ratingLabel}>{getRatingLabel()}</Text>
        </View>

        {/* Review Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Write your review</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience with this service. What did you like? What could be improved?"
            placeholderTextColor={colors.gray[400]}
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>
            {reviewText.length}/500 characters
          </Text>
        </View>

        {/* Photo Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add photos (optional)</Text>
          <View style={styles.photosContainer}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoWrapper}>
                <Image source={{ uri: photo }} style={styles.photo} />
                <TouchableOpacity
                  style={styles.removePhotoButton}
                  onPress={() => handleRemovePhoto(index)}
                >
                  <Ionicons name="close-circle" size={24} color={colors.status.error} />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 5 && (
              <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
                <Ionicons name="camera-outline" size={28} color={colors.gray[500]} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>Tips for a helpful review:</Text>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
            <Text style={styles.tipText}>Be specific about what you liked or disliked</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
            <Text style={styles.tipText}>Mention the quality of service</Text>
          </View>
          <View style={styles.tipRow}>
            <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
            <Text style={styles.tipText}>Share if the provider was on time</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.ctaContainer}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          fullWidth
          loading={isSubmitting}
          disabled={rating === 0 || reviewText.trim().length < 10}
        />
      </View>
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  serviceInfo: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
    marginBottom: spacing.lg,
  },
  serviceName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
  },
  providerName: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    marginTop: spacing.xs,
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  ratingLabel: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    fontWeight: '500',
  },
  section: {
    marginBottom: spacing.xl,
  },
  reviewInput: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.gray[900],
    minHeight: 150,
  },
  charCount: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  photosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderStyle: 'dashed',
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: fontSize.xs,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  tipsSection: {
    backgroundColor: colors.gray[50],
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  tipsTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    flex: 1,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});

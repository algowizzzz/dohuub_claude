import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, fontSize, borderRadius } from '../src/constants/theme';
import { Button } from '../src/components/ui';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = '@dohuub_has_seen_onboarding';

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'cube-outline',
    title: 'Welcome to DoHuub',
    description:
      'Your lifestyle super-app. Access all the services you need in one place, from cleaning to caregiving.',
  },
  {
    id: '2',
    icon: 'grid-outline',
    title: 'Six Service Categories',
    description:
      'Cleaning, Handyman, Groceries & Food, Beauty, Rental Properties, and Caregiving Services - all at your fingertips.',
  },
  {
    id: '3',
    icon: 'checkmark-circle-outline',
    title: 'Book, Track & Pay',
    description:
      'Easily book services, track your orders in real-time, and pay securely through the app.',
  },
];

/**
 * Onboarding Carousel matching wireframe:
 * - 3 slides (intro, categories, booking flow)
 * - Previous/Next buttons
 * - Skip button
 * - "Get Started" button on final slide
 * - Dot indicators
 * - Stores hasSeenOnboarding flag
 */
export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const isFirstSlide = currentIndex === 0;
  const isLastSlide = currentIndex === SLIDES.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToOffset({ offset: prevIndex * width, animated: true });
      setCurrentIndex(prevIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToOffset({ offset: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    router.replace('/(auth)/welcome');
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const handleGetStarted = () => {
    completeOnboarding();
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <Ionicons name={item.icon} size={80} color={colors.gray[800]} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      {!isLastSlide && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
      />

      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {SLIDES.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        {isLastSlide ? (
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            fullWidth
          />
        ) : (
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navButton, isFirstSlide && styles.navButtonDisabled]}
              onPress={handlePrevious}
              disabled={isFirstSlide}
            >
              <Text style={[styles.navButtonText, isFirstSlide && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.navButton} onPress={handleNext}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Check if user has seen onboarding
 */
export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error reading onboarding status:', error);
    return false;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: spacing.lg,
    zIndex: 1,
    padding: spacing.sm,
  },
  skipText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gray[300],
  },
  dotActive: {
    backgroundColor: colors.gray[800],
    width: 24,
  },
  navigation: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[800],
  },
  navButtonTextDisabled: {
    color: colors.gray[400],
  },
});

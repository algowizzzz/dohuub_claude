import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/composite';

/**
 * Beauty Choice Screen matching wireframe:
 * - Header: "Beauty on DE Run"
 * - Two large cards:
 *   - "Beauty Services" (hair, makeup, nails)
 *   - "Beauty Products" (shop products)
 * - Navigate to respective lists
 */
export default function BeautyChoiceScreen() {
  const handleServicesPress = () => {
    router.push('/services/beauty');
  };

  const handleProductsPress = () => {
    router.push('/services/beauty/products');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Beauty on DE Run" showBack />

      <View style={styles.content}>
        <Text style={styles.subtitle}>What are you looking for?</Text>

        {/* Beauty Services Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleServicesPress}>
          <View style={styles.iconContainer}>
            <Ionicons name="cut" size={48} color={colors.gray[700]} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Beauty Services</Text>
            <Text style={styles.cardDescription}>
              Book hair styling, makeup, nails, and skincare treatments with professionals
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Beauty Products Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleProductsPress}>
          <View style={styles.iconContainer}>
            <Ionicons name="bag-outline" size={48} color={colors.gray[700]} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Beauty Products</Text>
            <Text style={styles.cardDescription}>
              Shop skincare, haircare, makeup, and cosmetics from top brands
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.gray[700],
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 22,
  },
});


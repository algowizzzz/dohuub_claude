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
 * Caregiving Choice Screen matching wireframe:
 * - Header: "Caregiving Services"
 * - Two options:
 *   - "Ride Assistance" - transportation help
 *   - "Companionship Support" - companion care
 * - Description for each
 */
export default function CaregivingChoiceScreen() {
  const handleRidesPress = () => {
    router.push('/services/caregiving/rides');
  };

  const handleCompanionsPress = () => {
    router.push('/services/caregiving/companions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Caregiving Services" showBack />

      <View style={styles.content}>
        <Text style={styles.subtitle}>How can we help you today?</Text>

        {/* Ride Assistance Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleRidesPress}>
          <View style={styles.iconContainer}>
            <Ionicons name="car" size={48} color={colors.gray[700]} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Ride Assistance</Text>
            <Text style={styles.cardDescription}>
              Safe transportation for medical appointments, errands, and social outings with trained drivers
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Companionship Support Card */}
        <TouchableOpacity style={styles.choiceCard} onPress={handleCompanionsPress}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={48} color={colors.gray[700]} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Companionship Support</Text>
            <Text style={styles.cardDescription}>
              Friendly companions for social visits, light housekeeping, meal preparation, and daily activities
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


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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Rating } from '../../../../src/components/ui';

const SPECIALTIES = ['All', 'Dementia Care', 'Mobility Assistance', 'Meal Prep', 'Light Housekeeping'];

const MOCK_COMPANIONS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    rating: 4.9,
    reviewCount: 78,
    specialties: ['Dementia Care', 'Meal Prep'],
    hourlyRate: 25,
    yearsExperience: 8,
  },
  {
    id: '2',
    name: 'Michael Chen',
    rating: 4.8,
    reviewCount: 64,
    specialties: ['Mobility Assistance', 'Light Housekeeping'],
    hourlyRate: 22,
    yearsExperience: 5,
  },
  {
    id: '3',
    name: 'Emily Williams',
    rating: 5.0,
    reviewCount: 45,
    specialties: ['Dementia Care', 'Mobility Assistance'],
    hourlyRate: 28,
    yearsExperience: 10,
  },
];

/**
 * Companions List Screen matching wireframe:
 * - Header: "Companionship Support"
 * - Companion cards (photo, name, rating, specialties)
 * - Filter by: specialty, rating, availability
 */
export default function CompanionsListScreen() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const filteredCompanions = selectedSpecialty === 'All'
    ? MOCK_COMPANIONS
    : MOCK_COMPANIONS.filter(c => c.specialties.includes(selectedSpecialty));

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCompanionPress = (companionId: string) => {
    router.push(`/services/caregiving/companions/${companionId}`);
  };

  const renderCompanion = ({ item }: { item: typeof MOCK_COMPANIONS[0] }) => (
    <TouchableOpacity
      style={styles.companionCard}
      onPress={() => handleCompanionPress(item.id)}
    >
      <View style={styles.companionAvatar}>
        <Ionicons name="person" size={32} color={colors.gray[400]} />
      </View>
      <View style={styles.companionInfo}>
        <Text style={styles.companionName}>{item.name}</Text>
        <Rating rating={item.rating} reviewCount={item.reviewCount} />
        <View style={styles.specialtiesContainer}>
          {item.specialties.slice(0, 2).map((specialty) => (
            <View key={specialty} style={styles.specialtyChip}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.experienceText}>{item.yearsExperience} yrs exp</Text>
          <Text style={styles.rateText}>${item.hourlyRate}/hr</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Companionship Support" showBack />

      {/* Specialty Filter */}
      <View style={styles.filterContainer}>
        <FlatList
          data={SPECIALTIES}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                selectedSpecialty === item && styles.filterChipActive,
              ]}
              onPress={() => setSelectedSpecialty(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedSpecialty === item && styles.filterTextActive,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredCompanions}
        keyExtractor={(item) => item.id}
        renderItem={renderCompanion}
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
  filterContainer: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  filterContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  filterChipActive: {
    backgroundColor: colors.gray[800],
  },
  filterText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.text.inverse,
  },
  listContent: {
    padding: spacing.lg,
  },
  companionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  companionAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  companionInfo: {
    flex: 1,
  },
  companionName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  specialtyChip: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.sm,
  },
  specialtyText: {
    fontSize: fontSize.xs,
    color: colors.gray[600],
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  experienceText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  rateText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
  },
});


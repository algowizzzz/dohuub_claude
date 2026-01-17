import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button } from '../../src/components/ui';

interface Region {
  id: string;
  name: string;
  code: string;
  flag: string;
  available: boolean;
}

const REGIONS: Region[] = [
  { id: '1', name: 'United States', code: 'US', flag: '🇺🇸', available: true },
  { id: '2', name: 'Canada', code: 'CA', flag: '🇨🇦', available: true },
  { id: '3', name: 'United Kingdom', code: 'UK', flag: '🇬🇧', available: false },
  { id: '4', name: 'Australia', code: 'AU', flag: '🇦🇺', available: false },
  { id: '5', name: 'Germany', code: 'DE', flag: '🇩🇪', available: false },
  { id: '6', name: 'France', code: 'FR', flag: '🇫🇷', available: false },
];

/**
 * Region Selection screen matching wireframe:
 * - List of available regions
 * - Current region indicator
 * - Coming soon badge for unavailable regions
 */
export default function RegionScreen() {
  const [selectedRegion, setSelectedRegion] = useState<string>('1'); // Default to US

  const handleSelectRegion = (region: Region) => {
    if (!region.available) {
      Alert.alert(
        'Coming Soon',
        `DoHuub is not yet available in ${region.name}. We'll notify you when we launch there!`
      );
      return;
    }
    setSelectedRegion(region.id);
  };

  const handleSave = () => {
    const region = REGIONS.find((r) => r.id === selectedRegion);
    Alert.alert('Region Updated', `Your region has been set to ${region?.name}.`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Change Region" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Select your region to see services available in your area. Some features may vary by
          region.
        </Text>

        <View style={styles.regionList}>
          {REGIONS.map((region) => (
            <TouchableOpacity
              key={region.id}
              style={[
                styles.regionCard,
                selectedRegion === region.id && styles.regionCardSelected,
                !region.available && styles.regionCardDisabled,
              ]}
              onPress={() => handleSelectRegion(region)}
              disabled={!region.available}
            >
              <Text style={styles.flag}>{region.flag}</Text>
              <View style={styles.regionInfo}>
                <Text
                  style={[
                    styles.regionName,
                    !region.available && styles.regionNameDisabled,
                  ]}
                >
                  {region.name}
                </Text>
                {!region.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
              </View>
              {region.available && (
                <View
                  style={[
                    styles.radioOuter,
                    selectedRegion === region.id && styles.radioOuterSelected,
                  ]}
                >
                  {selectedRegion === region.id && <View style={styles.radioInner} />}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={colors.gray[600]} />
          <Text style={styles.infoText}>
            Changing your region may affect available services, pricing, and payment methods.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save Changes" onPress={handleSave} fullWidth />
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
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  description: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  regionList: {
    gap: spacing.sm,
  },
  regionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  regionCardSelected: {
    borderColor: colors.gray[800],
    backgroundColor: colors.gray[50],
  },
  regionCardDisabled: {
    opacity: 0.6,
    backgroundColor: colors.gray[50],
  },
  flag: {
    fontSize: 32,
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
  },
  regionNameDisabled: {
    color: colors.gray[500],
  },
  comingSoonBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
  },
  comingSoonText: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.gray[600],
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.gray[800],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.gray[800],
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
    backgroundColor: colors.background,
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, Input } from '../../src/components/ui';

type AddressType = 'Home' | 'Work' | 'Doctor' | 'Pharmacy' | 'Other';

const ADDRESS_TYPES: { type: AddressType; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'Home', icon: 'home' },
  { type: 'Work', icon: 'briefcase' },
  { type: 'Doctor', icon: 'medkit' },
  { type: 'Pharmacy', icon: 'medical' },
  { type: 'Other', icon: 'location' },
];

/**
 * Add/Edit Address screen matching wireframe:
 * - Address type selector
 * - Street address input
 * - City, State, Zip inputs
 * - Save button
 */
export default function AddAddressScreen() {
  const { type, edit } = useLocalSearchParams<{ type?: string; edit?: string }>();
  const isEditing = edit === 'true';

  const [addressType, setAddressType] = useState<AddressType>((type as AddressType) || 'Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!street.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      Alert.alert('Success', 'Address saved successfully', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={isEditing ? 'Edit Address' : 'Add Address'} showBack />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Address Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Type</Text>
            <View style={styles.typeSelector}>
              {ADDRESS_TYPES.map(({ type: t, icon }) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeOption,
                    addressType === t && styles.typeOptionActive,
                  ]}
                  onPress={() => setAddressType(t)}
                >
                  <Ionicons
                    name={icon}
                    size={24}
                    color={addressType === t ? colors.text.inverse : colors.gray[600]}
                  />
                  <Text
                    style={[
                      styles.typeText,
                      addressType === t && styles.typeTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Address Fields */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Details</Text>

            <Input
              label="Street Address"
              placeholder="123 Main Street, Apt 4B"
              value={street}
              onChangeText={setStreet}
              autoCapitalize="words"
            />

            <Input
              label="City"
              placeholder="New York"
              value={city}
              onChangeText={setCity}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="State"
                  placeholder="NY"
                  value={state}
                  onChangeText={setState}
                  autoCapitalize="characters"
                  maxLength={2}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="ZIP Code"
                  placeholder="10001"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.ctaContainer}>
          <Button
            title="Save Address"
            onPress={handleSave}
            loading={isSaving}
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  typeOptionActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  typeText: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  typeTextActive: {
    color: colors.text.inverse,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  ctaContainer: {
    padding: spacing.lg,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
});


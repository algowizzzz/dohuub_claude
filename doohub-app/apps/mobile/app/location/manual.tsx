import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Button, EmptyState } from '../../src/components/ui';
import { useAuthStore } from '../../src/store/authStore';

// Mock autocomplete results
const MOCK_SUGGESTIONS = [
  { id: '1', address: '123 Main Street, New York, NY 10001' },
  { id: '2', address: '456 Broadway, New York, NY 10012' },
  { id: '3', address: '789 Park Avenue, New York, NY 10021' },
];

/**
 * Manual Location Screen matching wireframe:
 * - Search input for address
 * - Recent addresses list
 * - "Use current location" button
 * - Address autocomplete results
 * - Confirm button
 */
export default function ManualLocationScreen() {
  const { addresses, setSelectedAddress } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setShowSuggestions(true);
      // TODO: Call geocoding API for real suggestions
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: typeof MOCK_SUGGESTIONS[0]) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    // TODO: Parse address and save
  };

  const handleSelectRecentAddress = (addressId: string) => {
    setSelectedAddress(addressId);
    router.back();
  };

  const handleUseCurrentLocation = () => {
    // TODO: Get current location and reverse geocode
    router.push('/location-permission');
  };

  const handleAddNewAddress = () => {
    router.push('/profile/add-address');
  };

  const renderRecentAddress = ({ item }: { item: typeof addresses[0] }) => (
    <TouchableOpacity
      style={styles.addressCard}
      onPress={() => handleSelectRecentAddress(item.id)}
    >
      <View style={styles.addressIcon}>
        <Ionicons
          name={item.type === 'Home' ? 'home-outline' : item.type === 'Work' ? 'briefcase-outline' : 'location-outline'}
          size={20}
          color={colors.gray[600]}
        />
      </View>
      <View style={styles.addressInfo}>
        <Text style={styles.addressLabel}>{item.label}</Text>
        <Text style={styles.addressText} numberOfLines={1}>
          {item.street}, {item.city}, {item.state}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
    </TouchableOpacity>
  );

  const renderSuggestion = ({ item }: { item: typeof MOCK_SUGGESTIONS[0] }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Ionicons name="location-outline" size={20} color={colors.gray[500]} />
      <Text style={styles.suggestionText}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Set Location" showBack />

      <View style={styles.content}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.gray[400]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for an address..."
            placeholderTextColor={colors.gray[400]}
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Autocomplete Suggestions */}
        {showSuggestions && (
          <View style={styles.suggestionsContainer}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item.id}
              renderItem={renderSuggestion}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}

        {/* Use Current Location */}
        <TouchableOpacity style={styles.currentLocationButton} onPress={handleUseCurrentLocation}>
          <View style={styles.currentLocationIcon}>
            <Ionicons name="navigate" size={20} color={colors.gray[800]} />
          </View>
          <Text style={styles.currentLocationText}>Use current location</Text>
        </TouchableOpacity>

        {/* Recent/Saved Addresses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            <TouchableOpacity onPress={handleAddNewAddress}>
              <Ionicons name="add" size={24} color={colors.gray[700]} />
            </TouchableOpacity>
          </View>

          {addresses.length > 0 ? (
            <FlatList
              data={addresses}
              keyExtractor={(item) => item.id}
              renderItem={renderRecentAddress}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyAddresses}>
              <Text style={styles.emptyText}>No saved addresses yet</Text>
              <Button
                title="Add Address"
                variant="outline"
                onPress={handleAddNewAddress}
                style={styles.addButton}
              />
            </View>
          )}
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[900],
    paddingVertical: spacing.sm,
  },
  suggestionsContainer: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  suggestionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[800],
  },
  separator: {
    height: borderWidth.thin,
    backgroundColor: colors.gray[200],
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  currentLocationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationText: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[800],
  },
  section: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  addressText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  emptyAddresses: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.gray[500],
    marginBottom: spacing.md,
  },
  addButton: {
    minWidth: 150,
  },
});


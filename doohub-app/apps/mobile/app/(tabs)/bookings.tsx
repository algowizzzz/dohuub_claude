import React, { useState, useEffect } from 'react';
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
import { useBookingStore } from '../../src/store/bookingStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';

const TABS = ['All', 'Upcoming', 'In Progress', 'Completed'];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: colors.gray[200], text: colors.gray[700], label: 'Pending' },
  ACCEPTED: { bg: '#DCFCE7', text: '#166534', label: 'Accepted' },
  IN_PROGRESS: { bg: '#DBEAFE', text: '#1E40AF', label: 'In Progress' },
  COMPLETED: { bg: '#DCFCE7', text: '#166534', label: 'Completed' },
  CANCELLED: { bg: '#FEE2E2', text: '#991B1B', label: 'Cancelled' },
  DECLINED: { bg: '#FEE2E2', text: '#991B1B', label: 'Declined' },
};

/**
 * My Bookings screen matching wireframe:
 * - Header with title
 * - Tab filters (All, Upcoming, In Progress, Completed)
 * - Booking cards with status badges
 */
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const { bookings, fetchBookings, isLoading, error, clearError } = useBookingStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    clearError();
    await fetchBookings();
    setRefreshing(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Upcoming') return booking.status === 'ACCEPTED';
    if (activeTab === 'In Progress') return booking.status === 'IN_PROGRESS';
    if (activeTab === 'Completed') return booking.status === 'COMPLETED';
    return true;
  });

  const isTrackable = (status: string) => 
    ['ACCEPTED', 'IN_PROGRESS'].includes(status);

  const handleTrackBooking = (bookingId: string) => {
    router.push(`/bookings/${bookingId}/tracking` as any);
  };

  const renderBookingCard = ({ item }: { item: any }) => {
    const status = STATUS_STYLES[item.status] || STATUS_STYLES.PENDING;
    const serviceName = item.listing?.title || item.category || 'Service';
    const canTrack = isTrackable(item.status);

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => router.push(`/bookings/${item.id}` as any)}
      >
        <View style={styles.bookingHeader}>
          <View style={styles.bookingIcon}>
            <Ionicons name="sparkles" size={24} color={colors.gray[600]} />
          </View>
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle} numberOfLines={1}>{serviceName}</Text>
            <Text style={styles.bookingVendor}>{item.vendor?.businessName || 'Provider'}</Text>
          </View>
          {canTrack && (
            <View style={styles.trackingIndicator}>
              <View style={styles.trackingDot} />
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </View>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={colors.gray[500]} />
            <Text style={styles.detailText}>
              {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'TBD'}
              {item.scheduledTime && ` at ${item.scheduledTime}`}
            </Text>
          </View>
          {item.address && (
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={16} color={colors.gray[500]} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.address?.street}, {item.address?.city}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.bookingFooter}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
          </View>
          {canTrack ? (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => handleTrackBooking(item.id)}
            >
              <Ionicons name="navigate" size={14} color={colors.text.inverse} />
              <Text style={styles.trackButtonText}>Track</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.bookingTotal}>${item.total?.toFixed(2) || '0.00'}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="calendar-outline" size={64} color={colors.gray[400]} />
      </View>
      <Text style={styles.emptyTitle}>No bookings yet</Text>
      <Text style={styles.emptyText}>Start exploring services to make your first booking</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.browseButtonText}>Browse Services</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: '#FEE2E2' }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#991B1B" />
      </View>
      <Text style={styles.emptyTitle}>Unable to load bookings</Text>
      <Text style={styles.emptyText}>{error || 'Please check your connection and try again'}</Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={onRefresh}
      >
        <Text style={styles.browseButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Show error state if there's an error and no cached bookings
  if (error && bookings.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Bookings</Text>
        </View>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: borderWidth.default,
    borderBottomColor: colors.gray[200],
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.gray[900],
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  tab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  tabActive: {
    backgroundColor: colors.gray[800],
  },
  tabText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.text.inverse,
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  bookingCard: {
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  bookingIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  bookingVendor: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  bookingDetails: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  bookingTotal: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  trackingIndicator: {
    marginRight: spacing.sm,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.full,
  },
  trackButtonText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    marginBottom: spacing.xl,
    textAlign: 'center',
    maxWidth: 280,
  },
  browseButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
  },
  browseButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});

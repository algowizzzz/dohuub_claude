import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { EmptyState } from '../../src/components/ui';

interface OrderHistoryItem {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  status: 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  category: string;
}

const MOCK_HISTORY: OrderHistoryItem[] = [
  {
    id: '1',
    serviceName: 'Deep House Cleaning',
    providerName: 'CleanPro Services',
    date: 'Dec 15, 2025',
    status: 'COMPLETED',
    totalPrice: 120,
    category: 'cleaning',
  },
  {
    id: '2',
    serviceName: 'Plumbing Repair',
    providerName: 'FixIt Handyman',
    date: 'Dec 10, 2025',
    status: 'COMPLETED',
    totalPrice: 85,
    category: 'handyman',
  },
  {
    id: '3',
    serviceName: 'Grocery Delivery',
    providerName: 'Fresh Grocers',
    date: 'Dec 5, 2025',
    status: 'CANCELLED',
    totalPrice: 45,
    category: 'groceries',
  },
  {
    id: '4',
    serviceName: 'Haircut & Styling',
    providerName: 'Style Studio',
    date: 'Nov 28, 2025',
    status: 'COMPLETED',
    totalPrice: 65,
    category: 'beauty',
  },
];

/**
 * Order History screen matching wireframe:
 * - List of past orders
 * - Order status badges
 * - Reorder option for completed orders
 */
export default function OrderHistoryScreen() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>(MOCK_HISTORY);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    return order.status === filter.toUpperCase();
  });

  const handleOrderPress = (order: OrderHistoryItem) => {
    router.push({
      pathname: '/bookings/[id]',
      params: { id: order.id },
    });
  };

  const handleReorder = (order: OrderHistoryItem) => {
    router.push(`/services/${order.category}` as any);
  };

  const getCategoryIcon = (category: string): keyof typeof Ionicons.glyphMap => {
    switch (category) {
      case 'cleaning':
        return 'sparkles';
      case 'handyman':
        return 'hammer';
      case 'groceries':
        return 'basket';
      case 'beauty':
        return 'cut';
      case 'rentals':
        return 'home';
      case 'caregiving':
        return 'heart';
      default:
        return 'cube';
    }
  };

  const renderOrder = ({ item }: { item: OrderHistoryItem }) => (
    <TouchableOpacity style={styles.orderCard} onPress={() => handleOrderPress(item)}>
      <View style={styles.orderHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={getCategoryIcon(item.category)} size={24} color={colors.gray[600]} />
        </View>
        <View style={styles.orderInfo}>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
          <Text style={styles.providerName}>{item.providerName}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'COMPLETED' ? styles.completedBadge : styles.cancelledBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'COMPLETED' ? styles.completedText : styles.cancelledText,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.gray[500]} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <Text style={styles.totalPrice}>${item.totalPrice.toFixed(2)}</Text>
      </View>

      {item.status === 'COMPLETED' && (
        <TouchableOpacity
          style={styles.reorderButton}
          onPress={() => handleReorder(item)}
        >
          <Ionicons name="refresh" size={16} color={colors.primary} />
          <Text style={styles.reorderText}>Reorder</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order History" showBack />

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {(['all', 'completed', 'cancelled'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No Orders Found"
            description={
              filter === 'all'
                ? "You haven't made any orders yet."
                : `No ${filter} orders found.`
            }
          />
        }
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
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  filterTab: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
  },
  filterTabActive: {
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
    flexGrow: 1,
  },
  orderCard: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  providerName: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  statusBadge: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.full,
  },
  completedBadge: {
    backgroundColor: '#DCFCE7',
  },
  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  completedText: {
    color: '#166534',
  },
  cancelledText: {
    color: '#991B1B',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  totalPrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.md,
  },
  reorderText: {
    fontSize: fontSize.sm,
    fontWeight: '500',
    color: colors.primary,
  },
});


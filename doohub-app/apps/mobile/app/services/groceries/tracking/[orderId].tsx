import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../../../src/constants/theme';
import { ScreenHeader } from '../../../../src/components/composite';
import { Button } from '../../../../src/components/ui';

const ORDER_STATUSES = [
  { id: 'placed', label: 'Order Placed', icon: 'checkmark-circle', time: '2:30 PM' },
  { id: 'preparing', label: 'Preparing', icon: 'restaurant', time: '2:35 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: 'bicycle', time: null },
  { id: 'delivered', label: 'Delivered', icon: 'home', time: null },
];

// Mock data
const MOCK_ORDER = {
  id: 'ORDER123',
  status: 'preparing',
  vendorName: 'Fresh Market Groceries',
  estimatedDelivery: '3:15 PM - 3:30 PM',
  driver: {
    name: 'John D.',
    phone: '+1234567890',
    vehicle: 'Gray Honda Civic',
  },
  items: [
    { name: 'Organic Bananas', quantity: 2, price: 2.99 },
    { name: 'Whole Milk', quantity: 1, price: 4.99 },
    { name: 'Sourdough Bread', quantity: 1, price: 4.99 },
  ],
  total: 17.96,
};

/**
 * Groceries Order Tracking Screen matching wireframe:
 * - Order status timeline
 * - Estimated delivery time
 * - Driver info (when assigned)
 * - Contact driver button
 * - Order details expandable
 */
export default function OrderTrackingScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order] = useState(MOCK_ORDER);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.id === order.status);
  const isDriverAssigned = currentStatusIndex >= 2;

  const handleContactDriver = () => {
    if (order.driver?.phone) {
      Linking.openURL(`tel:${order.driver.phone}`);
    }
  };

  const handleContactSupport = () => {
    // TODO: Navigate to support or open chat
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Order Status" showBack />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Order ID */}
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{order.id}</Text>
        </View>

        {/* Estimated Delivery */}
        <View style={styles.estimatedDelivery}>
          <Text style={styles.estimatedLabel}>Estimated Delivery</Text>
          <Text style={styles.estimatedTime}>{order.estimatedDelivery}</Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.timeline}>
            {ORDER_STATUSES.map((status, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <View key={status.id} style={styles.timelineItem}>
                  <View style={styles.timelineIconContainer}>
                    <View
                      style={[
                        styles.timelineIcon,
                        isCompleted && styles.timelineIconCompleted,
                        isCurrent && styles.timelineIconCurrent,
                      ]}
                    >
                      <Ionicons
                        name={status.icon as any}
                        size={20}
                        color={isCompleted ? colors.text.inverse : colors.gray[400]}
                      />
                    </View>
                    {index < ORDER_STATUSES.length - 1 && (
                      <View
                        style={[
                          styles.timelineLine,
                          isCompleted && index < currentStatusIndex && styles.timelineLineCompleted,
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        isCompleted && styles.timelineLabelCompleted,
                        isCurrent && styles.timelineLabelCurrent,
                      ]}
                    >
                      {status.label}
                    </Text>
                    {status.time && (
                      <Text style={styles.timelineTime}>{status.time}</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Driver Info */}
        {isDriverAssigned && order.driver && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Driver</Text>
            <View style={styles.driverCard}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color={colors.gray[400]} />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{order.driver.name}</Text>
                <Text style={styles.driverVehicle}>{order.driver.vehicle}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} onPress={handleContactDriver}>
                <Ionicons name="call" size={20} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Order Details */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.orderDetailsHeader}
            onPress={() => setShowOrderDetails(!showOrderDetails)}
          >
            <Text style={styles.sectionTitle}>Order Details</Text>
            <Ionicons
              name={showOrderDetails ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.gray[600]}
            />
          </TouchableOpacity>

          {showOrderDetails && (
            <View style={styles.orderDetails}>
              <View style={styles.vendorRow}>
                <Ionicons name="storefront-outline" size={20} color={colors.gray[600]} />
                <Text style={styles.vendorName}>{order.vendorName}</Text>
              </View>

              {order.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportButton} onPress={handleContactSupport}>
          <Ionicons name="help-circle-outline" size={20} color={colors.gray[600]} />
          <Text style={styles.supportText}>Need help with your order?</Text>
        </TouchableOpacity>
      </ScrollView>
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
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  orderIdLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  orderId: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[800],
    fontFamily: 'monospace',
  },
  estimatedDelivery: {
    padding: spacing.lg,
    backgroundColor: colors.gray[800],
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  estimatedLabel: {
    fontSize: fontSize.sm,
    color: colors.gray[300],
    marginBottom: spacing.xs,
  },
  estimatedTime: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  timeline: {
    paddingLeft: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 60,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineIconCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineIconCurrent: {
    backgroundColor: colors.gray[800],
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.gray[200],
    marginVertical: spacing.xs,
  },
  timelineLineCompleted: {
    backgroundColor: colors.status.success,
  },
  timelineContent: {
    flex: 1,
    paddingTop: spacing.sm,
  },
  timelineLabel: {
    fontSize: fontSize.md,
    color: colors.gray[400],
  },
  timelineLabelCompleted: {
    color: colors.gray[700],
  },
  timelineLabelCurrent: {
    color: colors.gray[900],
    fontWeight: '600',
  },
  timelineTime: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    marginTop: spacing.xs,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  driverVehicle: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.status.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
  },
  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  vendorName: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[800],
  },
  itemRow: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  itemQuantity: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray[800],
  },
  itemPrice: {
    fontSize: fontSize.sm,
    color: colors.gray[700],
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  totalLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  totalValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.gray[900],
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  supportText: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    textDecorationLine: 'underline',
  },
});


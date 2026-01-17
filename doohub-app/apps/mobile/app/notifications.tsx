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
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../src/constants/theme';
import { ScreenHeader } from '../src/components/composite';
import { EmptyState } from '../src/components/ui';

interface Notification {
  id: string;
  type: 'booking' | 'order' | 'promo' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your cleaning service has been confirmed for Jan 15 at 10:00 AM',
    timestamp: '2 hours ago',
    read: false,
    actionRoute: '/bookings/123',
  },
  {
    id: '2',
    type: 'order',
    title: 'Order on the way',
    message: 'Your groceries order is out for delivery. ETA: 25 min',
    timestamp: '3 hours ago',
    read: false,
    actionRoute: '/services/groceries/tracking/ORDER123',
  },
  {
    id: '3',
    type: 'promo',
    title: '20% Off Beauty Services',
    message: 'Use code BEAUTY20 for 20% off your next beauty appointment',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated',
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: '5',
    type: 'booking',
    title: 'Rate Your Experience',
    message: 'How was your recent handyman service? Leave a review!',
    timestamp: '3 days ago',
    read: true,
    actionRoute: '/review/456',
  },
];

const getNotificationIcon = (type: Notification['type']): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case 'booking':
      return 'calendar-outline';
    case 'order':
      return 'cube-outline';
    case 'promo':
      return 'pricetag-outline';
    case 'system':
      return 'settings-outline';
    default:
      return 'notifications-outline';
  }
};

/**
 * Notifications Panel/List Screen matching wireframe:
 * - Header: "Notifications"
 * - Notification cards with icon, title, message, timestamp
 * - Read/unread indicator
 * - Mark all as read
 * - Empty state
 */
export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch notifications from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationPress = (notification: Notification) => {
    // Mark as read
    setNotifications(notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // Navigate if there's an action route
    if (notification.actionRoute) {
      router.push(notification.actionRoute as any);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.notificationUnread]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, !item.read && styles.iconContainerUnread]}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={24}
          color={!item.read ? colors.gray[800] : colors.gray[500]}
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !item.read && styles.notificationTitleUnread]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notifications"
        showBack
        rightIcon={unreadCount > 0 ? 'checkmark-done-outline' : undefined}
        onRightAction={unreadCount > 0 ? handleMarkAllRead : undefined}
      />

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No notifications"
            message="You're all caught up! Check back later for updates."
          />
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
  listContent: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[200],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  notificationUnread: {
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[300],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconContainerUnread: {
    backgroundColor: colors.gray[200],
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  notificationTitle: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[700],
    flex: 1,
  },
  notificationTitleUnread: {
    fontWeight: '600',
    color: colors.gray[900],
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.status.info,
    marginLeft: spacing.sm,
  },
  notificationMessage: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.gray[400],
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { DeleteAccountModal, LogoutModal } from '../../src/components/modals';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'edit-profile', label: 'Edit Profile', icon: 'person-outline', route: '/profile/edit' },
      { id: 'addresses', label: 'Saved Addresses', icon: 'location-outline', route: '/profile/addresses' },
      { id: 'payment', label: 'Payment Methods', icon: 'card-outline', route: '/profile/payment-methods' },
      { id: 'orders', label: 'Order History', icon: 'receipt-outline', route: '/profile/history' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'notifications-outline', route: '/profile/notifications' },
      { id: 'region', label: 'Change Region', icon: 'globe-outline', route: '/profile/region' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help & Support', icon: 'help-circle-outline', route: '/profile/help' },
      { id: 'about', label: 'About DoHuub', icon: 'information-circle-outline', route: '/profile/about' },
      { id: 'terms', label: 'Terms of Service', icon: 'document-text-outline', route: '/profile/terms' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield-outline', route: '/profile/privacy' },
    ],
  },
];

/**
 * Profile screen matching wireframe:
 * - User info card with edit button
 * - Menu sections (Account, Preferences, Support)
 * - Logout button
 * - Delete account option
 */
export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      router.replace('/(auth)/welcome');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async (password: string) => {
    setIsDeleting(true);
    try {
      // TODO: Call delete account API with password
      console.log('Deleting account with password:', password);
      // For now, just log out
      await logout();
      setShowDeleteModal(false);
      router.replace('/(auth)/welcome');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMenuItemPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info Card */}
        <TouchableOpacity
          style={styles.userCard}
          onPress={() => handleMenuItemPress('/profile/edit')}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={colors.gray[400]} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.profile?.firstName || 'Your'} {user?.profile?.lastName || 'Name'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
        </TouchableOpacity>

        {/* Menu Sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    index < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <Ionicons name={item.icon as any} size={22} color={colors.gray[600]} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={() => setShowLogoutModal(true)}>
          <Ionicons name="log-out-outline" size={22} color={colors.status.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteButton} onPress={() => setShowDeleteModal(true)}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>DoHuub v1.0.0</Text>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      {/* Logout Modal */}
      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={isLoggingOut}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
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
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  menuCard: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  menuItemBorder: {
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.gray[800],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.status.error,
  },
  deleteButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.md,
  },
  deleteText: {
    fontSize: fontSize.sm,
    color: colors.gray[500],
    textDecorationLine: 'underline',
  },
  version: {
    textAlign: 'center',
    fontSize: fontSize.sm,
    color: colors.gray[400],
    marginTop: spacing.xl,
  },
});

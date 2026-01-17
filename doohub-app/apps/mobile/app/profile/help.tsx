import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, borderWidth } from '../../src/constants/theme';
import { ScreenHeader } from '../../src/components/composite';
import { Input, Button } from '../../src/components/ui';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book a service?',
    answer:
      'Browse available services from the home screen, select a provider, choose your preferred date and time, and proceed to payment. You\'ll receive a confirmation once your booking is complete.',
  },
  {
    id: '2',
    question: 'How can I cancel a booking?',
    answer:
      'Go to My Bookings, select the booking you want to cancel, and tap "Cancel Booking". Please note that cancellation policies vary by service provider.',
  },
  {
    id: '3',
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit and debit cards, Apple Pay, and Google Pay. All payments are processed securely through Stripe.',
  },
  {
    id: '4',
    question: 'How do I contact my service provider?',
    answer:
      'After booking, you can message your provider directly through the chat feature in your booking details. You\'ll also receive their contact information.',
  },
  {
    id: '5',
    question: 'What if I\'m not satisfied with the service?',
    answer:
      'We have a satisfaction guarantee. If you\'re not happy with the service, contact our support team within 24 hours and we\'ll work to resolve the issue.',
  },
];

const CONTACT_OPTIONS = [
  {
    id: 'email',
    icon: 'mail-outline' as const,
    label: 'Email Support',
    description: 'support@dohuub.com',
    action: () => Linking.openURL('mailto:support@dohuub.com'),
  },
  {
    id: 'phone',
    icon: 'call-outline' as const,
    label: 'Call Us',
    description: '1-800-DOHUUB',
    action: () => Linking.openURL('tel:18003648882'),
  },
  {
    id: 'chat',
    icon: 'chatbubble-outline' as const,
    label: 'Live Chat',
    description: 'Available 24/7',
    action: () => Alert.alert('Coming Soon', 'Live chat support will be available soon!'),
  },
];

/**
 * Help & Support screen matching wireframe:
 * - Search bar for FAQs
 * - FAQ accordion
 * - Contact options
 * - Submit a request form
 */
export default function HelpScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Help & Support" showBack />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Ionicons name="search" size={20} color={colors.gray[400]} />}
          containerStyle={styles.searchContainer}
        />

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqList}>
            {filteredFAQs.map((faq) => (
              <TouchableOpacity
                key={faq.id}
                style={styles.faqItem}
                onPress={() => toggleFAQ(faq.id)}
              >
                <View style={styles.faqHeader}>
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.gray[500]}
                  />
                </View>
                {expandedFAQ === faq.id && (
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.contactList}>
            {CONTACT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.contactCard}
                onPress={option.action}
              >
                <View style={styles.contactIcon}>
                  <Ionicons name={option.icon} size={24} color={colors.gray[600]} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{option.label}</Text>
                  <Text style={styles.contactDescription}>{option.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Request */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <View style={styles.requestCard}>
            <Text style={styles.requestText}>
              Can't find what you're looking for? Submit a support request and we'll get back to you
              within 24 hours.
            </Text>
            <Button
              title="Submit a Request"
              onPress={() =>
                Alert.alert('Coming Soon', 'Support request form will be available soon!')
              }
              variant="outline"
              fullWidth
            />
          </View>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
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
  },
  searchContainer: {
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.gray[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  faqList: {
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  faqItem: {
    padding: spacing.md,
    borderBottomWidth: borderWidth.thin,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.background,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
    marginRight: spacing.sm,
  },
  faqAnswer: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 22,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.gray[200],
  },
  contactList: {
    gap: spacing.sm,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: borderWidth.default,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: fontSize.md,
    fontWeight: '500',
    color: colors.gray[900],
    marginBottom: spacing.xs,
  },
  contactDescription: {
    fontSize: fontSize.sm,
    color: colors.gray[600],
  },
  requestCard: {
    padding: spacing.lg,
    backgroundColor: colors.gray[50],
    borderRadius: borderRadius.lg,
    gap: spacing.md,
  },
  requestText: {
    fontSize: fontSize.md,
    color: colors.gray[600],
    lineHeight: 22,
  },
});


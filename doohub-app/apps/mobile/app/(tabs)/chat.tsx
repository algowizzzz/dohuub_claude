import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../../src/services/api';
import { ENDPOINTS } from '../../src/constants/api';
import { Card, Rating } from '../../src/components/ui';
import { colors, spacing, fontSize, borderRadius } from '../../src/constants/theme';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata?: {
    type?: 'text' | 'service-cards' | 'category-chips';
    services?: any[];
    categories?: string[];
  };
}

const SUGGESTED_PROMPTS = [
  'Find cleaning service',
  'Book handyman',
  'Order groceries',
  'Beauty services near me',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your DoHuub assistant. How can I help you today?",
      metadata: { type: 'text' },
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response: any = await api.post(`${ENDPOINTS.CHAT}/send`, {
        conversationId,
        message: text,
      });

      setConversationId(response.data.conversationId);

      const aiMessage: Message = {
        id: response.data.message.id,
        role: 'assistant',
        content: response.data.message.content,
        metadata: response.data.message.metadata,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      // Fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I can help you with various services. What would you like to explore?",
        metadata: {
          type: 'category-chips',
          categories: ['Cleaning', 'Handyman', 'Groceries', 'Beauty', 'Rentals', 'Caregiving'],
        },
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your DoHuub assistant. How can I help you today?",
        metadata: { type: 'text' },
      },
    ]);
    setConversationId(null);
  };

  const handleCategoryPress = (category: string) => {
    sendMessage(`Show me ${category.toLowerCase()} services`);
  };

  const handleServicePress = (service: any) => {
    // Navigate to service detail
    router.push(`/services/${service.category?.toLowerCase() || 'cleaning'}` as any);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageContainer}>
      <View
        style={[
          styles.messageBubble,
          item.role === 'user' ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {item.role === 'assistant' && (
          <View style={styles.botAvatar}>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.messageContent}>
          <Text
            style={[
              styles.messageText,
              item.role === 'user' ? styles.userText : styles.assistantText,
            ]}
          >
            {item.content}
          </Text>
        </View>
        {item.role === 'user' && <View style={styles.userAvatar} />}
      </View>

      {/* Service Cards */}
      {item.metadata?.type === 'service-cards' && item.metadata.services && (
        <View style={styles.serviceCards}>
          {item.metadata.services.map((service, index) => (
            <Card
              key={index}
              style={styles.serviceCard}
              onPress={() => handleServicePress(service)}
            >
              <View style={styles.serviceCardContent}>
                <View style={styles.serviceIcon}>
                  <Ionicons name="sparkles" size={24} color={colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceVendor}>{service.vendor}</Text>
                  <View style={styles.serviceFooter}>
                    <Rating rating={service.rating} reviewCount={service.reviews} size="sm" />
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Category Chips */}
      {item.metadata?.type === 'category-chips' && item.metadata.categories && (
        <View style={styles.categoryChips}>
          {item.metadata.categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryChip}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryChipText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <View style={styles.botAvatar}>
        <Ionicons name="sparkles" size={20} color={colors.primary} />
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.typingDots}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.typingDot, { animationDelay: `${i * 0.2}s` }]} />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Text style={styles.newChatText}>New Chat</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListFooterComponent={isTyping ? renderTypingIndicator : null}
        showsVerticalScrollIndicator={false}
      />

      {/* Suggested Prompts (only show at start) */}
      {messages.length === 1 && (
        <View style={styles.suggestedPrompts}>
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              style={styles.promptChip}
              onPress={() => sendMessage(prompt)}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything..."
          placeholderTextColor={colors.text.muted}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={input.trim() ? colors.text.inverse : colors.text.muted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '600',
    color: colors.text.primary,
  },
  newChatButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.default,
    borderRadius: borderRadius.md,
  },
  newChatText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  messagesList: {
    padding: spacing.lg,
  },
  messageContainer: {
    marginBottom: spacing.md,
  },
  messageBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.border.default,
  },
  messageContent: {
    maxWidth: '70%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  messageText: {
    fontSize: fontSize.md,
    lineHeight: 22,
  },
  userText: {
    color: colors.text.inverse,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    overflow: 'hidden',
  },
  assistantText: {
    color: colors.text.primary,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    overflow: 'hidden',
  },
  serviceCards: {
    marginLeft: 44,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  serviceCard: {
    padding: spacing.sm,
  },
  serviceCardContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
  },
  serviceVendor: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 44,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  categoryChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border.default,
    borderRadius: borderRadius.full,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: '500',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typingBubble: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.muted,
  },
  suggestedPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  promptChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  promptText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border.light,
  },
});


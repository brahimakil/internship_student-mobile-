import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen, Header } from '@/components/layout';
import { Card } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { aiApi } from '@/services/api';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiChatScreen() {
  const { theme } = useTheme();
  const { student } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI internship assistant. I can help you find internships, apply for them, and provide career guidance. Just ask me to "apply for [internship name]" and I\'ll help you enroll. How can I assist you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear the chat history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              if (student) {
                try {
                  await aiApi.clearChat(student.id);
                } catch (error) {
                  console.error('Error clearing chat from database:', error);
                }
              }
              setMessages([{
                id: '1',
                text: 'Hello! I\'m your AI internship assistant. I can help you find internships, apply for them, and provide career guidance. Just ask me to "apply for [internship name]" and I\'ll help you enroll. How can I assist you today?',
                sender: 'ai',
                timestamp: new Date(),
              }]);
            })();
          },
        },
      ]
    );
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || !student) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Get last 5 messages for context
      const recentMessages = messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join('\n');
      const conversationContext = `${recentMessages}\nuser: ${userMessage.text}`;

      const response = await aiApi.chat({
        message: userMessage.text,
        studentId: student.id,
        context: conversationContext,
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to get AI response');
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again or check that you have set up your Gemini API key in your profile.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="chatbubbles" size={16} color={theme.colors.surface} />
          </View>
        )}

        <Card
          style={[
            styles.messageBubble,
            {
              backgroundColor: isUser ? theme.colors.primary : theme.colors.surface,
              maxWidth: '75%',
            },
          ]}
          padding={12}
        >
          <Text
            style={[
              styles.messageText,
              {
                color: isUser ? theme.colors.surface : theme.colors.text,
              },
            ]}
          >
            {item.text}
          </Text>
        </Card>

        {isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.colors.secondary }]}>
            <Ionicons name="person" size={16} color={theme.colors.surface} />
          </View>
        )}
      </View>
    );
  };

  if (!student) {
    return (
      <Screen>
        <Header title="AI Assistant" showMenu />
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            Please log in to use AI Assistant
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable={false} padding={false}>
      <Header 
        title="AI Assistant" 
        showMenu 
        rightAction={{
          icon: 'trash-outline',
          onPress: clearChat,
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
              },
            ]}
            placeholder="Type your message..."
            placeholderTextColor={theme.colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim() ? theme.colors.primary : theme.colors.border,
              },
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            {loading ? (
              <Ionicons name="hourglass" size={24} color={theme.colors.surface} />
            ) : (
              <Ionicons name="send" size={24} color={theme.colors.surface} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBubble: {
    borderRadius: 16,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickResponses = [
  "I had a bad day",
  "I feel frustrated",
  "I don't feel good enough",
  "I'm feeling anxious",
  "I am feeling lonely"
];

export default function AICompanionScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your Happistaa companion. I'm here to listen and support you. How are you feeling today?",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(message),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      
      if (Platform.OS !== 'web' && aiResponse.content) {
        speakText(aiResponse.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "I hear you, and I want you to know that your feelings are valid. Can you tell me more about what's been on your mind?",
      "Thank you for sharing that with me. It takes courage to express how you're feeling. What would help you feel better right now?",
      "I'm here to listen and support you. Sometimes talking through our feelings can help us understand them better. What's been the most challenging part of your day?",
      "Your feelings matter, and I'm glad you're reaching out. Remember that it's okay to have difficult days. What usually helps you when you're feeling this way?",
      "I appreciate you opening up to me. Everyone goes through tough times, and you're not alone in this. What's one small thing that might bring you some comfort today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const speakText = async (text: string) => {
    if (Platform.OS === 'web') return;
    
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error speaking text:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (Platform.OS !== 'web') {
      Speech.stop();
    }
    setIsSpeaking(false);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#1E3A5F" />
          </TouchableOpacity>
          <Text style={styles.title}>AI Companion</Text>
          <TouchableOpacity onPress={isSpeaking ? stopSpeaking : undefined}>
            <Text style={styles.speakButton}>
              {isSpeaking ? '🔇' : '🔊'}
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Messages */}
          <ScrollView 
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.role === 'user' ? styles.userMessage : styles.assistantMessage
                ]}
              >
                <Text style={[
                  styles.messageText,
                  message.role === 'user' ? styles.userMessageText : styles.assistantMessageText
                ]}>
                  {message.content}
                </Text>
                <Text style={[
                  styles.messageTime,
                  message.role === 'user' ? styles.userMessageTime : styles.assistantMessageTime
                ]}>
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageContainer, styles.assistantMessage]}>
                <Text style={styles.loadingText}>Typing...</Text>
              </View>
            )}
          </ScrollView>

          {/* Quick Responses */}
          {messages.length === 1 && (
            <ScrollView 
              horizontal 
              style={styles.quickResponsesContainer}
              showsHorizontalScrollIndicator={false}
            >
              {quickResponses.map((response, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickResponseButton}
                  onPress={() => handleSendMessage(response)}
                >
                  <Text style={styles.quickResponseText}>{response}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#A0AEC0"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={() => handleSendMessage(inputText)}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  speakButton: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E3A5F',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  assistantMessageText: {
    color: '#2D3748',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },
  userMessageTime: {
    color: '#E2E8F0',
  },
  assistantMessageTime: {
    color: '#A0AEC0',
  },
  loadingText: {
    fontSize: 16,
    color: '#A0AEC0',
    fontStyle: 'italic',
  },
  quickResponsesContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  quickResponseButton: {
    backgroundColor: '#F6D2C6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
  },
  quickResponseText: {
    fontSize: 14,
    color: '#2D3748',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
    color: '#2D3748',
  },
  sendButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
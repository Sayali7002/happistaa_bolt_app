import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isUser }) => {
  const formatTime = (timestamp: string | Date) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.otherContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.otherBubble
      ]}>
        {message.sender === 'system' ? (
          <Text style={styles.systemText}>{message.message}</Text>
        ) : (
          <>
            {!isUser && (
              <Text style={styles.senderName}>
                {message.isAnonymous ? 'Anonymous' : message.sender}
                {message.isAnonymous && message.sender !== 'you' && " (Anonymous)"}
              </Text>
            )}
            <Text style={[
              styles.messageText,
              isUser ? styles.userText : styles.otherText
            ]}>
              {message.message}
            </Text>
          </>
        )}
      </View>
      <Text style={[
        styles.timestamp,
        isUser ? styles.userTimestamp : styles.otherTimestamp
      ]}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  otherContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#1E3A5F',
  },
  otherBubble: {
    backgroundColor: '#FFFFFF',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  otherText: {
    color: '#2D3748',
  },
  systemText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#718096',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  userTimestamp: {
    color: '#CBD5E0',
    textAlign: 'right',
  },
  otherTimestamp: {
    color: '#A0AEC0',
  },
});
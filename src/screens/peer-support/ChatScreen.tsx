import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChatMessage } from '../../components/peer-support/ChatMessage';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessage as ChatMessageType, PeerMatch } from '../../types';

interface ChatScreenProps {
  navigation: any;
  route: any;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation, route }) => {
  const { peer } = route.params || {};
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'system-welcome',
      sender: 'system',
      message: `You are now connected with ${peer?.name || 'this peer'}. This conversation is private and secure.`,
      timestamp: new Date(),
      isAnonymous: false
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // In a real app, this would fetch messages from your API
    // For now, we'll use mock data
  }, [peer]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    // Create a new message
    const newMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'you',
      message: inputText.trim(),
      timestamp: new Date(),
      isAnonymous,
      senderId: user?.id,
      receiverId: peer?.id
    };
    
    // Add to messages
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // In a real app, this would send the message to your API
    
    // Simulate a response after a delay
    setTimeout(() => {
      const responseMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: peer?.name || 'Peer',
        message: 'Thanks for reaching out! How can I help you today?',
        timestamp: new Date(),
        isAnonymous: false,
        senderId: peer?.id,
        receiverId: user?.id
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 2000);
  };

  const handleDeleteChat = () => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call your API to delete the chat
            navigation.goBack();
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          
          <View style={styles.peerInfo}>
            <View style={styles.peerNameContainer}>
              <Text style={styles.peerName}>{peer?.name || 'Peer'}</Text>
              {peer?.isActive && <View style={styles.activeIndicator} />}
            </View>
            <Text style={styles.peerRating}>⭐ {peer?.rating || 4.5} ({peer?.totalRatings || 0})</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={handleDeleteChat}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
        
        {/* Anonymous toggle */}
        <View style={styles.anonymousToggle}>
          <Text style={styles.anonymousText}>Anonymous:</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            trackColor={{ false: '#E2E8F0', true: '#1E3A5F' }}
            thumbColor={isAnonymous ? '#FFFFFF' : '#FFFFFF'}
          />
        </View>

        {/* Shared journeys info */}
        {peer?.supportPreferences && peer.supportPreferences.length > 0 && (
          <View style={styles.sharedJourneysContainer}>
            <Text style={styles.sharedJourneysTitle}>Areas of experience:</Text>
            <View style={styles.tagsContainer}>
              {peer.supportPreferences.slice(0, 3).map((area, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{area}</Text>
                </View>
              ))}
              {peer.supportPreferences.length > 3 && (
                <View style={styles.tag}>
                  <Text style={styles.tagText}>+{peer.supportPreferences.length - 3} more</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <KeyboardAvoidingView 
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => (
              <ChatMessage 
                message={item} 
                isUser={item.sender === 'you'} 
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          
          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder={isAnonymous ? "Type anonymously..." : "Type your message..."}
              placeholderTextColor="#A0AEC0"
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

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
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 18,
    color: '#4A5568',
  },
  peerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  peerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  peerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginRight: 8,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#48BB78',
  },
  peerRating: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F7FAFC',
  },
  anonymousText: {
    fontSize: 14,
    color: '#4A5568',
    marginRight: 8,
  },
  sharedJourneysContainer: {
    backgroundColor: '#F7FAFC',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sharedJourneysTitle: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#4A5568',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#2D3748',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
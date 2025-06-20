import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

interface RequestsScreenProps {
  navigation: any;
}

interface SupportRequest {
  id: string;
  sender_name: string;
  sender_avatar: string;
  message: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
  is_anonymous: boolean;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, [activeTab]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockRequests: SupportRequest[] = [
          {
            id: '1',
            sender_name: activeTab === 'received' ? 'John Doe' : 'Sarah Johnson',
            sender_avatar: activeTab === 'received' ? '👨' : '👩',
            message: 'Hi there! I saw we share similar experiences with anxiety. I would love to connect and learn from your journey.',
            created_at: new Date().toISOString(),
            status: 'pending',
            is_anonymous: false,
          },
          {
            id: '2',
            sender_name: activeTab === 'received' ? 'Anonymous User' : 'Michael Chen',
            sender_avatar: activeTab === 'received' ? '😊' : '👨',
            message: 'I\'ve been struggling with work-life balance lately and noticed you have experience in this area. Would appreciate some guidance.',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            status: activeTab === 'received' ? 'pending' : 'accepted',
            is_anonymous: activeTab === 'received',
          },
          {
            id: '3',
            sender_name: activeTab === 'received' ? 'Emma Rodriguez' : 'David Wilson',
            sender_avatar: activeTab === 'received' ? '👩‍🦱' : '👨‍🦰',
            message: 'Hello! I noticed we both have experience with depression. I would love to share coping strategies if you\'re open to it.',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            status: 'rejected',
            is_anonymous: false,
          },
        ];
        
        setRequests(mockRequests);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', 'Failed to load requests');
      setLoading(false);
    }
  };

  const handleAccept = (requestId: string) => {
    // In a real app, this would call your API
    Alert.alert(
      'Accept Request',
      'Are you sure you want to accept this connection request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            setRequests(prev => 
              prev.map(req => 
                req.id === requestId ? { ...req, status: 'accepted' } : req
              )
            );
          },
        },
      ]
    );
  };

  const handleReject = (requestId: string) => {
    // In a real app, this would call your API
    Alert.alert(
      'Reject Request',
      'Are you sure you want to reject this connection request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => 
              prev.map(req => 
                req.id === requestId ? { ...req, status: 'rejected' } : req
              )
            );
          },
        },
      ]
    );
  };

  const handleCancel = (requestId: string) => {
    // In a real app, this would call your API
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel this connection request?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(req => req.id !== requestId));
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderRequest = ({ item }: { item: SupportRequest }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.senderInfo}>
          <Text style={styles.senderAvatar}>{item.sender_avatar}</Text>
          <View>
            <Text style={styles.senderName}>
              {item.sender_name}
              {item.is_anonymous && activeTab === 'received' && ' (Anonymous)'}
            </Text>
            <Text style={styles.requestDate}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge,
          item.status === 'pending' ? styles.pendingBadge :
          item.status === 'accepted' ? styles.acceptedBadge :
          styles.rejectedBadge
        ]}>
          <Text style={styles.statusText}>
            {item.status === 'pending' ? 'Pending' :
             item.status === 'accepted' ? 'Accepted' :
             'Declined'}
          </Text>
        </View>
      </View>
      
      <View style={styles.messageContainer}>
        <Text style={styles.message}>{item.message}</Text>
      </View>
      
      {activeTab === 'received' && item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <Button
            title="Accept"
            onPress={() => handleAccept(item.id)}
            variant="primary"
            size="small"
            style={styles.acceptButton}
          />
          <Button
            title="Decline"
            onPress={() => handleReject(item.id)}
            variant="outline"
            size="small"
            style={styles.rejectButton}
          />
        </View>
      )}
      
      {activeTab === 'sent' && item.status === 'pending' && (
        <View style={styles.actionButtons}>
          <Button
            title="Cancel Request"
            onPress={() => handleCancel(item.id)}
            variant="outline"
            size="small"
            style={styles.cancelButton}
          />
        </View>
      )}
      
      {item.status === 'accepted' && (
        <View style={styles.actionButtons}>
          <Button
            title="Message"
            onPress={() => navigation.navigate('Chat', { peerId: item.id })}
            variant="primary"
            size="small"
            style={styles.messageButton}
          />
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Connection Requests</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'received' && styles.activeTab
            ]}
            onPress={() => setActiveTab('received')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'received' && styles.activeTabText
            ]}>
              Received
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'sent' && styles.activeTab
            ]}
            onPress={() => setActiveTab('sent')}
          >
            <Text style={[
              styles.tabText,
              activeTab === 'sent' && styles.activeTabText
            ]}>
              Sent
            </Text>
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={loadRequests}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {activeTab} requests found
              </Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'received' 
                  ? 'When someone sends you a connection request, it will appear here.'
                  : 'When you send connection requests to others, they will appear here.'}
              </Text>
            </View>
          }
        />
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
  backButton: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1E3A5F',
  },
  tabText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  senderAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  senderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 2,
  },
  requestDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadge: {
    backgroundColor: '#FEFCBF',
  },
  acceptedBadge: {
    backgroundColor: '#C6F6D5',
  },
  rejectedBadge: {
    backgroundColor: '#E2E8F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
  },
  messageContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#48BB78',
  },
  rejectButton: {
    borderColor: '#A0AEC0',
  },
  cancelButton: {
    borderColor: '#E53E3E',
  },
  messageButton: {
    backgroundColor: '#1E3A5F',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
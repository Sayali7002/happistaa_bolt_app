import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { ConnectionModal } from '../components/peer-support/ConnectionModal';
import { useAuth } from '../hooks/useAuth';
import { usePeerSupport } from '../hooks/usePeerSupport';
import { PeerMatch } from '../types';

interface PeerDetailScreenProps {
  navigation: any;
  route: any;
}

export const PeerDetailScreen: React.FC<PeerDetailScreenProps> = ({ navigation, route }) => {
  const { peerId } = route.params || {};
  const { user } = useAuth();
  const { 
    peers, 
    isLoading, 
    userProfile, 
    sendConnectionRequest 
  } = usePeerSupport();
  
  const [peer, setPeer] = useState<PeerMatch | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (peerId && peers.length > 0) {
      const foundPeer = peers.find(p => p.id === peerId);
      if (foundPeer) {
        setPeer(foundPeer);
      } else {
        Alert.alert('Error', 'Peer not found');
        navigation.goBack();
      }
    }
  }, [peerId, peers, navigation]);

  // Find shared journeys between the user and the peer
  const sharedJourneys = userProfile?.support_preferences && peer
    ? peer.supportPreferences.filter(pref => userProfile.support_preferences.includes(pref))
    : [];

  const handleConnect = async (message: string, isAnonymous: boolean) => {
    if (!peer) return;
    
    // Check if user is authenticated
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to connect with peers');
      navigation.navigate('Login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const result = await sendConnectionRequest(peer.id, message, isAnonymous);
      
      if (result.success) {
        setRequestSent(true);
        setShowConnectionModal(false);
        Alert.alert('Success', `Request sent to ${peer.name}!`);
      } else {
        throw new Error(result.error || 'Failed to send request');
      }
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      Alert.alert('Error', error.message || 'Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChat = () => {
    if (!peer) return;
    
    // In a real app, this would navigate to a chat screen
    Alert.alert('Chat', `This would open a chat with ${peer.name}`);
  };

  // Determine button text and action
  const getButtonText = () => {
    if (!user) return 'Sign Up to Connect';
    if (isConnected) return 'Message';
    if (requestSent) return 'Request Sent';
    return `Reach Out to ${peer?.name}`;
  };

  const handleButtonClick = () => {
    if (!user) {
      navigation.navigate('Login');
    } else if (isConnected) {
      handleOpenChat();
    } else if (!requestSent) {
      setShowConnectionModal(true);
    }
  };

  if (isLoading || !peer) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Peer Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{peer.avatar}</Text>
                {peer.isActive && <View style={styles.activeIndicator} />}
              </View>
              
              <View style={styles.profileInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{peer.name}</Text>
                  {peer.certifiedMentor && (
                    <View style={styles.certifiedBadge}>
                      <Text style={styles.certifiedText}>Certified</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.detailsRow}>
                  <Text style={styles.rating}>⭐ {peer.rating}</Text>
                  <Text style={styles.ratingCount}>({peer.totalRatings} ratings)</Text>
                  <Text style={styles.location}>• {peer.location}</Text>
                </View>
                
                <Text style={styles.supportType}>
                  {peer.supportType === 'support-giver' ? 'Provides support' : 'Needs support'}
                  {peer.peopleSupported ? ` • Supported ${peer.peopleSupported} people` : ''}
                </Text>
              </View>
            </View>

            {/* Journey Note */}
            {peer.journeyNote && (
              <View style={styles.journeyNoteContainer}>
                <Text style={styles.sectionTitle}>Journey Note</Text>
                <View style={styles.journeyNoteCard}>
                  <Text style={styles.journeyNoteText}>{peer.journeyNote}</Text>
                </View>
              </View>
            )}

            {/* Experience Areas */}
            <View style={styles.experienceContainer}>
              <Text style={styles.sectionTitle}>Experience Areas</Text>
              <View style={styles.tagsContainer}>
                {peer.supportPreferences.map((area, index) => {
                  const isShared = sharedJourneys.includes(area);
                  return (
                    <View 
                      key={index}
                      style={[
                        styles.tag,
                        isShared && styles.sharedTag
                      ]}
                    >
                      <Text style={[
                        styles.tagText,
                        isShared && styles.sharedTagText
                      ]}>
                        {isShared && '✓ '}{area}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Match Score */}
            <View style={styles.matchScoreContainer}>
              <Text style={styles.sectionTitle}>Match Score</Text>
              <View style={styles.matchScoreBar}>
                <View 
                  style={[
                    styles.matchScoreFill,
                    { width: `${peer.matchScore}%` }
                  ]}
                />
              </View>
              <View style={styles.matchScoreLabels}>
                <Text style={styles.matchScoreLabel}>0%</Text>
                <Text style={styles.matchScoreValue}>{peer.matchScore}%</Text>
                <Text style={styles.matchScoreLabel}>100%</Text>
              </View>
            </View>

            {/* Connect Button */}
            <View style={styles.connectButtonContainer}>
              <Button
                title={getButtonText()}
                onPress={handleButtonClick}
                disabled={requestSent}
                size="large"
                style={[
                  styles.connectButton,
                  requestSent && styles.disabledButton,
                  isConnected && styles.messageButton
                ]}
              />
            </View>
          </View>
        </ScrollView>

        {/* Connection Modal */}
        <ConnectionModal
          visible={showConnectionModal}
          peer={peer}
          onClose={() => setShowConnectionModal(false)}
          onSubmit={handleConnect}
          isSubmitting={isSubmitting}
          sharedJourneys={sharedJourneys}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4A5568',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    fontSize: 48,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#48BB78',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginRight: 8,
  },
  certifiedBadge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  certifiedText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    color: '#4A5568',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: '#A0AEC0',
    marginRight: 4,
  },
  location: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  supportType: {
    fontSize: 14,
    color: '#4A5568',
  },
  journeyNoteContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  journeyNoteCard: {
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
    padding: 16,
  },
  journeyNoteText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  experienceContainer: {
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  sharedTag: {
    backgroundColor: '#C6F6D5',
    borderWidth: 1,
    borderColor: '#9AE6B4',
  },
  tagText: {
    fontSize: 14,
    color: '#4A5568',
  },
  sharedTagText: {
    color: '#2F855A',
  },
  matchScoreContainer: {
    marginBottom: 24,
  },
  matchScoreBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  matchScoreFill: {
    height: '100%',
    backgroundColor: '#1E3A5F',
    borderRadius: 4,
  },
  matchScoreLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchScoreLabel: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  matchScoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  connectButtonContainer: {
    alignItems: 'center',
  },
  connectButton: {
    width: '100%',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  messageButton: {
    backgroundColor: '#48BB78',
  },
});
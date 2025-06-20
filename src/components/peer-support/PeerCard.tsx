import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Button } from '../common/Button';
import { PeerMatch } from '../../types';

interface PeerCardProps {
  peer: PeerMatch;
  onPress: (peer: PeerMatch) => void;
  onConnect: (peer: PeerMatch) => void;
}

const { width } = Dimensions.get('window');

export const PeerCard: React.FC<PeerCardProps> = ({ peer, onPress, onConnect }) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onPress(peer)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{peer.avatar}</Text>
          {peer.isActive && <View style={styles.activeIndicator} />}
        </View>
        
        <View style={styles.infoContainer}>
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
            <Text style={styles.ratingCount}>({peer.totalRatings})</Text>
            <Text style={styles.location}>• {peer.location}</Text>
          </View>
          
          <Text style={styles.supportCount}>
            {peer.peopleSupported} People Supported
          </Text>
        </View>
        
        <View style={styles.matchScore}>
          <Text style={styles.matchValue}>{peer.matchScore}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>
      
      {peer.journeyNote && (
        <Text style={styles.journeyNote} numberOfLines={2}>
          {peer.journeyNote}
        </Text>
      )}
      
      <View style={styles.tagsContainer}>
        {peer.supportPreferences.slice(0, 3).map((preference, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{preference}</Text>
          </View>
        ))}
        {peer.supportPreferences.length > 3 && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>+{peer.supportPreferences.length - 3} more</Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.supportType}>
          {peer.supportType === 'support-giver' ? 'Provides support' : 'Needs support'}
        </Text>
        
        <Button
          title="Connect"
          onPress={() => onConnect(peer)}
          size="small"
          style={styles.connectButton}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 32,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#48BB78',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginRight: 8,
  },
  certifiedBadge: {
    backgroundColor: '#48BB78',
    paddingHorizontal: 6,
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
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    color: '#4A5568',
    marginRight: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#A0AEC0',
    marginRight: 4,
  },
  location: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  supportCount: {
    fontSize: 12,
    color: '#4A5568',
  },
  matchScore: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  matchValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  matchLabel: {
    fontSize: 10,
    color: '#A0AEC0',
  },
  journeyNote: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  supportType: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  connectButton: {
    paddingHorizontal: 16,
  },
});
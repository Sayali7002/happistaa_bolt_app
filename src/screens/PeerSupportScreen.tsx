import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { PeerCard } from '../components/peer-support/PeerCard';
import { useAuth } from '../hooks/useAuth';
import { usePeerSupport } from '../hooks/usePeerSupport';
import { PeerMatch } from '../types';

interface PeerSupportScreenProps {
  navigation: any;
}

export const PeerSupportScreen: React.FC<PeerSupportScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { 
    peers, 
    isLoading, 
    filter, 
    applyFilter, 
    fetchPeers 
  } = usePeerSupport();
  
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPeers();
  }, []);

  const handlePeerPress = (peer: PeerMatch) => {
    navigation.navigate('PeerDetail', { peerId: peer.id });
  };

  const handleConnectPress = (peer: PeerMatch) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to connect with peers');
      navigation.navigate('Login');
      return;
    }
    
    navigation.navigate('PeerDetail', { peerId: peer.id });
  };

  const handleViewRequests = () => {
    navigation.navigate('Requests');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Peer Support</Text>
            <Text style={styles.subtitle}>Find friends who understand your journey</Text>
          </View>
          <TouchableOpacity 
            style={styles.requestsButton}
            onPress={handleViewRequests}
          >
            <Text style={styles.requestsButtonText}>Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={styles.filtersContainer}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Find Friends ({peers.length})</Text>
            <TouchableOpacity 
              style={styles.filterToggle}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Text style={styles.filterToggleText}>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterButtonsContainer}
          >
            {[
              { key: 'all', label: 'All' },
              { key: 'support-giver', label: 'Support Givers' },
              { key: 'support-seeker', label: 'Support Seekers' },
            ].map((filterOption) => (
              <TouchableOpacity
                key={filterOption.key}
                style={[
                  styles.filterButton,
                  filter === filterOption.key && styles.filterButtonActive
                ]}
                onPress={() => applyFilter(filterOption.key as any)}
              >
                <Text style={[
                  styles.filterText,
                  filter === filterOption.key && styles.filterTextActive
                ]}>
                  {filterOption.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {showFilters && (
            <View style={styles.advancedFilters}>
              <Text style={styles.advancedFiltersTitle}>Advanced Filters</Text>
              
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Active Now</Text>
                <TouchableOpacity style={styles.toggleButton}>
                  <Text style={styles.toggleButtonText}>Show All</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.filterRow}>
                <Text style={styles.filterLabel}>Sort By</Text>
                <View style={styles.sortOptions}>
                  <TouchableOpacity style={[styles.sortOption, styles.sortOptionActive]}>
                    <Text style={styles.sortOptionText}>Match</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sortOption}>
                    <Text style={styles.sortOptionText}>Rating</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Peers List */}
        <FlatList
          data={peers}
          renderItem={({ item }) => (
            <PeerCard
              peer={item}
              onPress={handlePeerPress}
              onConnect={handleConnectPress}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.peersList}
          refreshing={isLoading}
          onRefresh={fetchPeers}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No peers found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  subtitle: {
    fontSize: 14,
    color: '#4A5568',
    marginTop: 4,
  },
  requestsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
  },
  requestsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
  },
  filterToggle: {
    paddingVertical: 4,
  },
  filterToggleText: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  filterButtonsContainer: {
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1E3A5F',
  },
  filterText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  advancedFilters: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  advancedFiltersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EDF2F7',
    borderRadius: 16,
  },
  toggleButtonText: {
    fontSize: 12,
    color: '#4A5568',
  },
  sortOptions: {
    flexDirection: 'row',
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EDF2F7',
    borderRadius: 16,
    marginLeft: 8,
  },
  sortOptionActive: {
    backgroundColor: '#1E3A5F',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#4A5568',
  },
  peersList: {
    paddingHorizontal: 24,
    paddingVertical: 16,
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
  },
});
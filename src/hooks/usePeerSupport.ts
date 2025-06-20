import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../config/supabase';
import { PeerMatch } from '../types';

export function usePeerSupport() {
  const { user, userProfile } = useAuth();
  const [peers, setPeers] = useState<PeerMatch[]>([]);
  const [filteredPeers, setFilteredPeers] = useState<PeerMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'support-giver' | 'support-seeker'>('all');
  const [sentRequestsIds, setSentRequestsIds] = useState<string[]>([]);
  const [acceptedConnectionIds, setAcceptedConnectionIds] = useState<string[]>([]);

  // Fetch peers with filters
  const fetchPeers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockPeers: PeerMatch[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          avatar: '👩',
          matchScore: 95,
          supportPreferences: ["Anxiety", "Career Change", "Academic Stress"],
          supportType: 'support-giver',
          location: 'New York',
          isActive: true,
          rating: 4.8,
          totalRatings: 24,
          certifiedMentor: true,
          peopleSupported: 42,
          journeyNote: "Overcame anxiety through mindfulness and career transition. Happy to share my techniques."
        },
        {
          id: '2',
          name: 'Michael Chen',
          avatar: '👨',
          matchScore: 88,
          supportPreferences: ["Depression", "Work-Life Balance", "Stress"],
          supportType: 'support-giver',
          location: 'San Francisco',
          isActive: false,
          rating: 4.6,
          totalRatings: 18,
          certifiedMentor: false,
          peopleSupported: 23,
          journeyNote: "Found balance through therapy and lifestyle changes. Here to listen and support."
        },
        {
          id: '3',
          name: 'Emma Rodriguez',
          avatar: '👩‍🦱',
          matchScore: 82,
          supportPreferences: ["Relationship Issues", "Family Issues", "Mental Health"],
          supportType: 'support-seeker',
          location: 'Los Angeles',
          isActive: true,
          rating: 4.9,
          totalRatings: 31,
          certifiedMentor: true,
          peopleSupported: 56,
          journeyNote: "Navigating family dynamics and relationships. Looking for understanding peers."
        },
      ];
      
      setPeers(mockPeers);
      
      // Apply filters
      let filtered = mockPeers;
      if (filter !== 'all') {
        filtered = mockPeers.filter(peer => peer.supportType === filter);
      }
      
      setFilteredPeers(filtered);
      
      // In a real app, also fetch sent requests and accepted connections
      if (user) {
        fetchSentRequests();
        fetchAcceptedConnections();
      }
    } catch (err: any) {
      console.error('Error fetching peers:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filter, user]);

  // Fetch sent requests
  const fetchSentRequests = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockSentRequestsIds = ['2'];
      setSentRequestsIds(mockSentRequestsIds);
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  // Fetch accepted connections
  const fetchAcceptedConnections = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll use mock data
      const mockAcceptedConnectionIds = ['3'];
      setAcceptedConnectionIds(mockAcceptedConnectionIds);
    } catch (error) {
      console.error('Error fetching accepted connections:', error);
    }
  };

  // Apply filters
  const applyFilter = useCallback((filterType: 'all' | 'support-giver' | 'support-seeker') => {
    setFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredPeers(peers);
    } else {
      setFilteredPeers(peers.filter(peer => peer.supportType === filterType));
    }
  }, [peers]);

  // Send connection request
  const sendConnectionRequest = useCallback(async (peerId: string, message: string, isAnonymous: boolean = false) => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call your API
      console.log('Sending connection request to:', peerId);
      console.log('Message:', message);
      console.log('Anonymous:', isAnonymous);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add to sent requests
      setSentRequestsIds(prev => [...prev, peerId]);
      
      return { success: true };
    } catch (err: any) {
      console.error('Error sending connection request:', err);
      return { success: false, error: err.message || 'Failed to send connection request' };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Auto-fetch peers on mount
  useEffect(() => {
    fetchPeers();
  }, [fetchPeers]);

  return {
    peers: filteredPeers,
    isLoading,
    error,
    userProfile,
    filter,
    sentRequestsIds,
    acceptedConnectionIds,
    applyFilter,
    fetchPeers,
    sendConnectionRequest
  };
}
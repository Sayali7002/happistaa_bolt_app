import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../config/supabase';
import { MindfulnessEntry } from '../types';

const { width } = Dimensions.get('window');

interface MindfulnessScreenProps {
  navigation: any;
}

const mindfulnessTools = [
  {
    id: 'journal',
    title: 'Journal',
    description: 'Write your thoughts and feelings',
    icon: '📝',
    color: '#E6FFFA',
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'Reflect on what you\'re grateful for',
    icon: '❤️',
    color: '#FED7E2',
  },
  {
    id: 'affirmations',
    title: 'Affirmations',
    description: 'Boost your mood with positive affirmations',
    icon: '🌟',
    color: '#E6FFED',
  },
  {
    id: 'focus-timer',
    title: 'Focus Timer',
    description: 'Practice mindful focus and breathing',
    icon: '⏰',
    color: '#FFF5B7',
  },
  {
    id: 'breathe',
    title: 'Quick Breathe',
    description: 'Take a calming breathing break',
    icon: '🌬️',
    color: '#E0F2FE',
  },
  {
    id: 'strengths',
    title: 'Your Strengths',
    description: 'Track and celebrate your strengths',
    icon: '🏆',
    color: '#FED7D3',
  },
];

const meditationTracks = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with a calm and focused mind',
    duration: '10:00',
    category: 'Meditation',
    icon: '🧘‍♀️',
    instructor: 'Dr. Judson Brewer',
  },
  {
    id: '2',
    title: 'Body Scan Relaxation',
    description: 'Progressive relaxation technique for whole-body awareness',
    duration: '15:12',
    category: 'Meditation',
    icon: '👁️',
    instructor: 'Diana Winston',
  },
  {
    id: '3',
    title: 'Stress Relief Breathing',
    description: 'Quick breathing exercises to reduce stress and anxiety',
    duration: '05:30',
    category: 'Breathing',
    icon: '🌬️',
    instructor: 'Diana Winston',
  },
];

export const MindfulnessScreen: React.FC<MindfulnessScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MindfulnessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadEntries();
      loadStreak();
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mindfulness_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading mindfulness entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStreak = async () => {
    if (!user) return;
    
    try {
      // In a real app, this would fetch from your streak API
      // For now, we'll use a mock value
      setStreakCount(3);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const handleToolPress = (toolId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to use this tool');
      return;
    }

    switch (toolId) {
      case 'journal':
        navigation.navigate('Journal');
        break;
      case 'gratitude':
        navigation.navigate('Gratitude');
        break;
      case 'affirmations':
        navigation.navigate('Affirmations');
        break;
      case 'focus-timer':
        navigation.navigate('FocusTimer');
        break;
      case 'breathe':
        navigation.navigate('QuickBreathe');
        break;
      case 'strengths':
        navigation.navigate('Strengths');
        break;
      default:
        break;
    }
  };

  const handleMeditationPress = (trackId: string) => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to access meditations');
      return;
    }

    // In a real app, this would navigate to a meditation player screen
    Alert.alert('Meditation', 'This would play the selected meditation track');
  };

  const filterMeditations = (category: string) => {
    if (category === 'All') {
      return meditationTracks;
    }
    return meditationTracks.filter(track => track.category === category);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Mindfulness Tools</Text>
          {user && (
            <View style={styles.streakContainer}>
              <Text style={styles.streakText}>🔥 {streakCount} days</Text>
            </View>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Mindfulness Tools Grid */}
          <View style={styles.toolsSection}>
            <View style={styles.toolsGrid}>
              {mindfulnessTools.map((tool) => (
                <TouchableOpacity
                  key={tool.id}
                  style={[styles.toolCard, { backgroundColor: tool.color }]}
                  onPress={() => handleToolPress(tool.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.toolIcon}>{tool.icon}</Text>
                  <Text style={styles.toolTitle}>{tool.title}</Text>
                  <Text style={styles.toolDescription}>{tool.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category Filters */}
          <View style={styles.categoriesContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContent}
            >
              {['All', 'Meditation', 'Breathing', 'Movement', 'Sleep', 'Focus'].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Meditation Tracks */}
          <View style={styles.meditationsSection}>
            {filterMeditations(selectedCategory).map((track) => (
              <TouchableOpacity
                key={track.id}
                style={styles.meditationCard}
                onPress={() => handleMeditationPress(track.id)}
                activeOpacity={0.7}
              >
                <View style={styles.meditationHeader}>
                  <Text style={styles.meditationIcon}>{track.icon}</Text>
                  <View style={styles.meditationInfo}>
                    <Text style={styles.meditationTitle}>{track.title}</Text>
                    <Text style={styles.meditationDescription}>{track.description}</Text>
                    <View style={styles.meditationMeta}>
                      <Text style={styles.meditationDuration}>{track.duration}</Text>
                      <Text style={styles.meditationInstructor}>{track.instructor}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.playButtonContainer}>
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>▶</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  streakContainer: {
    backgroundColor: '#FED7D3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D3748',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  toolsSection: {
    marginBottom: 24,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: (width - 64) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toolIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
    textAlign: 'center',
  },
  toolDescription: {
    fontSize: 12,
    color: '#4A5568',
    textAlign: 'center',
  },
  categoriesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesContent: {
    paddingHorizontal: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#1E3A5F',
  },
  categoryText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  meditationsSection: {
    marginBottom: 24,
  },
  meditationCard: {
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
  meditationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  meditationIcon: {
    fontSize: 32,
    marginRight: 12,
    color: '#4A5568',
  },
  meditationInfo: {
    flex: 1,
  },
  meditationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  meditationDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  meditationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meditationDuration: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  meditationInstructor: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  playButtonContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';
import { MindfulnessEntry } from '../../types';

interface JournalScreenProps {
  navigation: any;
}

const moods = ['😊', '😌', '😐', '😔', '😢'];
const moodLabels = ['Happy', 'Content', 'Neutral', 'Sad', 'Very Sad'];

export const JournalScreen: React.FC<JournalScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MindfulnessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');

  useEffect(() => {
    if (user) {
      loadEntries();
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
        .eq('type', 'journal')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      Alert.alert('Error', 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJournal = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to save journal entries');
      return;
    }

    if (!journalText.trim()) {
      Alert.alert('Error', 'Please enter some text for your journal entry');
      return;
    }

    setSaving(true);
    try {
      const newEntry = {
        user_id: user.id,
        type: 'journal',
        content: journalText,
        mood: selectedMood,
        is_private: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('mindfulness_entries')
        .insert(newEntry)
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setEntries([data[0], ...entries]);
        setJournalText('');
        Alert.alert('Success', 'Journal entry saved successfully');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      Alert.alert('Error', 'Failed to save journal entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('mindfulness_entries')
                .delete()
                .eq('id', id)
                .eq('user_id', user?.id);

              if (error) {
                throw error;
              }

              setEntries(entries.filter(entry => entry.id !== id));
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Journal</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* New Entry Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>How are you feeling today?</Text>
            
            <View style={styles.moodSelector}>
              {moods.map((mood, index) => (
                <TouchableOpacity
                  key={mood}
                  style={[
                    styles.moodButton,
                    selectedMood === mood && styles.moodButtonSelected
                  ]}
                  onPress={() => setSelectedMood(mood)}
                >
                  <Text style={styles.moodEmoji}>{mood}</Text>
                  <Text style={styles.moodLabel}>{moodLabels[index]}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.journalInput}
              value={journalText}
              onChangeText={setJournalText}
              placeholder="What's on your mind today?"
              placeholderTextColor="#A0AEC0"
              multiline
              textAlignVertical="top"
            />
            
            <Button
              title="Save Entry"
              onPress={handleSaveJournal}
              loading={saving}
              disabled={!journalText.trim()}
            />
          </View>

          {/* Journal Entries List */}
          <View style={styles.entriesSection}>
            <Text style={styles.entriesTitle}>Your Journal Entries</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading entries...</Text>
              </View>
            ) : entries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't added any journal entries yet.</Text>
                <Text style={styles.emptySubtext}>Start journaling today to track your thoughts and feelings.</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <Text style={styles.entryMood}>{entry.mood}</Text>
                    <Text style={styles.entryDate}>{formatDate(entry.created_at)}</Text>
                  </View>
                  <Text style={styles.entryContent}>{entry.content}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteEntry(entry.id)}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  formCard: {
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
    padding: 20,
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
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  moodButtonSelected: {
    backgroundColor: '#B2F5EA',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: '#4A5568',
  },
  journalInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    height: 150,
    marginBottom: 16,
    fontSize: 16,
    color: '#2D3748',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  entriesSection: {
    marginBottom: 24,
  },
  entriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4A5568',
  },
  emptyContainer: {
    backgroundColor: '#F7FAFC',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryMood: {
    fontSize: 24,
  },
  entryDate: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  entryContent: {
    fontSize: 16,
    color: '#2D3748',
    lineHeight: 24,
  },
  deleteButton: {
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  deleteText: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '600',
  },
});
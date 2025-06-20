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

interface GratitudeScreenProps {
  navigation: any;
}

const gratitudeCategories = [
  { id: 'family', name: 'Family', color: '#FED7E2' },
  { id: 'work', name: 'Work', color: '#C4F1F9' },
  { id: 'nature', name: 'Nature', color: '#C6F6D5' },
  { id: 'health', name: 'Health', color: '#E9D8FD' },
  { id: 'personal', name: 'Personal', color: '#FEEBC8' },
  { id: 'other', name: 'Other', color: '#E2E8F0' },
];

export const GratitudeScreen: React.FC<GratitudeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<MindfulnessEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
        .eq('type', 'gratitude')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading gratitude entries:', error);
      Alert.alert('Error', 'Failed to load gratitude entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGratitude = async () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to save gratitude entries');
      return;
    }

    if (!gratitudeText.trim()) {
      Alert.alert('Error', 'Please enter what you are grateful for');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    setSaving(true);
    try {
      const newEntry = {
        user_id: user.id,
        type: 'gratitude',
        content: gratitudeText,
        category: selectedCategory,
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
        setGratitudeText('');
        setSelectedCategory('');
        Alert.alert('Success', 'Gratitude entry saved successfully');
      }
    } catch (error) {
      console.error('Error saving gratitude entry:', error);
      Alert.alert('Error', 'Failed to save gratitude entry');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this gratitude entry?',
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

  const getCategoryColor = (categoryId: string) => {
    const category = gratitudeCategories.find(c => c.id === categoryId);
    return category ? category.color : '#E2E8F0';
  };

  const getCategoryName = (categoryId: string) => {
    const category = gratitudeCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Gratitude Journal</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* New Entry Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>What are you grateful for today?</Text>
            
            <View style={styles.categorySelector}>
              <Text style={styles.categoryLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContent}
              >
                {gratitudeCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: category.color },
                      selectedCategory === category.id && styles.categoryButtonSelected
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <TextInput
              style={styles.gratitudeInput}
              value={gratitudeText}
              onChangeText={setGratitudeText}
              placeholder="I am grateful for..."
              placeholderTextColor="#A0AEC0"
              multiline
              textAlignVertical="top"
            />
            
            <Button
              title="Save Entry"
              onPress={handleSaveGratitude}
              loading={saving}
              disabled={!gratitudeText.trim() || !selectedCategory}
            />
          </View>

          {/* Gratitude Entries List */}
          <View style={styles.entriesSection}>
            <Text style={styles.entriesTitle}>Your Gratitude Journal</Text>
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading entries...</Text>
              </View>
            ) : entries.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>You haven't added any gratitude entries yet.</Text>
                <Text style={styles.emptySubtext}>Start your gratitude practice today!</Text>
              </View>
            ) : (
              entries.map((entry) => (
                <View key={entry.id} style={styles.entryCard}>
                  <View style={styles.entryHeader}>
                    <View 
                      style={[
                        styles.entryCategoryTag,
                        { backgroundColor: getCategoryColor(entry.category || 'other') }
                      ]}
                    >
                      <Text style={styles.entryCategoryText}>
                        {getCategoryName(entry.category || 'other')}
                      </Text>
                    </View>
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
    backgroundColor: '#FED7E2',
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
  categorySelector: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
  },
  categoriesContent: {
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonSelected: {
    borderWidth: 2,
    borderColor: '#1E3A5F',
  },
  categoryText: {
    fontSize: 14,
    color: '#4A5568',
    fontWeight: '500',
  },
  gratitudeInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    height: 120,
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
  entryCategoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  entryCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A5568',
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
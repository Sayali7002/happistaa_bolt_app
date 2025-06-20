import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

interface SupportPreferencesScreenProps {
  navigation: any;
}

export const SupportPreferencesScreen: React.FC<SupportPreferencesScreenProps> = ({ navigation }) => {
  const [journeyNote, setJourneyNote] = useState('');
  const [supportType, setSupportType] = useState<'support-seeker' | 'support-giver' | null>(null);

  const handleContinue = () => {
    // Store preferences in navigation params or global state
    navigation.navigate('JourneySelection', {
      supportType,
      journeyNote,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Defining Support Preferences</Text>
            <Text style={styles.subtitle}>
              Great! Some of us are looking for support, while others have walked this path before. Which best describes you?
            </Text>

            <View style={styles.supportTypeContainer}>
              <Text style={styles.sectionTitle}>Select your support type</Text>
              <View style={styles.supportTypeButtons}>
                <TouchableOpacity
                  style={[
                    styles.supportTypeButton,
                    supportType === 'support-seeker' && styles.supportTypeButtonSelected
                  ]}
                  onPress={() => setSupportType('support-seeker')}
                >
                  <Text style={[
                    styles.supportTypeText,
                    supportType === 'support-seeker' && styles.supportTypeTextSelected
                  ]}>
                    I need support
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.supportTypeButton,
                    supportType === 'support-giver' && styles.supportTypeButtonSelected
                  ]}
                  onPress={() => setSupportType('support-giver')}
                >
                  <Text style={[
                    styles.supportTypeText,
                    supportType === 'support-giver' && styles.supportTypeTextSelected
                  ]}>
                    I want to provide support
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.journeyNoteContainer}>
              <Text style={styles.sectionTitle}>Share your brief personal journey</Text>
              <Input
                value={journeyNote}
                onChangeText={setJourneyNote}
                placeholder="Briefly describe your experiences or how you've overcome challenges..."
                multiline
                style={styles.journeyInput}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={!supportType}
                size="large"
              />
              <Button
                title="Go Back"
                onPress={() => navigation.goBack()}
                variant="outline"
                size="large"
                style={styles.backButton}
              />
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  supportTypeContainer: {
    backgroundColor: '#FFFFFF',
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 16,
  },
  supportTypeButtons: {
    gap: 12,
  },
  supportTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  supportTypeButtonSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  supportTypeText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
  },
  supportTypeTextSelected: {
    color: '#FFFFFF',
  },
  journeyNoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    gap: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
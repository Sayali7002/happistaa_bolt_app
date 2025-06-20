import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';

const { width } = Dimensions.get('window');

interface JourneySelectionScreenProps {
  navigation: any;
  route: any;
}

const journeyOptions = [
  'Stress', 
  'Anxiety', 
  'Depression', 
  'Relationship Issues',
  'Career Challenges',
  'Academic Pressure',
  'Family Issues',
  'Health & Wellness',
  'Work-Life Balance',
  'Parenthood',
  'Heartbreak',
  'Loneliness',
  'Mental Health'
];

export const JourneySelectionScreen: React.FC<JourneySelectionScreenProps> = ({ navigation, route }) => {
  const [selectedJourneys, setSelectedJourneys] = useState<string[]>([]);
  const { supportType, journeyNote } = route.params || {};

  const toggleJourney = (journey: string) => {
    setSelectedJourneys(prev => {
      if (prev.includes(journey)) {
        return prev.filter(j => j !== journey);
      } else {
        return [...prev, journey];
      }
    });
  };

  const handleContinue = () => {
    navigation.navigate('CommunityGuidelines', {
      supportType,
      journeyNote,
      selectedJourneys,
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
            <Text style={styles.title}>Share Your Journey</Text>
            <Text style={styles.subtitle}>
              Life has its ups and downs. Let us know what experiences you've been through, and we'll help you connect with the right people.
            </Text>

            <View style={styles.journeysGrid}>
              {journeyOptions.map((journey, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.journeyCard,
                    selectedJourneys.includes(journey) && styles.journeyCardSelected
                  ]}
                  onPress={() => toggleJourney(journey)}
                >
                  <Text style={[
                    styles.journeyText,
                    selectedJourneys.includes(journey) && styles.journeyTextSelected
                  ]}>
                    {journey}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedJourneys.length > 0 && (
              <View style={styles.encouragementContainer}>
                <Text style={styles.encouragementText}>
                  You're not alone—many have been here too and found their way forward. Let's find your people.
                </Text>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                title="Continue"
                onPress={handleContinue}
                disabled={selectedJourneys.length === 0}
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
  journeysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  journeyCard: {
    width: (width - 64) / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  journeyCardSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  journeyText: {
    fontSize: 12,
    color: '#4A5568',
    textAlign: 'center',
    fontWeight: '500',
  },
  journeyTextSelected: {
    color: '#FFFFFF',
  },
  encouragementContainer: {
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#81E6D9',
  },
  encouragementText: {
    fontSize: 14,
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
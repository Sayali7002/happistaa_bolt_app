import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';

interface CommunityGuidelinesScreenProps {
  navigation: any;
  route: any;
}

const guidelines = [
  {
    title: "Be Kind and Respectful",
    description: "Treat others with respect and empathy. No harassment, hate speech, or discrimination."
  },
  {
    title: "Maintain Privacy",
    description: "Keep personal information private. Don't share contact details or sensitive information."
  },
  {
    title: "No Medical Advice",
    description: "Share experiences, not medical advice. Always consult professionals for medical decisions."
  },
  {
    title: "Be Supportive",
    description: "Offer support and encouragement. Listen actively and respond with care."
  },
  {
    title: "Report Concerns",
    description: "Report any concerning behavior. We're here to maintain a safe environment."
  }
];

export const CommunityGuidelinesScreen: React.FC<CommunityGuidelinesScreenProps> = ({ navigation, route }) => {
  const { supportType, journeyNote, selectedJourneys } = route.params || {};

  const handleAgree = () => {
    navigation.navigate('ProfileSetup', {
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
            <Text style={styles.title}>Community Guidelines</Text>
            <Text style={styles.subtitle}>
              Help us create a safe and supportive environment
            </Text>

            <View style={styles.guidelinesContainer}>
              {guidelines.map((guideline, index) => (
                <View key={index} style={styles.guidelineCard}>
                  <View style={styles.guidelineHeader}>
                    <View style={styles.guidelineNumber}>
                      <Text style={styles.guidelineNumberText}>{index + 1}</Text>
                    </View>
                    <View style={styles.guidelineContent}>
                      <Text style={styles.guidelineTitle}>{guideline.title}</Text>
                      <Text style={styles.guidelineDescription}>{guideline.description}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="I Agree & Continue"
                onPress={handleAgree}
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
  guidelinesContainer: {
    marginBottom: 40,
  },
  guidelineCard: {
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
  guidelineHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guidelineNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  guidelineNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  guidelineContent: {
    flex: 1,
  },
  guidelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  guidelineDescription: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../config/supabase';

interface ProfileSetupScreenProps {
  navigation: any;
  route: any;
}

const steps = [
  { id: 'name', title: 'Set Your Username', field: 'name', placeholder: 'Enter your name', required: true },
  { id: 'dob', title: 'Date of Birth', field: 'dateOfBirth', placeholder: 'YYYY-MM-DD', required: true },
  { id: 'location', title: 'Location', field: 'location', placeholder: 'Enter your city', required: true },
  { id: 'gender', title: 'Gender', field: 'gender', placeholder: 'Enter your gender', required: true },
];

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { supportType, journeyNote, selectedJourneys } = route.params || {};
  
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    dateOfBirth: '',
    location: '',
    gender: '',
  });
  const [loading, setLoading] = useState(false);

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    const currentValue = profileData[currentStepData.field as keyof typeof profileData];
    
    if (currentStepData.required && !currentValue.trim()) {
      Alert.alert('Required Field', 'Please fill in this field to continue');
      return;
    }

    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    setLoading(true);
    try {
      // Create or update profile in Supabase
      const profilePayload = {
        id: user.id,
        name: profileData.name,
        dob: profileData.dateOfBirth,
        location: profileData.location,
        gender: profileData.gender,
        support_type: supportType,
        journey_note: journeyNote,
        support_preferences: selectedJourneys || [],
        completed_setup: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profilePayload);

      if (error) {
        throw error;
      }

      Alert.alert(
        'Welcome to Happistaa!',
        'Your profile has been saved. We\'re excited to have you join our community.',
        [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.stepText}>
              Step {currentStep + 1} of {steps.length}
            </Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${calculateProgress()}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>{Math.round(calculateProgress())}%</Text>
            </View>

            <View style={styles.formContainer}>
              <Input
                label={currentStepData.title}
                value={profileData[currentStepData.field as keyof typeof profileData]}
                onChangeText={(value) => handleInputChange(currentStepData.field, value)}
                placeholder={currentStepData.placeholder}
                required={currentStepData.required}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title={isLastStep ? 'Complete Setup' : 'Next'}
                onPress={handleNext}
                loading={loading}
                size="large"
              />
              <Button
                title="Back"
                onPress={handleBack}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1E3A5F',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4A5568',
    textAlign: 'right',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContainer: {
    gap: 16,
  },
  backButton: {
    marginTop: 8,
  },
});
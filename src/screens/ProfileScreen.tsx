import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../config/supabase';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { user, signOut, fetchUserProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userProfile = await fetchUserProfile(user.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          dob: profile.dateOfBirth,
          location: profile.location,
          gender: profile.gender,
          workplace: profile.workplace,
          job_title: profile.jobTitle,
          education: profile.education,
          religious_beliefs: profile.religiousBeliefs,
          communication_style: profile.communicationPreferences,
          availability: profile.availability,
          support_type: profile.supportType,
          journey_note: profile.journeyNote,
          support_preferences: profile.supportPreferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              navigation.navigate('Welcome');
            } catch (error) {
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load profile</Text>
            <Button title="Retry" onPress={loadProfile} />
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Completion */}
          <View style={styles.completionCard}>
            <Text style={styles.completionTitle}>Profile Completion</Text>
            <View style={styles.progressBar}>
              <View 
                style={[styles.progressFill, { width: `${profile.profileCompletionPercentage}%` }]} 
              />
            </View>
            <Text style={styles.progressText}>{profile.profileCompletionPercentage}%</Text>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <Input
              label="Full Name"
              value={profile.name}
              onChangeText={(value) => updateProfile('name', value)}
              editable={isEditing}
              required
            />
            <Input
              label="Date of Birth"
              value={profile.dateOfBirth}
              onChangeText={(value) => updateProfile('dateOfBirth', value)}
              editable={isEditing}
              placeholder="YYYY-MM-DD"
              required
            />
            <Input
              label="Location"
              value={profile.location}
              onChangeText={(value) => updateProfile('location', value)}
              editable={isEditing}
              required
            />
            <Input
              label="Gender"
              value={profile.gender}
              onChangeText={(value) => updateProfile('gender', value)}
              editable={isEditing}
              required
            />
          </View>

          {/* Professional Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <Input
              label="Workplace"
              value={profile.workplace}
              onChangeText={(value) => updateProfile('workplace', value)}
              editable={isEditing}
            />
            <Input
              label="Job Title"
              value={profile.jobTitle}
              onChangeText={(value) => updateProfile('jobTitle', value)}
              editable={isEditing}
            />
            <Input
              label="Education"
              value={profile.education}
              onChangeText={(value) => updateProfile('education', value)}
              editable={isEditing}
            />
          </View>

          {/* Journey & Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Journey & Support</Text>
            <Input
              label="Support Type"
              value={profile.supportType === 'support-seeker' ? 'I need support' : 'I want to provide support'}
              editable={false}
            />
            <Input
              label="Your Journey Story"
              value={profile.journeyNote || ''}
              onChangeText={(value) => updateProfile('journeyNote', value)}
              editable={isEditing}
              multiline
              style={styles.textArea}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {isEditing ? (
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={saving}
                size="large"
              />
            ) : (
              <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                size="large"
                style={styles.logoutButton}
              />
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
  editButton: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4A5568',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#E53E3E',
    marginBottom: 16,
  },
  completionCard: {
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
  completionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  logoutButton: {
    borderColor: '#E53E3E',
  },
});
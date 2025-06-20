import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Auth & Onboarding Screens
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { SupportPreferencesScreen } from '../screens/onboarding/SupportPreferencesScreen';
import { JourneySelectionScreen } from '../screens/onboarding/JourneySelectionScreen';
import { CommunityGuidelinesScreen } from '../screens/onboarding/CommunityGuidelinesScreen';
import { ProfileSetupScreen } from '../screens/ProfileSetupScreen';

// Main App Screens
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AICompanionScreen } from '../screens/AICompanionScreen';
import { PeerSupportScreen } from '../screens/PeerSupportScreen';
import { PeerDetailScreen } from '../screens/PeerDetailScreen';
import { ChatScreen } from '../screens/peer-support/ChatScreen';
import { RequestsScreen } from '../screens/peer-support/RequestsScreen';
import { MindfulnessScreen } from '../screens/MindfulnessScreen';

// Mindfulness Tool Screens
import { JournalScreen } from '../screens/mindfulness/JournalScreen';
import { GratitudeScreen } from '../screens/mindfulness/GratitudeScreen';
import { AffirmationsScreen } from '../screens/mindfulness/AffirmationsScreen';
import { FocusTimerScreen } from '../screens/mindfulness/FocusTimerScreen';
import { QuickBreatheScreen } from '../screens/mindfulness/QuickBreatheScreen';
import { StrengthsScreen } from '../screens/mindfulness/StrengthsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AICompanion') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'PeerSupport') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Mindfulness') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1E3A5F',
        tabBarInactiveTintColor: '#A0AEC0',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="AICompanion" component={AICompanionScreen} options={{ title: 'AI Companion' }} />
      <Tab.Screen name="PeerSupport" component={PeerSupportScreen} options={{ title: 'Peer Support' }} />
      <Tab.Screen name="Mindfulness" component={MindfulnessScreen} options={{ title: 'Mindfulness' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    // You can add a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          // Check if user has completed profile setup
          userProfile?.completedSetup ? (
            // Authenticated screens
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="PeerDetail" component={PeerDetailScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Requests" component={RequestsScreen} />
              <Stack.Screen name="Journal" component={JournalScreen} />
              <Stack.Screen name="Gratitude" component={GratitudeScreen} />
              <Stack.Screen name="Affirmations" component={AffirmationsScreen} />
              <Stack.Screen name="FocusTimer" component={FocusTimerScreen} />
              <Stack.Screen name="QuickBreathe" component={QuickBreatheScreen} />
              <Stack.Screen name="Strengths" component={StrengthsScreen} />
            </>
          ) : (
            // Profile setup screens
            <>
              <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
              <Stack.Screen name="SupportPreferences" component={SupportPreferencesScreen} />
              <Stack.Screen name="JourneySelection" component={JourneySelectionScreen} />
              <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} />
            </>
          )
        ) : (
          // Unauthenticated screens
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="SupportPreferences" component={SupportPreferencesScreen} />
            <Stack.Screen name="JourneySelection" component={JourneySelectionScreen} />
            <Stack.Screen name="CommunityGuidelines" component={CommunityGuidelinesScreen} />
            <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
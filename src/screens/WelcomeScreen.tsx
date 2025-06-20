import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components/common/Button';

const { width } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

const keyFeatures = [
  { icon: '👥', title: 'Find a Friend', description: 'Match with someone who understands your journey.' },
  { icon: '💬', title: 'Talk & Share', description: 'Chat, call, or discuss with peers who\'ve been there.' },
  { icon: '🎓', title: 'Verified Support', description: 'Connect with people who are certified to guide you.' },
  { icon: '🌱', title: 'Grow Together', description: 'Learn coping strategies and support others.' },
];

const dataPoints = [
  { number: "10K+", label: "Happy Users" },
  { number: "98%", label: "Satisfaction Rate" },
  { number: "24/7", label: "Support Available" },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('SupportPreferences');
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🤝</Text>
              <Text style={styles.logoText}>Happistaa</Text>
            </View>

            {/* Main Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>A Friend in Need!</Text>
              <Text style={styles.subtitle}>
                Find the support you need, instantly. Connect with peers who've been through similar experiences.
              </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              {keyFeatures.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                </View>
              ))}
            </View>

            {/* Data Points */}
            <View style={styles.dataPointsContainer}>
              {dataPoints.map((point, index) => (
                <View key={index} style={styles.dataPoint}>
                  <Text style={styles.dataNumber}>{point.number}</Text>
                  <Text style={styles.dataLabel}>{point.label}</Text>
                </View>
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Get Started"
                onPress={handleGetStarted}
                size="large"
                style={styles.primaryButton}
              />
              <Button
                title="I already have an account"
                onPress={handleSignIn}
                variant="outline"
                size="large"
                style={styles.secondaryButton}
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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoEmoji: {
    fontSize: 32,
    marginRight: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    paddingHorizontal: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  featureCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
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
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
  },
  dataPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
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
  dataPoint: {
    alignItems: 'center',
  },
  dataNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  dataLabel: {
    fontSize: 12,
    color: '#4A5568',
    marginTop: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
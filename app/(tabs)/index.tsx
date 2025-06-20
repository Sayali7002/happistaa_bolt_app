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
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const features = [
  {
    id: 'ai-companion',
    title: 'AI Companion',
    description: 'Get instant support and guidance',
    icon: '🤖',
    color: '#F6D2C6',
  },
  {
    id: 'peer-support',
    title: 'Peer Support',
    description: 'Connect with others who understand',
    icon: '👥',
    color: '#C4D9F8',
    highlight: true,
  },
  {
    id: 'therapy',
    title: 'Professional Therapy',
    description: 'Get guidance from licensed therapists',
    icon: '🏥',
    color: '#F6D2C6',
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Tools',
    description: 'Access meditation and stress relief',
    icon: '🧘‍♀️',
    color: '#F6D2C6',
  },
];

const inspirationalQuotes = [
  {
    quote: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman"
  },
  {
    quote: "Mental health problems don't define who you are. They are something you experience.",
    author: "Sangu Delle"
  },
  {
    quote: "There is hope, even when your brain tells you there isn't.",
    author: "John Green"
  },
  {
    quote: "The strongest people are those who win battles we know nothing about.",
    author: "Happistaa"
  },
  {
    quote: "You are not alone in this journey. Every step you take is a step towards healing.",
    author: "Happistaa"
  }
];

export default function DashboardScreen() {
  const [quote, setQuote] = useState(inspirationalQuotes[0]);
  const [streaks, setStreaks] = useState({
    mindfulness: 3,
    peerSupport: 1,
    aiCompanion: 5
  });
  const [overallStreak, setOverallStreak] = useState(7);
  const [breathingSize, setBreathingSize] = useState(60);
  const [breathingState, setBreathingState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingActive, setBreathingActive] = useState(false);

  useEffect(() => {
    setQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
  }, []);

  useEffect(() => {
    if (!breathingActive) return;
    
    let breathingInterval: NodeJS.Timeout;
    let phase = 'inhale';
    let counter = 0;
    
    breathingInterval = setInterval(() => {
      counter++;
      
      if (phase === 'inhale' && counter <= 4) {
        setBreathingSize(prev => Math.min(prev + 10, 120));
      } else if (phase === 'inhale' && counter > 4) {
        phase = 'hold';
        counter = 0;
        setBreathingState('hold');
      } else if (phase === 'hold' && counter <= 3) {
        // Hold for 3 seconds
      } else if (phase === 'hold' && counter > 3) {
        phase = 'exhale';
        counter = 0;
        setBreathingState('exhale');
      } else if (phase === 'exhale' && counter <= 4) {
        setBreathingSize(prev => Math.max(prev - 10, 60));
      } else if (phase === 'exhale' && counter > 4) {
        phase = 'inhale';
        counter = 0;
        setBreathingState('inhale');
      }
    }, 1000);
    
    return () => {
      clearInterval(breathingInterval);
    };
  }, [breathingActive]);

  const toggleBreathingExercise = () => {
    setBreathingActive(!breathingActive);
    if (!breathingActive) {
      setBreathingState('inhale');
    }
  };

  const handleFeatureClick = (featureId: string) => {
    switch (featureId) {
      case 'ai-companion':
        router.push('/ai-companion');
        break;
      case 'peer-support':
        router.push('/peer-support');
        break;
      case 'therapy':
        Alert.alert('Coming Soon', 'Professional therapy features will be available in the next update.');
        break;
      case 'mindfulness':
        router.push('/mindfulness');
        break;
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F4F8', '#DEF5FA']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.appTitle}>Happistaa</Text>
              <Text style={styles.welcomeText}>Welcome back</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.gridContainer}>
            {/* Progress Card */}
            <View style={styles.progressCard}>
              <Text style={styles.cardTitle}>People Supported</Text>
              <View style={styles.progressCircleContainer}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressNumber}>5</Text>
                </View>
              </View>
            </View>

            {/* Quick Breathing Exercise Card */}
            <View style={styles.breathingCard}>
              <Text style={styles.cardTitle}>Breathe</Text>
              <TouchableOpacity 
                style={[
                  styles.breathingCircle,
                  { width: breathingSize, height: breathingSize }
                ]}
                onPress={toggleBreathingExercise}
              >
                <Text style={styles.breathingText}>
                  {breathingActive ? breathingState : 'Start'}
                </Text>
                <Text style={styles.breathingIcon}>🧘‍♀️</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Support options - 2x2 grid */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>Support options</Text>
            <View style={styles.featuresGrid}>
              {features.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[
                    styles.featureCard,
                    { backgroundColor: feature.color },
                    feature.highlight && styles.highlightedFeature
                  ]}
                  onPress={() => handleFeatureClick(feature.id)}
                  activeOpacity={0.7}
                >
                  {feature.highlight && <View style={styles.highlightTriangle} />}
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Inspirational quote */}
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote.quote}"</Text>
            <Text style={styles.quoteAuthor}>— {quote.author}</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  welcomeText: {
    fontSize: 18,
    color: '#4A5568',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressCard: {
    width: (width - 56) / 2,
    backgroundColor: '#F6D2C6',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 12,
  },
  progressCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  breathingCard: {
    width: (width - 56) / 2,
    backgroundColor: '#F6D2C6',
    borderRadius: 16,
    padding: 16,
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
  breathingCircle: {
    backgroundColor: '#1E3A5F',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  breathingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  breathingIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  featuresSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 56) / 2,
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
    position: 'relative',
    overflow: 'hidden',
  },
  highlightedFeature: {
    borderWidth: 2,
    borderColor: '#1E3A5F',
  },
  highlightTriangle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 30,
    borderTopWidth: 30,
    borderRightColor: 'transparent',
    borderTopColor: '#1E3A5F',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    color: '#4A5568',
    lineHeight: 16,
  },
  quoteContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#4A5568',
  },
});
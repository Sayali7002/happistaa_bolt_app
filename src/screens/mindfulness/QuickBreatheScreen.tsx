import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

interface QuickBreatheScreenProps {
  navigation: any;
}

// Breathing patterns (in seconds)
const BREATHING_PATTERNS = {
  inhale: 4,
  hold: 4,
  exhale: 4,
  pause: 2,
};

// Duration options in minutes
const DURATION_OPTIONS = [1, 2, 5, 10];

export const QuickBreatheScreen: React.FC<QuickBreatheScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [duration, setDuration] = useState(2); // Default 2 minutes
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(BREATHING_PATTERNS.inhale);
  const [breathCount, setBreathCount] = useState(0);
  
  // Refs for intervals
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Animation values
  const circleSize = useRef(new Animated.Value(100)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  
  // Set up the timer when duration changes
  useEffect(() => {
    setTimeLeft(duration * 60);
  }, [duration]);
  
  // Handle breathing phases
  useEffect(() => {
    if (!isActive) return;
    
    // Clear any existing phase interval
    if (phaseIntervalRef.current) {
      clearInterval(phaseIntervalRef.current);
    }
    
    // Set up phase interval
    setPhaseTimeLeft(BREATHING_PATTERNS[breathingPhase]);
    
    // Animate circle based on breathing phase
    if (breathingPhase === 'inhale') {
      Animated.timing(circleSize, {
        toValue: 200,
        duration: BREATHING_PATTERNS.inhale * 1000,
        useNativeDriver: false,
      }).start();
    } else if (breathingPhase === 'exhale') {
      Animated.timing(circleSize, {
        toValue: 100,
        duration: BREATHING_PATTERNS.exhale * 1000,
        useNativeDriver: false,
      }).start();
    }
    
    phaseIntervalRef.current = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          // Move to next phase
          switch (breathingPhase) {
            case 'inhale':
              setBreathingPhase('hold');
              return BREATHING_PATTERNS.hold;
            case 'hold':
              setBreathingPhase('exhale');
              return BREATHING_PATTERNS.exhale;
            case 'exhale':
              setBreathingPhase('pause');
              return BREATHING_PATTERNS.pause;
            case 'pause':
              setBreathingPhase('inhale');
              setBreathCount((prev) => prev + 1);
              return BREATHING_PATTERNS.inhale;
            default:
              return BREATHING_PATTERNS.inhale;
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (phaseIntervalRef.current) {
        clearInterval(phaseIntervalRef.current);
      }
    };
  }, [isActive, breathingPhase, circleSize]);
  
  // Handle main timer
  useEffect(() => {
    if (!isActive) return;
    
    // Clear any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Set up timer interval
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isActive]);
  
  // Handle start/stop
  const handleToggleActive = () => {
    if (isActive) {
      setIsActive(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      Animated.timing(circleSize, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setIsActive(true);
      setBreathingPhase('inhale');
      setPhaseTimeLeft(BREATHING_PATTERNS.inhale);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setBreathingPhase('inhale');
    setPhaseTimeLeft(BREATHING_PATTERNS.inhale);
    setBreathCount(0);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    Animated.timing(circleSize, {
      toValue: 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  // Handle completion
  const handleComplete = () => {
    setIsActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
    
    // Record completion in a real app
    if (user) {
      Alert.alert('Session Complete', `Great job! You completed ${breathCount} breaths.`);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get emoji based on breathing phase
  const getEmoji = () => {
    switch (breathingPhase) {
      case 'inhale':
        return '😌';
      case 'hold':
        return '😊';
      case 'exhale':
        return '😌';
      case 'pause':
        return '😌';
      default:
        return '😌';
    }
  };
  
  // Get instruction text based on breathing phase
  const getInstructionText = () => {
    switch (breathingPhase) {
      case 'inhale':
        return 'Inhale';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Exhale';
      case 'pause':
        return 'Pause';
      default:
        return '';
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F0F4F8', '#DEF5FA']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Quick Breathe</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Duration selector */}
          {!isActive && (
            <View style={styles.durationSelector}>
              <Text style={styles.durationTitle}>Select Duration</Text>
              <View style={styles.durationButtons}>
                {DURATION_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.durationButton,
                      duration === option && styles.durationButtonActive
                    ]}
                    onPress={() => setDuration(option)}
                  >
                    <Text style={[
                      styles.durationText,
                      duration === option && styles.durationTextActive
                    ]}>
                      {option} min
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Breathing visualization */}
          <View style={styles.breathingContainer}>
            <Animated.View
              style={[
                styles.breathingCircle,
                {
                  width: circleSize,
                  height: circleSize,
                  borderRadius: Animated.divide(circleSize, 2),
                }
              ]}
            >
              {isActive ? (
                <>
                  <Text style={styles.breathingEmoji}>{getEmoji()}</Text>
                  <Text style={styles.instructionText}>{getInstructionText()}</Text>
                  <Text style={styles.phaseTimeText}>{phaseTimeLeft}s</Text>
                </>
              ) : timeLeft === 0 ? (
                <>
                  <Text style={styles.completionEmoji}>🎉</Text>
                  <Text style={styles.completionText}>Great job!</Text>
                  <Text style={styles.breathCountText}>{breathCount} breaths</Text>
                </>
              ) : (
                <>
                  <Text style={styles.startEmoji}>🧘‍♀️</Text>
                  <Text style={styles.startText}>Ready?</Text>
                </>
              )}
            </Animated.View>
          </View>

          {/* Timer display */}
          <View style={styles.timerDisplay}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.timerLabel}>
              {isActive ? `${breathCount} breaths completed` : 'Time remaining'}
            </Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <Button
              title={isActive ? 'Pause' : timeLeft < duration * 60 ? 'Resume' : 'Start'}
              onPress={handleToggleActive}
              variant={isActive ? 'secondary' : 'primary'}
              size="large"
              style={styles.actionButton}
              disabled={timeLeft === 0}
            />
            
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              size="large"
              style={styles.resetButton}
              disabled={timeLeft === duration * 60 && !isActive && breathCount === 0}
            />
          </View>

          {/* Tips */}
          {!isActive && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>Breathing Tips:</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipText}>• Find a comfortable seated position</Text>
                <Text style={styles.tipText}>• Breathe in deeply through your nose</Text>
                <Text style={styles.tipText}>• Hold your breath comfortably</Text>
                <Text style={styles.tipText}>• Exhale slowly through your mouth</Text>
                <Text style={styles.tipText}>• Focus on the sensation of breathing</Text>
              </View>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  durationSelector: {
    marginBottom: 24,
  },
  durationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  durationButtonActive: {
    backgroundColor: '#1E3A5F',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  durationTextActive: {
    color: '#FFFFFF',
  },
  breathingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  breathingCircle: {
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breathingEmoji: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  phaseTimeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  completionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  breathCountText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  startEmoji: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  startText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 14,
    color: '#4A5568',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
  resetButton: {
    flex: 1,
  },
  tipsContainer: {
    backgroundColor: '#E6FFFA',
    borderRadius: 16,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C7A7B',
    marginBottom: 8,
  },
  tipsList: {
    gap: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#4A5568',
    lineHeight: 20,
  },
});
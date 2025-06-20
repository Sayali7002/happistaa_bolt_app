import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../config/supabase';

interface FocusTimerScreenProps {
  navigation: any;
}

const presets = [5, 15, 25, 45, 60];

export const FocusTimerScreen: React.FC<FocusTimerScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [duration, setDuration] = useState(25 * 60); // Default 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Set up the timer
  useEffect(() => {
    setTimeLeft(duration);
    setProgress(100);
  }, [duration]);

  // Handle timer logic
  useEffect(() => {
    if (isRunning && !isPaused) {
      // Record the start time when timer begins
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now() - pausedTimeRef.current;
      }
      
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up a new interval that checks actual elapsed time
      intervalRef.current = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const newTimeLeft = Math.max(0, duration - elapsedSeconds);
        
        setTimeLeft(newTimeLeft);
        setProgress((newTimeLeft / duration) * 100);
        
        // Handle timer completion
        if (newTimeLeft === 0) {
          handleTimerComplete();
        }
      }, 1000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, isPaused, duration]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle timer actions
  const handleStart = () => {
    if (isPaused) {
      // If resuming from pause, adjust the start time
      pausedTimeRef.current += Date.now() - (startTimeRef.current || Date.now());
      setIsPaused(false);
    } else {
      // Fresh start
      startTimeRef.current = null;
      pausedTimeRef.current = 0;
      setIsRunning(true);
    }
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(duration);
    setProgress(100);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setIsPaused(false);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
    
    // Update streak in a real app
    Alert.alert('Focus Session Complete', 'Great job! You\'ve completed your focus session.');
    
    // Record completion in Supabase
    if (user) {
      recordCompletion();
    }
  };

  const recordCompletion = async () => {
    try {
      // In a real app, this would update a streak counter or create a record
      console.log('Focus session completed by user:', user?.id);
    } catch (error) {
      console.error('Error recording completion:', error);
    }
  };

  // Set timer duration from preset
  const handlePresetClick = (minutes: number) => {
    if (!isRunning || window.confirm('Reset the current timer?')) {
      handleReset();
      setDuration(minutes * 60);
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
          <Text style={styles.title}>Focus Timer</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          {/* Circular progress indicator */}
          <View style={styles.timerContainer}>
            <View style={styles.progressCircle}>
              <View style={styles.progressBackground} />
              <View 
                style={[
                  styles.progressFill,
                  { 
                    transform: [
                      { rotate: `${(100 - progress) * 3.6}deg` }
                    ] 
                  }
                ]}
              />
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
              </View>
            </View>
          </View>

          {/* Timer controls */}
          <View style={styles.controlsContainer}>
            {!isRunning ? (
              <Button
                title="Start"
                onPress={handleStart}
                size="large"
                style={styles.startButton}
              />
            ) : (
              <>
                {isPaused ? (
                  <Button
                    title="Resume"
                    onPress={handleStart}
                    variant="secondary"
                    size="large"
                    style={styles.resumeButton}
                  />
                ) : (
                  <Button
                    title="Pause"
                    onPress={handlePause}
                    variant="secondary"
                    size="large"
                    style={styles.pauseButton}
                  />
                )}
              </>
            )}
            
            <Button
              title="Reset"
              onPress={handleReset}
              variant="outline"
              size="large"
              style={styles.resetButton}
            />
          </View>

          {/* Quick duration presets */}
          <View style={styles.presetsContainer}>
            <Text style={styles.presetsTitle}>Quick Presets</Text>
            <View style={styles.presetButtons}>
              {presets.map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  style={[
                    styles.presetButton,
                    duration === minutes * 60 && styles.presetButtonActive
                  ]}
                  onPress={() => handlePresetClick(minutes)}
                >
                  <Text style={[
                    styles.presetText,
                    duration === minutes * 60 && styles.presetTextActive
                  ]}>
                    {minutes} min
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Focus Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Focus Tips:</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipText}>• Remove distractions from your environment</Text>
              <Text style={styles.tipText}>• Set a clear goal for your focus session</Text>
              <Text style={styles.tipText}>• Take a 5-minute break after each session</Text>
              <Text style={styles.tipText}>• Stay hydrated during your work</Text>
            </View>
          </View>
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
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 40,
  },
  progressCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 10,
    borderColor: '#E2E8F0',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 125,
    borderWidth: 10,
    borderColor: '#1E3A5F',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  timeContainer: {
    backgroundColor: '#FFFFFF',
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
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
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 32,
    gap: 16,
  },
  startButton: {
    flex: 1,
    maxWidth: 150,
  },
  resumeButton: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: '#48BB78',
  },
  pauseButton: {
    flex: 1,
    maxWidth: 150,
    backgroundColor: '#ECC94B',
  },
  resetButton: {
    flex: 1,
    maxWidth: 150,
  },
  presetsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  presetsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 12,
  },
  presetButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  presetButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetButtonActive: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  presetText: {
    fontSize: 14,
    color: '#4A5568',
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: '#EBF8FF',
    borderRadius: 16,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2B6CB0',
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
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av'; // Import Audio from expo-av

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.8, 280);
const BUTTON_SIZE = 64;

// Theme color schemes
const LightTheme = {
  background: '#ffffff',
  cardBackground: '#f9fafb',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  accent: '#6366F1',
  accentGradientStart: '#8B5CF6',
  accentGradientEnd: '#6366F1',
  disabled: '#E5E7EB',
  disabledText: '#9CA3AF',
  controlBackground: '#6B7280',
  success: '#10B981',
  circleBackground: '#E5E7EB',
};

// Force component to re-render on theme changes
const useForceUpdate = () => {
  const [, setValue] = useState(0);
  return () => setValue(value => value + 1);
}

const SleepTimer = () => {
  const forceUpdate = useForceUpdate();
  const router = useRouter();
  const [totalTime, setTotalTime] = useState(30 * 60); // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false); // Track alarm state
  const theme = LightTheme;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const soundRef = useRef<Audio.Sound | null>(null); // Reference for the alarm sound

  const radius = CIRCLE_SIZE / 2 - 16; // Adjust radius to fit the screen
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Load alarm sound
  const loadAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/alarm.mp3') // Path to your alarm sound file
      );
      sound.setIsLoopingAsync(true); // Enable looping
      soundRef.current = sound;
    } catch (error) {
      console.error('Error loading alarm sound:', error);
    }
  };

  // Play alarm sound
  const playAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsAlarmPlaying(true); // Set alarm state to playing
    }
  };

  // Stop alarm sound
  const stopAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      setIsAlarmPlaying(false); // Set alarm state to stopped
    }
  };

  // Unload alarm sound
  const unloadAlarmSound = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  useEffect(() => {
    loadAlarmSound();

    return () => {
      unloadAlarmSound();
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            playAlarmSound(); // Play alarm sound when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false
    }).start();

    if (isFinished) {
      const pulseAnimation = Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 105,
          duration: 300,
          useNativeDriver: false
        }),
        Animated.timing(animatedValue, {
          toValue: 100,
          duration: 300,
          useNativeDriver: false
        })
      ]);

      Animated.loop(pulseAnimation, { iterations: 3 }).start();
    }
  }, [progress, isFinished]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const adjustTime = (minutes: number) => {
    if (!isRunning) {
      const newTime = Math.max(60, totalTime + minutes * 60);
      setTotalTime(newTime);
      setTimeLeft(newTime);
      setIsFinished(false);
    }
  };

  const toggleTimer = () => {
    if (isFinished || timeLeft === 0) {
      resetTimer();
    } else {
      setIsRunning(!isRunning);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(totalTime);
    setIsFinished(false);
    stopAlarmSound(); // Stop alarm sound if playing
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="nights-stay" size={32} color={theme.accent} />
          <Text style={[styles.title, { color: theme.primaryText }]}>Sleep Timer</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Sweet dreams await</Text>
        </View>

        {/* Progress Circle */}
        <View style={styles.circleWrapper}>
          <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE} style={styles.svg}>
            <Defs>
              <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor={theme.accentGradientStart} />
                <Stop offset="100%" stopColor={theme.accentGradientEnd} />
              </LinearGradient>
            </Defs>
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={radius}
              stroke={theme.circleBackground}
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={radius}
              stroke="url(#timerGradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90, ${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2})`}
            />
          </Svg>

          <View style={styles.timeDisplay}>
            <Text style={[styles.timeText, { color: theme.primaryText }]}>{formatTime(timeLeft)}</Text>
            <Text style={[styles.statusText, { color: theme.secondaryText }]}>
              {isFinished ? "Time's up!" : isRunning ? 'Running...' : 'Ready'}
            </Text>
          </View>
        </View>

        {/* Time Adjustment */}
        {!isRunning && !isAlarmPlaying && (
          <View style={styles.adjustmentContainer}>
            <TouchableOpacity 
              onPress={() => adjustTime(-5)} 
              style={[styles.minusButton, { backgroundColor: theme.accent }]
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="remove" size={24} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.totalTimeText}>
              <Text style={[styles.totalLabel, { color: theme.secondaryText }]}>Total</Text>
              <Text style={[styles.totalValue, { color: theme.primaryText }]}>{Math.floor(totalTime / 60)}m</Text>
            </View>
            
            <TouchableOpacity 
              onPress={() => adjustTime(5)} 
              style={[styles.plusButton, { backgroundColor: theme.accent }]
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlsContainer}>
          {!isAlarmPlaying && (
            <>
              <TouchableOpacity 
                onPress={resetTimer} 
                disabled={timeLeft === totalTime && !isRunning}
                style={[
                  styles.resetButton, 
                  (timeLeft === totalTime && !isRunning) ? 
                    { backgroundColor: theme.disabled } : 
                    { backgroundColor: theme.controlBackground }
                ]}
              >
                <Icon 
                  name="replay" 
                  size={24} 
                  color={(timeLeft === totalTime && !isRunning) ? theme.disabledText : "#fff"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={toggleTimer} 
                style={[
                  styles.playButton, 
                  { 
                    backgroundColor: isRunning ? 
                      theme.accentGradientStart : 
                      theme.accent,
                    shadowColor: theme.accent 
                  }
                ]}
              >
                {isRunning ? (
                  <Icon name="pause" size={36} color="#fff" />
                ) : (
                  <Icon name="play-arrow" size={36} color="#fff" />
                )}
              </TouchableOpacity>
            </>
          )}

          {/* Stop Alarm Button */}
          {isAlarmPlaying && (
            <TouchableOpacity 
              onPress={stopAlarmSound} 
              style={[styles.stopButton, { backgroundColor: theme.success }]
              }
            >
              <Text style={styles.stopButtonText}>Stop Alarm</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Message */}
        {isFinished && !isAlarmPlaying && (
          <View style={[styles.statusMessage, { backgroundColor: theme.success }]}>
            <Text style={styles.statusMessageText}>🌙 Sleep well!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#1F2937',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 4,
    textAlign: 'center',
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  timeDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  timeText: {
    color: '#1F2937',
    fontSize: 44,
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
  },
  statusText: {
    color: '#6B7280',
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  adjustmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 220,
    marginBottom: 40,
  },
  minusButton: {
    backgroundColor: '#6366F1',
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    backgroundColor: '#6366F1',
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalTimeText: {
    width: 80,
    alignItems: 'center',
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 14,
    textAlign: 'center',
  },
  totalValue: {
    color: '#1F2937',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: '#6B7280',
    borderRadius: 999,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 32,
  },
  disabledButton: {
    backgroundColor: '#E5E7EB',
  },
  playButton: {
    backgroundColor: '#6366F1',
    borderRadius: 999,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  pauseButton: {
    backgroundColor: '#8B5CF6',
  },
  statusMessage: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  statusMessageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  stopButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SleepTimer;
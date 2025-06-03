import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  SafeAreaView,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons'; // Use FontAwesome icons from expo/vector-icons

const { width, height } = Dimensions.get('window');

type Mode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessions, setSessions] = useState(0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const modes: Record<Mode, { time: number; color: [string, string]; label: string }> = {
    work: { time: 25, color: ['#FF6B6B', '#FF8E8E'], label: 'Focus Time' },
    shortBreak: { time: 5, color: ['#4ECDC4', '#44A08D'], label: 'Short Break' },
    longBreak: { time: 15, color: ['#45B7D1', '#96C93D'], label: 'Long Break' },
  };

  const totalTime = modes[mode].time * 60;
  const currentTime = minutes * 60 + seconds;
  const progress = 1 - currentTime / totalTime;

  useEffect(() => {
    let interval: number | undefined;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) return prevSeconds - 1;
          setMinutes((prevMinutes) => (prevMinutes > 0 ? prevMinutes - 1 : 0));
          return 59;
        });
      }, 1000) as unknown as number;
    } else if (minutes === 0 && seconds === 0) {
      handleTimerComplete();
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isActive, minutes, seconds]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const handleTimerComplete = () => {
    setIsActive(false);
    Vibration.vibrate([500, 200, 500]);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (mode === 'work') {
      setSessions(sessions + 1);
      const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      switchMode(nextMode);
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode: Mode) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setMode(newMode);
      setMinutes(modes[newMode].time);
      setSeconds(0);
      setIsActive(false);
      progressAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  const toggleTimer = () => {
    setIsActive(!isActive);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(modes[mode].time);
    setSeconds(0);
    progressAnim.setValue(0);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = 120;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={{ position: 'relative', width: 240, height: 240 }}>
        {/* Circular Progress */}
        <Svg width={240} height={240}>
          <Circle
            cx={120}
            cy={120}
            r={radius}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx={120}
            cy={120}
            r={radius}
            stroke="white"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>

        {/* Tomato Icon */}
        <FontAwesome
          name="hourglass-half" // Replace with any desired icon
          size={100}
          color="white"
          style={{
            position: 'absolute',
            top: 70,
            left: 70,
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={modes[mode].color}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Text style={styles.modeLabel}>{modes[mode].label}</Text>
            <Text style={styles.sessionCount}>Session {sessions + 1}</Text>
          </View>

          <Animated.View style={[styles.timerContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.circleContainer}>
              <CircularProgress progress={progress} />
              <View style={styles.timerDisplay}>
                <Text style={styles.timerText}>{formatTime(minutes, seconds)}</Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.controls}>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={resetTimer}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={toggleTimer}>
              <Text style={styles.primaryButtonText}>{isActive ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => switchMode(mode === 'work' ? 'shortBreak' : 'work')}
            >
              <Text style={styles.secondaryButtonText}>Skip</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  modeLabel: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  sessionCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerDisplay: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'monospace',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    minWidth: 80,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 35,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default PomodoroTimer;
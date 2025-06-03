import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons'; // You can use Lucide if you want

const SleepTimer = () => {
  const [totalTime, setTotalTime] = useState(30 * 60); // 30 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(totalTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const radius = 120;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
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
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={styles.container}>
      {/* Background */}
      <View style={styles.backgroundStars} />

      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Icon name="nights-stay" size={24} color="#ccc" />
          <Text style={styles.title}>Sleep Timer</Text>
          <Text style={styles.subtitle}>Sweet dreams await</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Svg height="256" width="256">
            <Circle
              cx="128"
              cy="128"
              r={radius}
              stroke="#ffffff20"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx="128"
              cy="128"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </Svg>

          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
            <Text style={styles.statusText}>
              {isFinished ? "Time's up!" : isRunning ? 'Running...' : 'Ready'}
            </Text>
          </View>
        </View>

        {/* Time Adjustment */}
        {!isRunning && (
          <View style={styles.adjustmentButtons}>
            <TouchableOpacity onPress={() => adjustTime(-5)} style={styles.minusButton}>
              <Icon name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <View style={styles.totalTimeText}>
              <Text style={{ color: '#aaa', fontSize: 12 }}>Total</Text>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {Math.floor(totalTime / 60)}m
              </Text>
            </View>
            <TouchableOpacity onPress={() => adjustTime(5)} style={styles.plusButton}>
              <Icon name="add" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controlButtons}>
          <TouchableOpacity onPress={resetTimer} disabled={timeLeft === totalTime && !isRunning}>
            <Icon name="replay" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTimer} style={styles.playButton}>
            {isRunning ? (
              <Icon name="pause" size={32} color="#fff" />
            ) : (
              <Icon name="play-arrow" size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* Status Message */}
        {isFinished && (
          <View style={styles.statusMessage}>
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>🌙 Sleep well!</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default SleepTimer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Dark blue background for a calming effect
    justifyContent: 'center',
    padding: 20,
  },
  backgroundStars: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    backgroundColor: 'linear-gradient(to bottom, #1E293B, #0F172A)', // Subtle gradient for depth
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Transparent card background
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#E5E7EB', // Light gray for the title
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#9CA3AF', // Softer gray for the subtitle
    fontSize: 14,
  },
  progressContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  timeDisplay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -40 }, { translateY: -20 }],
    alignItems: 'center',
  },
  timeText: {
    color: '#F9FAFB', // White for the timer text
    fontSize: 32,
    fontWeight: 'bold',
  },
  statusText: {
    color: '#9CA3AF', // Softer gray for the status text
    fontSize: 14,
  },
  adjustmentButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  minusButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle button background
    borderRadius: 999,
    padding: 10,
  },
  plusButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle button background
    borderRadius: 999,
    padding: 10,
  },
  totalTimeText: {
    minWidth: 100,
    alignItems: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  playButton: {
    backgroundColor: '#4F46E5', // Indigo for the play button
    borderRadius: 999,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  statusMessage: {
    backgroundColor: '#10B981', // Green for the status message
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});
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
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
// We'll keep using View instead of LinearGradient
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.8, 280);
const BUTTON_SIZE = 64;

type Mode = 'work' | 'shortBreak' | 'longBreak';

// Define preset configurations
interface PomodoroPreset {
  name: string;
  workTime: number;
  shortBreakTime: number;
  longBreakTime: number;
}

const PRESETS: PomodoroPreset[] = [
  {
    name: 'Default',
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
  {
    name: 'Longer',
    workTime: 50,
    shortBreakTime: 10,
    longBreakTime: 30,
  },
  {
    name: 'Shorter',
    workTime: 15,
    shortBreakTime: 3,
    longBreakTime: 10,
  },
  {
    name: 'Custom',
    workTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
  },
];

// Light mode color themes
const LightModeColors = {
  work: {
    primary: '#6366F1',
    secondary: '#EEF2FF',
    text: '#1F2937',
    lightText: '#6B7280',
    accent: '#ffffff',
    timerStroke: '#6366F1',
    timerBackground: '#E5E7EB',
    gradientStart: '#8B5CF6',
    gradientEnd: '#6366F1',
  },
  shortBreak: {
    primary: '#10B981',
    secondary: '#ECFDF5',
    text: '#1F2937',
    lightText: '#6B7280',
    accent: '#ffffff',
    timerStroke: '#10B981',
    timerBackground: '#E5E7EB',
    gradientStart: '#34D399',
    gradientEnd: '#10B981',
  },
  longBreak: {
    primary: '#3B82F6',
    secondary: '#EFF6FF',
    text: '#1F2937',
    lightText: '#6B7280',
    accent: '#ffffff',
    timerStroke: '#3B82F6',
    timerBackground: '#E5E7EB',
    gradientStart: '#60A5FA',
    gradientEnd: '#3B82F6',
  }
};

const PomodoroScreen = () => {
  const router = useRouter();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>('work');
  const [sessions, setSessions] = useState(0);
  
  // Add state for presets
  const [selectedPreset, setSelectedPreset] = useState<PomodoroPreset>(PRESETS[0]);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [customPreset, setCustomPreset] = useState({
    workTime: '25',
    shortBreakTime: '5',
    longBreakTime: '15',
  });
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Updated to use selected preset
  const modes: Record<Mode, { time: number; color: [string, string]; label: string }> = {
    work: { 
      time: selectedPreset.workTime, 
      color: ['#4F46E5', '#EEF2FF'], 
      label: 'Focus Time' 
    },
    shortBreak: { 
      time: selectedPreset.shortBreakTime, 
      color: ['#059669', '#ECFDF5'], 
      label: 'Short Break' 
    },
    longBreak: { 
      time: selectedPreset.longBreakTime, 
      color: ['#0369A1', '#F0F9FF'], 
      label: 'Long Break' 
    },
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

  const themeColors = LightModeColors[mode];
  
  const CircularProgress = ({ progress }: { progress: number }) => {
    const radius = CIRCLE_SIZE / 2 - 16;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={{ position: 'relative', width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
          <Defs>
            <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={themeColors.gradientStart} />
              <Stop offset="100%" stopColor={themeColors.gradientEnd} />
            </LinearGradient>
          </Defs>
          {/* Background circle */}
          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            stroke={themeColors.timerBackground}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
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

        {/* Timer Display */}
        <View style={styles.timeDisplay}>
          <Text style={[styles.timeText, { color: themeColors.text }]}>{formatTime(minutes, seconds)}</Text>
          <Text style={[styles.statusText, { color: themeColors.lightText }]}>
            {isActive ? 'Focus time' : 'Ready to start'}
          </Text>
        </View>
      </View>
    );
  };

  // Handle selecting a preset
  const handleSelectPreset = (preset: PomodoroPreset) => {
    if (preset.name === 'Custom') {
      // For custom, use the values from customPreset
      const customValues = {
        ...preset,
        workTime: parseInt(customPreset.workTime) || 25,
        shortBreakTime: parseInt(customPreset.shortBreakTime) || 5,
        longBreakTime: parseInt(customPreset.longBreakTime) || 15,
      };
      setSelectedPreset(customValues);
    } else {
      setSelectedPreset(preset);
    }
    
    // Reset timer with new values
    setIsActive(false);
    setMinutes(mode === 'work' ? 
      (preset.name === 'Custom' ? parseInt(customPreset.workTime) : preset.workTime) : 
      mode === 'shortBreak' ? 
        (preset.name === 'Custom' ? parseInt(customPreset.shortBreakTime) : preset.shortBreakTime) : 
        (preset.name === 'Custom' ? parseInt(customPreset.longBreakTime) : preset.longBreakTime));
    setSeconds(0);
    setShowPresetsModal(false);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.secondary }]}>
      <StatusBar barStyle="dark-content" backgroundColor={themeColors.secondary} />
      <View style={[styles.container, { backgroundColor: themeColors.secondary }]}>
        {/* Header - Centered with consistent spacing */}
        <View style={styles.header}>
          <Icon name="timer" size={32} color={themeColors.primary} />
          <Text style={[styles.title, { color: themeColors.text }]}>{modes[mode].label}</Text>
          <View style={styles.presetButton}>
            <TouchableOpacity 
              onPress={() => setShowPresetsModal(true)}
              style={[styles.presetSelector, { borderColor: themeColors.primary }]}
            >
              <Text style={[styles.presetText, { color: themeColors.primary }]}>
                {selectedPreset.name} Preset
              </Text>
              <Icon name="arrow-drop-down" size={20} color={themeColors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.subtitle, { color: themeColors.lightText }]}>Session {sessions + 1}</Text>
        </View>

        {/* Timer Circle - Perfectly centered */}
        <View style={styles.circleWrapper}>
          <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
            <CircularProgress progress={progress} />
          </Animated.View>
        </View>

        {/* Session indicators */}
        <View style={styles.sessionIndicatorContainer}>
          {[...Array(4)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.sessionDot, 
                { 
                  backgroundColor: i <= (sessions % 4) ? themeColors.primary : themeColors.timerBackground,
                  borderColor: themeColors.primary
                }
              ]} 
            />
          ))}
        </View>

        {/* Controls - Aligned and properly sized */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            onPress={resetTimer} 
            style={[styles.resetButton, { backgroundColor: themeColors.lightText }]}
          >
            <Icon name="replay" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={toggleTimer} 
            style={[
              styles.playButton, 
              { 
                backgroundColor: isActive ? themeColors.gradientStart : themeColors.primary,
                shadowColor: themeColors.primary
              }
            ]}
          >
            {isActive ? (
              <Icon name="pause" size={36} color="#fff" />
            ) : (
              <Icon name="play-arrow" size={36} color="#fff" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: themeColors.lightText }]}
            onPress={() => switchMode(mode === 'work' ? 'shortBreak' : 'work')}
          >
            <Icon name="skip-next" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Mode selection buttons */}
        <View style={styles.modeSelectionContainer}>
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              { 
                backgroundColor: mode === 'work' ? themeColors.primary : 'transparent',
                borderColor: LightModeColors.work.primary 
              }
            ]}
            onPress={() => switchMode('work')}
          >
            <Text 
              style={[
                styles.modeButtonText, 
                { color: mode === 'work' ? '#fff' : LightModeColors.work.primary }
              ]}
            >
              Focus
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              { 
                backgroundColor: mode === 'shortBreak' ? themeColors.primary : 'transparent',
                borderColor: LightModeColors.shortBreak.primary 
              }
            ]}
            onPress={() => switchMode('shortBreak')}
          >
            <Text 
              style={[
                styles.modeButtonText, 
                { color: mode === 'shortBreak' ? '#fff' : LightModeColors.shortBreak.primary }
              ]}
            >
              Short Break
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.modeButton, 
              { 
                backgroundColor: mode === 'longBreak' ? themeColors.primary : 'transparent',
                borderColor: LightModeColors.longBreak.primary 
              }
            ]}
            onPress={() => switchMode('longBreak')}
          >
            <Text 
              style={[
                styles.modeButtonText, 
                { color: mode === 'longBreak' ? '#fff' : LightModeColors.longBreak.primary }
              ]}
            >
              Long Break
            </Text>
          </TouchableOpacity>
        </View>

        {/* Presets Modal */}
        <Modal
          visible={showPresetsModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowPresetsModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: LightModeColors.work.secondary }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: themeColors.text }]}>Timer Presets</Text>
                <TouchableOpacity onPress={() => setShowPresetsModal(false)}>
                  <Icon name="close" size={24} color={themeColors.primary} />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.presetList}>
                {PRESETS.slice(0, 3).map((preset, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.presetItem,
                      selectedPreset.name === preset.name && { 
                        backgroundColor: themeColors.primary + '20' 
                      }
                    ]}
                    onPress={() => handleSelectPreset(preset)}
                  >
                    <Text style={[styles.presetItemTitle, { color: themeColors.text }]}>
                      {preset.name}
                    </Text>
                    <Text style={[styles.presetItemDetails, { color: themeColors.lightText }]}>
                      {preset.workTime}m focus / {preset.shortBreakTime}m short break / {preset.longBreakTime}m long break
                    </Text>
                  </TouchableOpacity>
                ))}
                
                {/* Custom preset with inputs */}
                <View style={[
                  styles.presetItem, 
                  styles.customPresetItem,
                  selectedPreset.name === 'Custom' && { 
                    backgroundColor: themeColors.primary + '20' 
                  }
                ]}>
                  <Text style={[styles.presetItemTitle, { color: themeColors.text }]}>
                    Custom
                  </Text>
                  
                  <View style={styles.customInputsRow}>
                    <View style={styles.customInputGroup}>
                      <Text style={[styles.inputLabel, { color: themeColors.lightText }]}>Focus</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: themeColors.lightText,
                          color: themeColors.text 
                        }]}
                        keyboardType="number-pad"
                        value={customPreset.workTime}
                        onChangeText={(text) => setCustomPreset({...customPreset, workTime: text})}
                        maxLength={3}
                      />
                      <Text style={[styles.inputUnit, { color: themeColors.lightText }]}>min</Text>
                    </View>
                    
                    <View style={styles.customInputGroup}>
                      <Text style={[styles.inputLabel, { color: themeColors.lightText }]}>Short</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: themeColors.lightText,
                          color: themeColors.text 
                        }]}
                        keyboardType="number-pad"
                        value={customPreset.shortBreakTime}
                        onChangeText={(text) => setCustomPreset({...customPreset, shortBreakTime: text})}
                        maxLength={2}
                      />
                      <Text style={[styles.inputUnit, { color: themeColors.lightText }]}>min</Text>
                    </View>
                    
                    <View style={styles.customInputGroup}>
                      <Text style={[styles.inputLabel, { color: themeColors.lightText }]}>Long</Text>
                      <TextInput
                        style={[styles.customInput, { 
                          borderColor: themeColors.lightText,
                          color: themeColors.text 
                        }]}
                        keyboardType="number-pad"
                        value={customPreset.longBreakTime}
                        onChangeText={(text) => setCustomPreset({...customPreset, longBreakTime: text})}
                        maxLength={2}
                      />
                      <Text style={[styles.inputUnit, { color: themeColors.lightText }]}>min</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: themeColors.primary }]}
                    onPress={() => handleSelectPreset(PRESETS[3])} // Add onPress handler to apply custom settings
                  >
                    <Text style={styles.applyButtonText}>Apply Custom</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

// Add styles definition
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  presetButton: {
    marginTop: 8,
  },
  presetSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 14,
    marginRight: 4,
  },
  circleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timeDisplay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: 2,
  },
  statusText: {
    fontSize: 16,
    marginTop: 8,
  },
  sessionIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  sessionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  playButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: height * 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  presetList: {
    flex: 1,
  },
  presetItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  presetItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  presetItemDetails: {
    fontSize: 14,
  },
  customPresetItem: {
    marginBottom: 30,
  },
  customInputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  customInputGroup: {
    alignItems: 'center',
    width: '30%',
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  customInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    textAlign: 'center',
    fontSize: 16,
  },
  inputUnit: {
    fontSize: 12,
    marginTop: 4,
  },
  applyButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PomodoroScreen;
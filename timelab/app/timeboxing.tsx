import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { app, auth, db } from '../FirebaseConfig';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const { width, height } = Dimensions.get('window');
const CIRCLE_SIZE = Math.min(width * 0.7, 240);
const BUTTON_SIZE = 56;

// Theme color scheme
const LightTheme = {
  background: '#ffffff',
  cardBackground: '#f9fafb',
  primaryText: '#1F2937',
  secondaryText: '#6B7280',
  accent: '#3B82F6',
  accentGradientStart: '#60A5FA',
  accentGradientEnd: '#3B82F6',
  disabled: '#E5E7EB',
  disabledText: '#9CA3AF',
  controlBackground: '#6B7280',
  success: '#10B981',
  warning: '#F59E0B',
  circleBackground: '#E5E7EB',
  border: '#D1D5DB',
  priorityHigh: '#EF4444',
  priorityMedium: '#F59E0B',
  priorityLow: '#10B981'
};

interface Timebox {
  id: string;
  task: string;
  duration: number; // in minutes
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  userId?: string; // Add userId to associate timeboxes with users
  createdAt?: number; // Add timestamp for sorting
}

const TimeboxingScreen = () => {
  const router = useRouter();
  const theme = LightTheme;
  const [user, setUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for current timebox timer
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [currentTask, setCurrentTask] = useState('Focus on current task');
  
  // State for timebox management
  const [timeboxes, setTimeboxes] = useState<Timebox[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDuration, setNewDuration] = useState('25');
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  
  // Animation
  const animatedValue = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const radius = CIRCLE_SIZE / 2 - 12;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  // Timer calculations
  const initialTime = 25 * 60; // Default if no task is selected
  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
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

  // Animation for progress
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false
    }).start();
  }, [progress]);

  // Check authentication status and redirect if not logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (!user) {
        // Redirect to login if no user is authenticated
        Alert.alert('Authentication Required', 'Please log in to use timeboxing features');
        router.replace('/userAccount'); // Adjust this path based on your app's structure
      } else {
        // Load user's timeboxes from database
        loadTimeboxes(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load timeboxes from database
  const loadTimeboxes = async (userId: string) => {
    setIsLoading(true);
    try {
      const timeboxesRef = collection(db, 'timeboxes');
      const q = query(timeboxesRef, where('userId', '==', userId));
      
      // Set up real-time listener for timeboxes
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const timeboxList: Timebox[] = [];
        querySnapshot.forEach((doc) => {
          timeboxList.push({ id: doc.id, ...doc.data() } as Timebox);
        });
        
        // Sort timeboxes by creation time (newest first) and priority
        timeboxList.sort((a, b) => {
          // First sort by completion status
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          
          // Then by priority
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        
        setTimeboxes(timeboxList);
        setIsLoading(false);
      });
      
      return unsubscribe;
    } catch (error) {
      console.error("Error loading timeboxes:", error);
      setIsLoading(false);
      Alert.alert('Error', 'Failed to load your timeboxes');
    }
  };

  // Save a new timebox to database
  const addTimeboxToDb = async () => {
    if (newTask.trim() === '' || parseInt(newDuration) <= 0) return;
    if (!user) {
      Alert.alert('Authentication Required', 'Please log in to save timeboxes');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const newTimebox: Omit<Timebox, 'id'> = {
        task: newTask,
        duration: parseInt(newDuration),
        completed: false,
        priority: newPriority,
        userId: user.uid,
        createdAt: Date.now()
      };
      
      await addDoc(collection(db, 'timeboxes'), newTimebox);
      
      // Reset form fields
      setNewTask('');
      setNewDuration('25');
      setIsSaving(false);
    } catch (error) {
      console.error("Error adding timebox:", error);
      setIsSaving(false);
      Alert.alert('Error', 'Failed to save your timebox');
    }
  };

  // Update timebox completion status
  const toggleTimeboxCompletedInDb = async (id: string, isCompleted: boolean) => {
    try {
      const timeboxRef = doc(db, 'timeboxes', id);
      await updateDoc(timeboxRef, {
        completed: !isCompleted
      });
    } catch (error) {
      console.error("Error updating timebox:", error);
      Alert.alert('Error', 'Failed to update timebox status');
    }
  };

  // Delete timebox from database
  const deleteTimeboxFromDb = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'timeboxes', id));
    } catch (error) {
      console.error("Error deleting timebox:", error);
      Alert.alert('Error', 'Failed to delete timebox');
    }
  };

  // Timer controls
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  // Modified function to toggle timebox completion with database update
  const toggleTimeboxCompleted = (id: string, isCompleted: boolean) => {
    toggleTimeboxCompletedInDb(id, isCompleted);
  };

  // Modified function to add timebox using database
  const addTimebox = () => {
    addTimeboxToDb();
  };

  const startTimebox = (timebox: Timebox) => {
    setCurrentTask(timebox.task);
    setTimeLeft(timebox.duration * 60);
    setIsRunning(true);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return theme.priorityHigh;
      case 'medium': return theme.priorityMedium;
      case 'low': return theme.priorityLow;
      default: return theme.accent;
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Header with User Info */}
          <View style={styles.header}>
            <Icon name="schedule" size={32} color={theme.accent} />
            <Text style={[styles.title, { color: theme.primaryText }]}>Timeboxing</Text>
            {user && (
              <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
                {user.displayName || user.email || 'Focus on one task at a time'}
              </Text>
            )}
          </View>

          {/* Current Timebox */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Current Focus</Text>
            <Text style={[styles.currentTask, { color: theme.primaryText }]}>{currentTask}</Text>
            
            {/* Timer Circle */}
            <View style={styles.circleWrapper}>
              <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE} style={styles.svg}>
                <Defs>
                  <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={theme.accentGradientStart} />
                    <Stop offset="100%" stopColor={theme.accentGradientEnd} />
                  </LinearGradient>
                </Defs>
                {/* Background circle */}
                <Circle
                  cx={CIRCLE_SIZE / 2}
                  cy={CIRCLE_SIZE / 2}
                  r={radius}
                  stroke={theme.circleBackground}
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

              <View style={styles.timeDisplay}>
                <Text style={[styles.timeText, { color: theme.primaryText }]}>
                  {formatTime(timeLeft)}
                </Text>
                <Text style={[styles.statusText, { color: theme.secondaryText }]}>
                  {isRunning ? 'Focus time' : 'Ready to start'}
                </Text>
              </View>
            </View>

            {/* Timer Controls */}
            <View style={styles.controlsContainer}>
              <TouchableOpacity 
                onPress={resetTimer} 
                style={[styles.resetButton, { backgroundColor: theme.controlBackground }]}
              >
                <Icon name="replay" size={20} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={toggleTimer} 
                style={[
                  styles.playButton, 
                  { backgroundColor: isRunning ? theme.warning : theme.accent }
                ]}
              >
                {isRunning ? (
                  <Icon name="pause" size={32} color="#fff" />
                ) : (
                  <Icon name="play-arrow" size={32} color="#fff" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={[styles.resetButton, { backgroundColor: theme.controlBackground }]}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add New Timebox */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Add New Timebox</Text>
            
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.primaryText }]}
              placeholder="What are you working on?"
              placeholderTextColor={theme.secondaryText}
              value={newTask}
              onChangeText={setNewTask}
            />
            
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.durationInput, { borderColor: theme.border, color: theme.primaryText }]}
                placeholder="25"
                placeholderTextColor={theme.secondaryText}
                keyboardType="number-pad"
                value={newDuration}
                onChangeText={setNewDuration}
              />
              
              <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>minutes</Text>
              
              <View style={styles.prioritySelector}>
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    { backgroundColor: newPriority === 'high' ? theme.priorityHigh : theme.disabled }
                  ]}
                  onPress={() => setNewPriority('high')}
                >
                  <Text style={styles.priorityText}>High</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    { backgroundColor: newPriority === 'medium' ? theme.priorityMedium : theme.disabled }
                  ]}
                  onPress={() => setNewPriority('medium')}
                >
                  <Text style={styles.priorityText}>Med</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.priorityButton,
                    { backgroundColor: newPriority === 'low' ? theme.priorityLow : theme.disabled }
                  ]}
                  onPress={() => setNewPriority('low')}
                >
                  <Text style={styles.priorityText}>Low</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.accent }]}
              onPress={addTimebox}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.addButtonText}>Add Timebox</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Timebox List */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>Your Timeboxes</Text>
            
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.accent} />
                <Text style={[styles.loadingText, { color: theme.secondaryText }]}>
                  Loading your timeboxes...
                </Text>
              </View>
            ) : timeboxes.length === 0 ? (
              <Text style={[styles.emptyState, { color: theme.secondaryText }]}>
                No timeboxes yet. Add your first task above!
              </Text>
            ) : (
              <FlatList
                data={timeboxes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={[
                    styles.timeboxItem, 
                    { borderColor: theme.border },
                    item.completed && { opacity: 0.6 }
                  ]}>
                    <View style={styles.timeboxRow}>
                      <TouchableOpacity 
                        onPress={() => toggleTimeboxCompleted(item.id, item.completed)}
                        style={[
                          styles.checkbox, 
                          { borderColor: getPriorityColor(item.priority) },
                          item.completed && { backgroundColor: getPriorityColor(item.priority) }
                        ]}
                      >
                        {item.completed && <Icon name="check" size={16} color="#fff" />}
                      </TouchableOpacity>
                      
                      <View style={styles.timeboxContent}>
                        <Text style={[
                          styles.timeboxTask, 
                          { color: theme.primaryText },
                          item.completed && styles.completedText
                        ]}>
                          {item.task}
                        </Text>
                        <Text style={[styles.timeboxDuration, { color: theme.secondaryText }]}>
                          {item.duration} minutes
                        </Text>
                      </View>
                      
                      <View style={styles.timeboxActions}>
                        <TouchableOpacity 
                          style={[styles.startTimeboxButton, { backgroundColor: theme.accent }]}
                          onPress={() => startTimebox(item)}
                          disabled={item.completed}
                        >
                          <Icon name="play-arrow" size={16} color="#fff" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.deleteButton, { backgroundColor: theme.priorityHigh }]}
                          onPress={() => deleteTimeboxFromDb(item.id)}
                        >
                          <Icon name="delete" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
                style={styles.timeboxList}
                scrollEnabled={false}
              />
            )}
          </View>

          {/* About Timeboxing */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.primaryText }]}>About Timeboxing</Text>
            <Text style={[styles.aboutText, { color: theme.secondaryText }]}>
              Timeboxing is a time management technique that involves allocating a fixed amount of time to a specific task. Benefits include:
            </Text>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color={theme.accent} />
              <Text style={[styles.benefitText, { color: theme.primaryText }]}>
                Improves focus and productivity
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color={theme.accent} />
              <Text style={[styles.benefitText, { color: theme.primaryText }]}>
                Prevents perfectionism and procrastination
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color={theme.accent} />
              <Text style={[styles.benefitText, { color: theme.primaryText }]}>
                Creates a sense of urgency
              </Text>
            </View>
            
            <View style={styles.benefitItem}>
              <Icon name="check-circle" size={20} color={theme.accent} />
              <Text style={[styles.benefitText, { color: theme.primaryText }]}>
                Helps track time spent on activities
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currentTask: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  circleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    alignSelf: 'center',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
  },
  svg: {
    position: 'absolute',
  },
  timeDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 14,
    marginTop: 4,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  playButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  durationInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: 60,
    fontSize: 16,
    textAlign: 'center',
  },
  inputLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  prioritySelector: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  priorityText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeboxList: {
    marginTop: 8,
  },
  timeboxItem: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  timeboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeboxContent: {
    flex: 1,
    marginLeft: 12,
  },
  timeboxTask: {
    fontSize: 16,
    fontWeight: '500',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  timeboxDuration: {
    fontSize: 14,
    marginTop: 2,
  },
  startTimeboxButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  aboutText: {
    lineHeight: 22,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    marginLeft: 12,
    fontSize: 15,
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  timeboxActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});

export default TimeboxingScreen;

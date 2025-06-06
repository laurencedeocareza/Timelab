import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Safe import pattern for ExpoAV to prevent crashes
let ExpoAV: any = null;
try {
  ExpoAV = require('expo-av');
} catch (error) {
  console.log('expo-av module not available');
}

// Enhanced Track interface with audio file
interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  audioFile: any; // Reference to audio file
}

export default function SoundPlayer() {
  const router = useRouter();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudioModule, setHasAudioModule] = useState(false);
  const [sound, setSound] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isWebPlatform = Platform.OS === 'web';
  
  // Sample tracks with audio files
  const tracks: Track[] = [
    { 
      id: '1', 
      title: '5 Minute Focus', 
      artist: 'Meditation', 
      duration: '5:00',
      // Use proper relative path for web
      audioFile: Platform.OS === 'web' 
        ? '/assets/music/5minfocus.mp3' // Relative URL for web
        : require('../assets/music/5minfocus.mp3') // Require for native
    },
    { 
      id: '2', 
      title: 'Calm Waters', 
      artist: 'Nature Sounds', 
      duration: '3:45',
      audioFile: require('../assets/music/5minwater.mp3')
    },
    { 
      id: '3', 
      title: 'Forest Ambience', 
      artist: 'Nature Sounds', 
      duration: '4:20',
      audioFile: require('../assets/music/5minnature.mp3')
    },
    { 
      id: '4', 
      title: 'Meditation Bells', 
      artist: 'Mindfulness', 
      duration: '2:30',
      audioFile: require('../assets/music/5minbell.mp3')
    },
  ];

  // Initialize audio based on platform
  useEffect(() => {
    if (isWebPlatform) {
      // Web platform: use HTML5 Audio
      initWebAudio();
    } else {
      // Native platforms: try to use ExpoAV
      initNativeAudio();
    }

    // Cleanup function
    return () => {
      if (isWebPlatform) {
        cleanupWebAudio();
      } else {
        cleanupNativeAudio();
      }
    };
  }, []);

  // Initialize web audio
  const initWebAudio = () => {
    try {
      // Create HTML audio element for web
      const audio = new Audio();
      
      // Set up event handlers
      audio.onended = () => playNext();
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplaythrough = () => setIsLoading(false);
      
      audioRef.current = audio;
      setHasAudioModule(true);
      console.log("Web audio initialized successfully");
      
      // Preload first track
      const track = tracks[currentTrackIndex];
      const audioPath = track.audioFile;
      
      // For web, we need a URL string
      // This extracts the filename from the require statement
      const pathParts = audioPath.toString().split('/');
      const filename = pathParts[pathParts.length - 1];
      
      // Use a more reliable path for web development
      const webAssetPath = window.location.origin + '/assets/music/' + filename;
      console.log("Attempting to load web audio from:", webAssetPath);
      audio.src = webAssetPath;
      audio.load();
      
    } catch (error) {
      console.error("Failed to initialize web audio:", error);
      setHasAudioModule(false);
    }
  };
  
  // Clean up web audio
  const cleanupWebAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };
  
  // Initialize native audio
  const initNativeAudio = async () => {
    if (!ExpoAV) {
      console.log("ExpoAV module not available");
      setHasAudioModule(false);
      return;
    }
    
    // Check if the module is complete
    if (!ExpoAV.Audio || !ExpoAV.Audio.Sound) {
      console.log("ExpoAV module incomplete - missing Audio.Sound");
      setHasAudioModule(false);
      return;
    }
    
    try {
      // Test if we can actually create a Sound object
      const testSound = new ExpoAV.Audio.Sound();
      
      // Configure audio mode
      await ExpoAV.Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      // Clean up test sound
      await testSound.unloadAsync();
      
      setHasAudioModule(true);
      console.log("Native audio initialized successfully");
      
      // Pre-load the first track in the background
      loadNativeTrack(currentTrackIndex, false);
    } catch (error) {
      console.error("Failed to initialize native audio:", error);
      setHasAudioModule(false);
    }
  };
  
  // Clean up native audio
  const cleanupNativeAudio = async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error unloading sound:", error);
      }
    }
  };

  // Load a track on web platform
  const loadWebTrack = (index: number, autoplay: boolean = true) => {
    if (!audioRef.current) return;
    
    setCurrentTrackIndex(index);
    setIsLoading(true);
    
    const track = tracks[index];
    const audioPath = track.audioFile;
    
    // Extract filename from require statement
    const pathParts = audioPath.toString().split('/');
    const filename = pathParts[pathParts.length - 1];
    
    // Set new source and load
    audioRef.current.src = `/assets/music/${filename}`;
    audioRef.current.load();
    
    if (autoplay) {
      audioRef.current.play().catch(error => {
        console.error("Error playing web audio:", error);
        Alert.alert(
          "Playback Error",
          "Could not play audio. Please interact with the page first."
        );
      });
    }
  };
  
  // Load a track on native platforms
  const loadNativeTrack = async (index: number, autoplay: boolean = true) => {
    if (!ExpoAV || !hasAudioModule) return;
    
    try {
      setIsLoading(true);
      
      // Unload previous sound if exists
      if (sound) {
        await sound.unloadAsync();
      }
      
      const track = tracks[index];
      console.log(`Loading native track: ${track.title}`);
      
      // Create and load the new sound
      const { sound: newSound } = await ExpoAV.Audio.Sound.createAsync(
        track.audioFile,
        { shouldPlay: autoplay },
        onNativePlaybackStatusUpdate
      );
      
      setSound(newSound);
      setCurrentTrackIndex(index);
      setIsPlaying(autoplay);
    } catch (error) {
      console.error("Error loading native track:", error);
      Alert.alert(
        "Playback Error",
        "Could not play the selected track. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle native playback status updates
  const onNativePlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    
    // Update playing state
    setIsPlaying(status.isPlaying);
    
    // If track finished, play the next one
    if (status.didJustFinish) {
      playNext();
    }
  };

  // Toggle play/pause with platform detection
  const togglePlayPause = async () => {
    if (!hasAudioModule) {
      // Fallback if audio module isn't available
      setIsPlaying(!isPlaying);
      Alert.alert(
        "Audio Unavailable",
        "Audio playback is not available on this device. Please reinstall the app."
      );
      return;
    }
    
    try {
      if (isWebPlatform) {
        // Web implementation
        if (!audioRef.current) return;
        
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } else {
        // Native implementation
        if (!sound) {
          // No sound loaded yet, load and play current track
          loadNativeTrack(currentTrackIndex);
          return;
        }
        
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      setIsPlaying(false);
    }
  };
  
  // Load and play a track with platform detection
  const loadAndPlayTrack = (index: number, play: boolean = true) => {
    if (!hasAudioModule) {
      // Fallback behavior when audio isn't available
      setCurrentTrackIndex(index);
      setIsPlaying(false);
      Alert.alert(
        "Audio Unavailable",
        "Audio playback is not available on this device."
      );
      return;
    }
    
    if (isWebPlatform) {
      loadWebTrack(index, play);
    } else {
      loadNativeTrack(index, play);
    }
  };

  // Previous track
  const playPrevious = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  // Next track
  const playNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  // Render track item
  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity 
      style={[styles.trackItem, currentTrackIndex === index && styles.activeTrack]} 
      onPress={() => loadAndPlayTrack(index)}
    >
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{item.title}</Text>
        <Text style={styles.trackArtist}>{item.artist}</Text>
      </View>
      <Text style={styles.trackDuration}>{item.duration}</Text>
      {currentTrackIndex === index && isPlaying && (
        <Ionicons name="musical-notes" size={16} color="#4CAF50" style={styles.playingIcon} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Focus Sounds</Text>
      </View>

      {/* Now Playing */}
      <View style={styles.nowPlaying}>
        <Text style={styles.nowPlayingTitle}>
          {tracks[currentTrackIndex].title}
        </Text>
        <Text style={styles.nowPlayingArtist}>
          {tracks[currentTrackIndex].artist}
        </Text>
        
        {!hasAudioModule && (
          <View style={styles.audioWarning}>
            <Text style={styles.warningText}>
              Audio playback unavailable. Visual preview only.
            </Text>
          </View>
        )}
        
        {isLoading && (
          <Text style={styles.loadingText}>Loading audio...</Text>
        )}
        
        {isWebPlatform && hasAudioModule && (
          <Text style={styles.platformText}>Using Web Audio</Text>
        )}
        
        {!isWebPlatform && hasAudioModule && (
          <Text style={styles.platformText}>Using Native Audio</Text>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrevious}>
          <Ionicons name="play-skip-back" size={32} color="#555" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.playButton,
            isLoading && styles.disabledButton
          ]} 
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={32} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Track List */}
      <View style={styles.tracksContainer}>
        <Text style={styles.sectionTitle}>Tracks</Text>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item) => item.id}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  nowPlaying: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f8f8',
  },
  nowPlayingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nowPlayingArtist: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  audioWarning: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(255, 193, 7, 0.2)',
    borderRadius: 4,
  },
  warningText: {
    color: '#856404',
    fontSize: 12,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  platformText: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 32,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7',
  },
  tracksContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeTrack: {
    backgroundColor: '#f0f8ff',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  trackDuration: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  playingIcon: {
    marginLeft: 4,
  },
});
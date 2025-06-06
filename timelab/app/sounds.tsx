import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

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
      artist: 'Deep focus music for work and productivity', 
      duration: '5:00',
      audioFile: Platform.OS === 'web' 
        ? '/assets/music/5minfocus.mp3'
        : require('../assets/music/5minfocus.mp3')
    },
    { 
      id: '2', 
      title: 'Calm Waters', 
      artist: 'Nature Sounds', 
      duration: '3:45',
      audioFile: Platform.OS === 'web' 
        ? '/assets/music/5minwater.mp3'
        : require('../assets/music/5minwater.mp3')
    },
    { 
      id: '3', 
      title: 'Forest Ambience', 
      artist: 'Nature Sounds', 
      duration: '4:20',
      audioFile: Platform.OS === 'web' 
        ? '/assets/music/5minnature.mp3'
        : require('../assets/music/5minnature.mp3')
    },
    { 
      id: '4', 
      title: 'Meditation Bells', 
      artist: 'Mindfulness', 
      duration: '2:30',
      audioFile: Platform.OS === 'web' 
        ? '/assets/music/5minbell.mp3'
        : require('../assets/music/5minbell.mp3')
    },
  ];

  // All audio initialization and playback functions remain unchanged
  useEffect(() => {
    if (isWebPlatform) {
      initWebAudio();
    } else {
      initNativeAudio();
    }

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
      const audio = new Audio();
      audio.onended = () => playNext();
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplaythrough = () => setIsLoading(false);
      
      audioRef.current = audio;
      setHasAudioModule(true);
      
      const track = tracks[currentTrackIndex];
      const audioPath = track.audioFile;
      
      const pathParts = audioPath.toString().split('/');
      const filename = pathParts[pathParts.length - 1];
      
      const webAssetPath = window.location.origin + '/assets/music/' + filename;
      audio.src = webAssetPath;
      audio.load();
    } catch (error) {
      console.error("Failed to initialize web audio:", error);
      setHasAudioModule(false);
    }
  };
  
  // Keep all other audio functions unchanged
  const cleanupWebAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };
  
  const initNativeAudio = async () => {
    if (!ExpoAV) {
      setHasAudioModule(false);
      return;
    }
    
    if (!ExpoAV.Audio || !ExpoAV.Audio.Sound) {
      setHasAudioModule(false);
      return;
    }
    
    try {
      const testSound = new ExpoAV.Audio.Sound();
      
      await ExpoAV.Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      
      await testSound.unloadAsync();
      
      setHasAudioModule(true);
      loadNativeTrack(currentTrackIndex, false);
    } catch (error) {
      console.error("Failed to initialize native audio:", error);
      setHasAudioModule(false);
    }
  };
  
  const cleanupNativeAudio = async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error unloading sound:", error);
      }
    }
  };

  const loadWebTrack = (index: number, autoplay: boolean = true) => {
    if (!audioRef.current) return;
    
    setCurrentTrackIndex(index);
    setIsLoading(true);
    
    const track = tracks[index];
    const audioPath = track.audioFile;
    
    const pathParts = audioPath.toString().split('/');
    const filename = pathParts[pathParts.length - 1];
    
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
  
  const loadNativeTrack = async (index: number, autoplay: boolean = true) => {
    if (!ExpoAV || !hasAudioModule) return;
    
    try {
      setIsLoading(true);
      
      if (sound) {
        await sound.unloadAsync();
      }
      
      const track = tracks[index];
      
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
  
  const onNativePlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    setIsPlaying(status.isPlaying);
    if (status.didJustFinish) {
      playNext();
    }
  };

  const togglePlayPause = async () => {
    if (!hasAudioModule) {
      setIsPlaying(!isPlaying);
      Alert.alert(
        "Audio Playback Issue",
        "Audio playback is currently unavailable. We're working on fixing this in the next update."
      );
      return;
    }
    
    try {
      if (isWebPlatform) {
        if (!audioRef.current) return;
        
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
      } else {
        if (!sound) {
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
  
  const loadAndPlayTrack = (index: number, play: boolean = true) => {
    if (!hasAudioModule) {
      setCurrentTrackIndex(index);
      setIsPlaying(false);
      Alert.alert(
        "Audio Playback Issue",
        "Audio playback is currently unavailable. We're working on fixing this in the next update."
      );
      return;
    }
    
    if (isWebPlatform) {
      loadWebTrack(index, play);
    } else {
      loadNativeTrack(index, play);
    }
  };

  const playPrevious = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  const playNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  // Track item component - for fixed rendering
  const TrackItem = ({ track, index }: { track: Track; index: number }) => (
    <TouchableOpacity 
      style={[styles.trackItem, currentTrackIndex === index && styles.activeTrack]} 
      onPress={() => loadAndPlayTrack(index)}
    >
      <View style={styles.trackIconContainer}>
        <Image
          source={require('../assets/images/music.png')} 
          style={styles.trackIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle}>{track.title.toUpperCase()}</Text>
        <Text style={styles.trackArtist}>{track.artist}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header section removed */}

      {/* Content ScrollView - starts immediately at the top now */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Now Playing Section */}
        <View style={styles.nowPlayingContainer}>
          {/* Music Icon */}
          <View style={styles.musicIconContainer}>
            <Image 
              source={require('../assets/images/music.png')} 
              style={styles.musicIcon}
              resizeMode="contain"
            />
          </View>
          
          {/* Track Info */}
          <View style={styles.trackInfoContainer}>
            <Text style={styles.nowPlayingTitle}>
              {tracks[currentTrackIndex].title}
            </Text>
            <Text style={styles.nowPlayingArtist}>
              {tracks[currentTrackIndex].artist}
            </Text>
            
            {/* Audio Message Banner */}
            {!hasAudioModule && (
              <View style={styles.audioMessageBanner}>
                <Text style={styles.audioMessageText}>
                  Preview mode active. Audio playback will be available in the next update.
                </Text>
              </View>
            )}
          </View>
          
          {/* Media Controls */}
          <View style={styles.controls}>
            <TouchableOpacity onPress={playPrevious} style={styles.controlButton}>
              <Ionicons name="play-skip-back" size={28} color="#555" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.playButton, isLoading && styles.disabledButton]} 
              onPress={togglePlayPause}
              disabled={isLoading}
            >
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#fff" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={playNext} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={28} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Track List - Fixed list, not scrollable */}
        <View style={styles.tracksContainer}>
          <Text style={styles.sectionTitle}>Sound Library</Text>
          
          {/* Fixed Track List */}
          <View style={styles.fixedTrackList}>
            {tracks.map((track, index) => (
              <TrackItem key={track.id} track={track} index={index} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    paddingBottom: 20, // Add padding at the bottom for scrolling
    paddingTop: 16, // Add padding at top since header is removed
  },
  nowPlayingContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  musicIconContainer: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  musicIcon: {
    width: '100%',
    height: '100%',
  },
  trackInfoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  nowPlayingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  nowPlayingArtist: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  audioMessageBanner: {
    backgroundColor: '#e3f2fd', // Light blue background
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '90%',
  },
  audioMessageText: {
    color: '#1565c0', // Darker blue text
    fontSize: 14,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    backgroundColor: '#4CAF50', // Green play button
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5d6a7', // Lighter green when disabled
  },
  tracksContainer: {
    backgroundColor: '#f9f9f9',
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  fixedTrackList: {
    backgroundColor: '#fff',
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  trackIconContainer: {
    width: 48,
    height: 48,
    marginRight: 16,
  },
  trackIcon: {
    width: '100%',
    height: '100%',
  },
  activeTrack: {
    backgroundColor: '#f0f8ff', // Light blue highlight for active track
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
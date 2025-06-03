import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

// Enhanced SoundTrack interface with audio file reference
interface SoundTrack {
  id: string;
  title: string;
  artist: string;
  duration: string;
  artwork: any;
  audioFile: any; // Reference to local audio file
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  nowPlayingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  albumArt: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: 8,
    marginBottom: 20,
  },
  nowPlayingTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  nowPlayingArtist: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  audioFileInfo: {
    marginBottom: 10,
  },
  audioFileText: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
  },
  infoMessage: {
    padding: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
    marginVertical: 16,
  },
  infoText: {
    color: '#2196F3',
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
  },
  playButton: {
    backgroundColor: '#1DB954',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  playlistContainer: {
    flex: 1,
    backgroundColor: '#181818',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  playlistTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  activeTrackItem: {
    backgroundColor: '#282828',
    borderRadius: 8,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  trackArtist: {
    color: '#aaa',
    fontSize: 14,
  },
  playingIcon: {
    marginRight: 8,
  },
});

export default function SoundPlayer() {
  const router = useRouter();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudioModule, setHasAudioModule] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  
  // Sound tracks with connected audio files
  const soundTracks: SoundTrack[] = [
    {
      id: '1',
      title: '5 MINUTE FOCUS',
      artist: 'Deep focus music for work and productivity',
      duration: '5:00',
      artwork: require('../assets/images/music.png'),
      audioFile: require('../assets/music/5minfocus.mp3'),
    },
    {
      id: '2',
      title: 'Calm Waters',
      artist: 'Nature Sounds',
      duration: '3:45',
      artwork: require('../assets/images/music.png'),
      audioFile: require('../assets/music/5minwater.mp3'),
    },
    {
      id: '3',
      title: 'Forest Ambience',
      artist: 'Nature Sounds',
      duration: '4:20',
      artwork: require('../assets/images/music.png'),
      audioFile: require('../assets/music/5minnature.mp3'),
    },
    {
      id: '4',
      title: 'Meditation Bells',
      artist: 'Mindfulness',
      duration: '2:30',
      artwork: require('../assets/images/music.png'),
      audioFile: require('../assets/music/5minbell.mp3'),
    },
  ];

  // Try to load the Audio module
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Configure audio
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        setHasAudioModule(true);
        console.log("Audio module initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Audio module:", error);
        setHasAudioModule(false);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    initializeAudio();

    // Cleanup function
    return () => {
      isMounted.current = false;
      unloadSound();
    };
  }, []);
  
  // Unload the current sound
  const unloadSound = async () => {
    if (sound) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error unloading sound:", error);
      }
    }
  };
  
  // Load and play a track
  const loadAndPlayTrack = async (index: number) => {
    if (!hasAudioModule || !Audio) {
      // Fallback for when Audio module is not available
    // Fallback for when Audio module is not available
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    Alert.alert(
      "Audio Playback Issue",
      `Would play "${soundTracks[index].title}" if audio module was available. We're working on fixing this in the next update.`
    );
    return;
  }
  
  if (!hasAudioModule) {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      Alert.alert(
        "Audio Playback Issue",
        `Would play "${soundTracks[index].title}" if audio module was available. We're working on fixing this in the next update.`
      );
      return;
    }
    
    try {
      // Clean up previous sound if exists
      await unloadSound();
      
      setIsLoading(true);
      const trackToPlay = soundTracks[index];
      
      // Create and load the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        trackToPlay.audioFile,
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      
      setSound(newSound);
      setCurrentTrackIndex(index);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading audio:", error);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Fall back to simulated behavior
      Alert.alert(
        "Audio Playback Error",
        "Could not play the selected track. Please try again later."
      );
    }
  };

  // Playback status update handler
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) {
      playNextTrack();
    }
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    if (!hasAudioModule) {
      // Fallback behavior
      setIsPlaying(!isPlaying);
      
      if (!isPlaying) {
        const currentTrack = soundTracks[currentTrackIndex];
        Alert.alert(
          "Audio Playback Issue",
          `Would play "${currentTrack.title}" if audio module was available. We're working on fixing this in the next update.`
        );
      }
      return;
    }
    
    try {
      if (!sound) {
        // No sound loaded yet, load current track
        await loadAndPlayTrack(currentTrackIndex);
        return;
      }
      
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      Alert.alert("Playback Error", "Could not control playback. Please try again.");
    }
  };

  // Play previous track
  const playPreviousTrack = () => {
    const newIndex = (currentTrackIndex - 1 + soundTracks.length) % soundTracks.length;
    
    if (hasAudioModule) {
      loadAndPlayTrack(newIndex);
    } else {
      setCurrentTrackIndex(newIndex);
      setIsPlaying(true);
      const prevTrack = soundTracks[newIndex];
      Alert.alert(
        "Audio Playback Issue",
        `Would play "${prevTrack.title}" if audio module was available. We're working on fixing this in the next update.`
      );
    }
  };

  // Play next track
  const playNextTrack = () => {
    const newIndex = (currentTrackIndex + 1) % soundTracks.length;
    
    if (hasAudioModule) {
      loadAndPlayTrack(newIndex);
    } else {
      setCurrentTrackIndex(newIndex);
      setIsPlaying(true);
      const nextTrack = soundTracks[newIndex];
      Alert.alert(
        "Audio Playback Issue",
        `Would play "${nextTrack.title}" if audio module was available. We're working on fixing this in the next update.`
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Now Playing</Text>
      </View>
      
      <View style={styles.nowPlayingContainer}>
        <Image 
          source={soundTracks[currentTrackIndex].artwork} 
          style={styles.albumArt}
        />
        <Text style={styles.nowPlayingTitle}>
          {soundTracks[currentTrackIndex].title}
        </Text>
        <Text style={styles.nowPlayingArtist}>
          {soundTracks[currentTrackIndex].artist}
        </Text>
        
        <View style={styles.controls}>
          <TouchableOpacity onPress={playPreviousTrack}>
            <Ionicons name="play-skip-back" size={32} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Ionicons 
              name={isPlaying ? "pause" : "play"} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={playNextTrack}>
            <Ionicons name="play-skip-forward" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.playlistContainer}>
        <Text style={styles.playlistTitle}>Playlist</Text>
        <FlatList
          data={soundTracks}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity 
              style={[
                styles.trackItem, 
                currentTrackIndex === index && styles.activeTrackItem
              ]}
              onPress={() => loadAndPlayTrack(index)}
            >
              <Image source={item.artwork} style={styles.trackImage} />
              <View style={styles.trackInfo}>
                <Text style={styles.trackTitle}>{item.title}</Text>
                <Text style={styles.trackArtist}>{item.artist}</Text>
              </View>
              {currentTrackIndex === index && isPlaying && (
                <Ionicons name="musical-notes" size={16} color="#1DB954" style={styles.playingIcon} />
              )}
              <Text style={{ color: '#aaa' }}>{item.duration}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
 
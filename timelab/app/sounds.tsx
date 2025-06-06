import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
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

  // Sample tracks with audio files
  const tracks: Track[] = [
    {
      id: '1',
      title: '5 Minute Focus',
      artist: 'Deep focus music for work and productivity',
      duration: '5:00',
      audioFile: require('../assets/music/5minfocus.mp3'),
    },
    {
      id: '2',
      title: 'Calm Waters',
      artist: 'Nature Sounds',
      duration: '3:45',
      audioFile: require('../assets/music/5minwater.mp3'),
    },
    {
      id: '3',
      title: 'Forest Ambience',
      artist: 'Nature Sounds',
      duration: '4:20',
      audioFile: require('../assets/music/5minnature.mp3'),
    },
    {
      id: '4',
      title: 'Meditation Bells',
      artist: 'Mindfulness',
      duration: '2:30',
      audioFile: require('../assets/music/5minbell.mp3'),
    },
  ];

  useEffect(() => {
    // Initialize native audio when the component mounts
    initNativeAudio();

    // Cleanup native audio when the component unmounts
    return () => {
      cleanupNativeAudio();
    };
  }, []);

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
      console.error('Failed to initialize native audio:', error);
      setHasAudioModule(false);
    }
  };

  const cleanupNativeAudio = async () => {
    if (sound) {
      try {
        await sound.unloadAsync(); // Unload the sound object
        setSound(null); // Clear the sound reference
      } catch (error) {
        console.error('Error unloading sound:', error);
      }
    }
  };

  const loadNativeTrack = async (index: number, autoplay: boolean = true) => {
    if (!ExpoAV || !hasAudioModule) return;

    try {
      setIsLoading(true);

      // Unload the existing sound object if it exists
      if (sound) {
        await sound.unloadAsync();
        setSound(null); // Clear the sound reference
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
      console.error('Error loading native track:', error);
      Alert.alert(
        'Playback Error',
        'Could not play the selected track. Please try again.'
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
        'Audio Playback Issue',
        "Audio playback is currently unavailable. We're working on fixing this in the next update."
      );
      return;
    }

    try {
      if (!sound) {
        await loadNativeTrack(currentTrackIndex); // Reload the track if sound is null
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
      console.error('Error toggling playback:', error);
      setIsPlaying(false);
    }
  };

  const loadAndPlayTrack = (index: number, play: boolean = true) => {
    if (!hasAudioModule) {
      setCurrentTrackIndex(index);
      setIsPlaying(false);
      Alert.alert(
        'Audio Playback Issue',
        "Audio playback is currently unavailable. We're working on fixing this in the next update."
      );
      return;
    }

    loadNativeTrack(index, play);
  };

  const playPrevious = () => {
    const newIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  const playNext = () => {
    const newIndex = (currentTrackIndex + 1) % tracks.length;
    loadAndPlayTrack(newIndex);
  };

  const TrackItem = ({ track, index }: { track: Track; index: number }) => (
    <TouchableOpacity
      style={[
        styles.trackItem,
        currentTrackIndex === index && styles.activeTrack,
      ]}
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
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.nowPlayingContainer}>
          <View style={styles.musicIconContainer}>
            <Image
              source={require('../assets/images/music.png')}
              style={styles.musicIcon}
              resizeMode="contain"
            />
          </View>

          <View style={styles.trackInfoContainer}>
            <Text style={styles.nowPlayingTitle}>
              {tracks[currentTrackIndex].title}
            </Text>
            <Text style={styles.nowPlayingArtist}>
              {tracks[currentTrackIndex].artist}
            </Text>
          </View>

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
                name={isPlaying ? 'pause' : 'play'}
                size={32}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={playNext} style={styles.controlButton}>
              <Ionicons name="play-skip-forward" size={28} color="#555" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tracksContainer}>
          <Text style={styles.sectionTitle}>Sound Library</Text>
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
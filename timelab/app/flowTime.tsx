import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';

const App = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1500&q=80',
        }}
        style={styles.hero}
        blurRadius={2}
      >
        <View style={styles.overlay}>
          <Text style={styles.heroTitle}>Flow Time</Text>
          <Text style={styles.heroSubtitle}>
            Focus. Flow. Finish.
          </Text>
          <Button mode="contained" style={styles.ctaButton} onPress={() => alert('Start Flow')}>
            Get Started
          </Button>
        </View>
      </ImageBackground>

      {/* Description Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>What is Flow Time?</Title>
        <Paragraph style={styles.sectionText}>
          Flow Time helps you enter deep focus states by eliminating distractions and guiding you through productive sessions. Whether it's work, study, or creative flow, this app keeps you in the zone.
        </Paragraph>
      </View>

      {/* Features Section */}
      <View style={styles.featuresContainer}>
        <Title style={styles.sectionTitle}>Key Features</Title>
        {[
          'Pomodoro Timer & Flow Tracker',
          'Minimalist Interface',
          'Custom Session Settings',
          'Focus Mode with Do Not Disturb',
          'Progress Reports & Stats',
        ].map((feature, index) => (
          <Card key={index} style={styles.featureCard}>
            <Card.Content>
              <Title style={styles.featureTitle}>✨ {feature}</Title>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaText}>Ready to boost your productivity?</Text>
        <Button mode="contained" style={styles.downloadButton} onPress={() => alert('Download Now')}>
          Download Now
        </Button>
      </View>
    </ScrollView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9', 
  },
  hero: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#555',
  },
  featuresContainer: {
    padding: 20,
  },
  featureCard: {
    marginVertical: 8,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  ctaSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    margin: 15,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  downloadButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    borderRadius: 25,
  },
});
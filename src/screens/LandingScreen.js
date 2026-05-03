import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>STEADY</Text>
      <Text style={styles.subtitle}>The Common Man OS</Text>
      <Text style={styles.text}>
        AI-powered life navigation for hard-working people trying to survive modern life without losing themselves in the process.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    color: '#fb923c',
    fontSize: 34,
    fontWeight: '900'
  },
  subtitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12
  },
  text: {
    color: '#d6d3d1',
    lineHeight: 22
  }
});

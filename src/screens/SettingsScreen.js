import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.text}>
        Steady respects privacy and avoids manipulative behavior.
      </Text>

      <Text style={styles.text}>
        Steady is not therapy, healthcare, or crisis intervention.
      </Text>

      <Text style={styles.text}>
        Future updates will include voice mode, reminders, memory, and personalization.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16
  },
  text: {
    color: '#d6d3d1',
    lineHeight: 22,
    marginBottom: 12
  }
});

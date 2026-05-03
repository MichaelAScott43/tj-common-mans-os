import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help?</Text>

      <Text style={styles.text}>
        Steady is built to help hard-working people carry life a little easier.
      </Text>

      <Text style={styles.text}>
        If you are experiencing an emergency, contact emergency services or a licensed professional immediately.
      </Text>

      <Text style={styles.text}>
        You do not have to carry everything alone.
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
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 14
  },
  text: {
    color: '#d6d3d1',
    lineHeight: 22,
    marginBottom: 12
  }
});

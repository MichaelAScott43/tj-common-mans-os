import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function CharacterSwitcher({ activeCharacter, onSwitch }) {
  return (
    <View style={styles.wrapper}>
      <Pressable
        style={[styles.card, activeCharacter === 'TJ' && styles.activeTJ]}
        onPress={() => onSwitch('TJ')}
      >
        <Text style={styles.name}>TJ</Text>
        <Text style={styles.description}>
          Practical sidekick for errands, organization, reminders, and real-life problem solving.
        </Text>
      </Pressable>

      <Pressable
        style={[styles.card, activeCharacter === 'Arlane' && styles.activeArlane]}
        onPress={() => onSwitch('Arlane')}
      >
        <Text style={styles.name}>Arlane</Text>
        <Text style={styles.description}>
          Calm emotional grounding, encouragement, and support when life feels heavy.
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#59301d',
    borderRadius: 14,
    backgroundColor: '#120d0a',
    padding: 12
  },
  activeTJ: {
    borderColor: '#fb923c',
    backgroundColor: '#2a160d'
  },
  activeArlane: {
    borderColor: '#93c5fd',
    backgroundColor: '#131b27'
  },
  name: {
    color: '#fff7ed',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 6
  },
  description: {
    color: '#d6d3d1',
    fontSize: 12,
    lineHeight: 18
  }
});

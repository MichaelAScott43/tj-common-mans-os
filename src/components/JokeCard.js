/**
 * JokeCard – displays the "Daily Spark" humor card to lighten the mood.
 * The joke rotates daily; user can tap for a random one.
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getTodaysJoke, getRandomJoke } from '../constants/jokes';
import { Colors } from '../constants/colors';

export default function JokeCard() {
  const { t } = useTranslation();
  const [joke, setJoke] = useState(getTodaysJoke());

  return (
    <View style={styles.card}>
      <Text style={styles.header}>{t('home.dailySpark')}</Text>
      <Text style={styles.setup}>{joke.setup}</Text>
      <Text style={styles.punchline}>{joke.punchline}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setJoke(getRandomJoke())}
        accessibilityLabel={t('home.newJoke')}
      >
        <Text style={styles.buttonText}>{t('home.newJoke')} 😄</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.teal,
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  setup: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 22,
  },
  punchline: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 13,
    color: Colors.teal,
    fontWeight: '600',
  },
});

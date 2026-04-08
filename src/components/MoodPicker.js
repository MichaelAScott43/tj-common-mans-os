/**
 * MoodPicker – 1-5 emoji/color mood scale for daily check-ins.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

const MOODS = [
  { score: 1, emoji: '😔', color: Colors.mood1 },
  { score: 2, emoji: '😟', color: Colors.mood2 },
  { score: 3, emoji: '😐', color: Colors.mood3 },
  { score: 4, emoji: '🙂', color: Colors.mood4 },
  { score: 5, emoji: '😊', color: Colors.mood5 },
];

export default function MoodPicker({ value, onChange }) {
  const { t } = useTranslation();

  const moodLabels = [
    t('mood.scale1'),
    t('mood.scale2'),
    t('mood.scale3'),
    t('mood.scale4'),
    t('mood.scale5'),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{t('home.checkIn')}</Text>
      <View style={styles.row}>
        {MOODS.map((mood) => {
          const selected = value === mood.score;
          return (
            <TouchableOpacity
              key={mood.score}
              style={[
                styles.moodButton,
                { borderColor: mood.color },
                selected && { backgroundColor: mood.color },
              ]}
              onPress={() => onChange(mood.score)}
              accessibilityLabel={moodLabels[mood.score - 1]}
              accessibilityState={{ selected }}
            >
              <Text style={styles.emoji}>{mood.emoji}</Text>
              <Text
                style={[styles.label, { color: selected ? Colors.textLight : mood.color }]}
                numberOfLines={1}
              >
                {mood.score}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {value !== null && value !== undefined && (
        <Text style={styles.selectedLabel}>{moodLabels[value - 1]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  selectedLabel: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

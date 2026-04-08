/**
 * CrisisButton – prominent "Help Now" emergency button.
 * Always visible; navigates to the Crisis screen.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';

export default function CrisisButton({ onPress, compact = false }) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compact}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={t('home.helpNow')}
        accessibilityHint="Opens crisis resources and hotlines"
      >
        <Text style={styles.compactText}>🆘 {t('home.helpNow')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('home.helpNow')}
      accessibilityHint="Opens crisis resources and hotlines"
    >
      <View style={styles.inner}>
        <Text style={styles.icon}>🆘</Text>
        <View>
          <Text style={styles.label}>{t('home.helpNow')}</Text>
          <Text style={styles.sublabel}>{t('crisis.subtitle')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.crisis,
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
    shadowColor: Colors.crisis,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  sublabel: {
    fontSize: 12,
    color: Colors.textLight,
    opacity: 0.85,
    marginTop: 2,
  },
  compact: {
    backgroundColor: Colors.crisis,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  compactText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 14,
  },
});

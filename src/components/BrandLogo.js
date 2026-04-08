/**
 * BrandLogo – displays the Steady wordmark + "Powered by Spark AI" tagline
 * and optionally the brand attribution (LoudMouth Mike Labs).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

export default function BrandLogo({
  size = 'large',   // 'large' | 'medium' | 'small'
  light = true,     // true = white text (for dark backgrounds)
  showBrand = true, // show the "LoudMouth Mike Labs" line
}) {
  const textColor = light ? Colors.textLight : Colors.navyDeep;
  const accentColor = light ? Colors.tealLight : Colors.teal;

  const sizes = {
    large:  { title: 52, tagline: 17, brand: 12 },
    medium: { title: 32, tagline: 13, brand: 11 },
    small:  { title: 22, tagline: 10, brand: 9 },
  };

  const s = sizes[size] ?? sizes.large;

  return (
    <View style={styles.container}>
      {/* Diamond accent mark */}
      <View style={[styles.diamond, { borderColor: accentColor }]} />

      {/* App name */}
      <Text
        style={[styles.title, { color: textColor, fontSize: s.title }]}
        accessibilityRole="header"
      >
        STEADY
      </Text>

      {/* Tagline */}
      <View style={styles.taglineRow}>
        <View style={[styles.taglineLine, { backgroundColor: accentColor }]} />
        <Text style={[styles.tagline, { color: accentColor, fontSize: s.tagline }]}>
          Powered by Spark AI
        </Text>
        <View style={[styles.taglineLine, { backgroundColor: accentColor }]} />
      </View>

      {/* Brand attribution */}
      {showBrand && (
        <Text style={[styles.brand, { color: textColor, fontSize: s.brand, opacity: 0.6 }]}>
          A LoudMouth Mike Labs Product
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  diamond: {
    width: 10,
    height: 10,
    borderWidth: 1.5,
    transform: [{ rotate: '45deg' }],
    marginBottom: 8,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 8,
    textAlign: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  taglineLine: {
    height: 1,
    width: 24,
    opacity: 0.7,
  },
  tagline: {
    fontWeight: '500',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  brand: {
    marginTop: 8,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});

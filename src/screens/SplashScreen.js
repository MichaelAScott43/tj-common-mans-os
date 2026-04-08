/**
 * SplashScreen – static landing page.
 *
 * Shows:
 *   - Soothing road SVG illustration
 *   - STEADY wordmark
 *   - "Powered by Spark AI" tagline
 *   - LoudMouth Mike Labs brand attribution
 *
 * Auto-advances after 2.8 s or on user tap.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import RoadScene from '../components/RoadScene';
import BrandLogo from '../components/BrandLogo';
import { Colors } from '../constants/colors';
import { loadPrefs } from '../utils/secureStorage';

export default function SplashScreen({ navigation }) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const timer = setTimeout(advance, 2800);
    return () => clearTimeout(timer);
  }, []);

  async function advance() {
    const prefs = await loadPrefs();
    if (prefs.onboardingDone && prefs.consentGiven) {
      navigation.replace('Main');
    } else {
      navigation.replace('Onboarding');
    }
  }

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={1}
      onPress={advance}
      accessibilityLabel="Steady app splash screen. Tap to continue."
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDeep} />

      {/* Top: deep navy sky area with branding */}
      <View style={styles.top}>
        <BrandLogo size="large" light showBrand />
      </View>

      {/* Road illustration */}
      <View style={styles.roadWrapper}>
        <RoadScene width={width} height={260} />
      </View>

      {/* Bottom strip */}
      <View style={styles.bottom}>
        <Text style={styles.subtitle}>{t('splash.subtitle')}</Text>
        <View style={styles.tapHint}>
          <View style={styles.tapLine} />
          <Text style={styles.tapText}>tap to begin</Text>
          <View style={styles.tapLine} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navyDeep,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  roadWrapper: {
    width: '100%',
  },
  bottom: {
    flex: 0,
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: Colors.navyDeep,
  },
  subtitle: {
    color: Colors.textLight,
    fontSize: 15,
    opacity: 0.75,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tapLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.tealLight,
    opacity: 0.4,
  },
  tapText: {
    color: Colors.tealLight,
    fontSize: 12,
    opacity: 0.6,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

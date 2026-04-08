/**
 * HomeScreen – main dashboard.
 *
 * Features:
 *   - Greeting by time of day
 *   - Daily mood check-in (1-5 scale)
 *   - Daily Spark humor card
 *   - Help Now crisis button (always visible)
 *   - Quick-action tiles: Chat, Journal, Breathe, Mood History
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import MoodPicker from '../components/MoodPicker';
import JokeCard from '../components/JokeCard';
import CrisisButton from '../components/CrisisButton';
import { saveMoodEntry, loadPrefs } from '../utils/secureStorage';
import { SessionManager } from '../utils/sessionManager';

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [moodScore, setMoodScore] = useState(null);
  const [moodSaved, setMoodSaved] = useState(false);
  const [veteranMode, setVeteranMode] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadPrefs().then((p) => setVeteranMode(p?.veteranMode ?? false));
      SessionManager.touch();
    }, [])
  );

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greeting_morning');
    if (hour < 17) return t('home.greeting_afternoon');
    return t('home.greeting_evening');
  }

  async function handleMoodSave(score) {
    setMoodScore(score);
    await saveMoodEntry({ score, note: '' });
    setMoodSaved(true);
    setTimeout(() => setMoodSaved(false), 3000);
  }

  const quickActions = [
    {
      key: 'chat',
      label: t('home.chat'),
      icon: '💬',
      screen: 'Chat',
      color: Colors.teal,
    },
    {
      key: 'journal',
      label: t('home.journal'),
      icon: '📓',
      screen: 'Journal',
      color: Colors.navyMid,
    },
    {
      key: 'breathe',
      label: t('home.breathe'),
      icon: '🌬️',
      screen: 'Breathing',
      color: '#5A9E6F',
    },
    {
      key: 'mood',
      label: t('home.moodHistory'),
      icon: '📈',
      screen: 'MoodTrack',
      color: '#9B6BBA',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDeep} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          {veteranMode && (
            <Text style={styles.veteranBadge}>🎖 Veteran Mode</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          accessibilityLabel="Settings"
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={() => SessionManager.touch()}
      >
        {/* Crisis button — always at top */}
        <CrisisButton onPress={() => navigation.navigate('Crisis')} />

        {/* Mood check-in */}
        <MoodPicker
          value={moodScore}
          onChange={handleMoodSave}
        />
        {moodSaved && (
          <Text style={styles.savedBanner}>{t('home.checkInSaved')} ✓</Text>
        )}

        {/* Quick actions */}
        <Text style={styles.sectionLabel}>{t('home.quickActions')}</Text>
        <View style={styles.actions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.key}
              style={[styles.actionTile, { borderTopColor: action.color }]}
              onPress={() => navigation.navigate(action.screen)}
              accessibilityLabel={action.label}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Spark joke */}
        <JokeCard />

        {/* Disclaimer */}
        <Text style={styles.disclaimer}>{t('app.notTherapy')}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navyDeep,
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textLight,
  },
  veteranBadge: {
    color: Colors.tealLight,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  settingsIcon: { fontSize: 22 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  savedBanner: {
    textAlign: 'center',
    color: Colors.success,
    fontSize: 13,
    fontWeight: '600',
    marginTop: -4,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionTile: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: { fontSize: 28, marginBottom: 8 },
  actionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 20,
    fontStyle: 'italic',
    paddingHorizontal: 16,
  },
});

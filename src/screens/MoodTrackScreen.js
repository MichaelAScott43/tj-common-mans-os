/**
 * MoodTrackScreen – visualizes the user's mood history over 14 days.
 * Uses simple bar-chart rendered with View primitives (no extra chart library).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { loadMoodHistory } from '../utils/secureStorage';
import { SessionManager } from '../utils/sessionManager';

const MOOD_COLORS = [null, Colors.mood1, Colors.mood2, Colors.mood3, Colors.mood4, Colors.mood5];
const MOOD_EMOJIS = ['', '😔', '😟', '😐', '🙂', '😊'];

export default function MoodTrackScreen({ navigation }) {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadMoodHistory().then(setHistory);
      SessionManager.touch();
    }, [])
  );

  // Build last-14-days buckets
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    return d.toDateString();
  });

  const dailyMap = {};
  history.forEach((entry) => {
    const day = new Date(entry.timestamp).toDateString();
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(entry.score);
  });

  const chartData = days.map((day) => {
    const scores = dailyMap[day];
    if (!scores || scores.length === 0) return { day, avg: null };
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return { day, avg: Math.round(avg) };
  });

  // Trend calculation
  const filled = chartData.filter((d) => d.avg !== null);
  const trend =
    filled.length >= 2
      ? filled[filled.length - 1].avg - filled[0].avg
      : null;

  const moodLabels = [
    t('mood.scale1'),
    t('mood.scale2'),
    t('mood.scale3'),
    t('mood.scale4'),
    t('mood.scale5'),
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDeep} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('mood.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Trend summary */}
        {trend !== null && (
          <View style={styles.trendCard}>
            <Text style={styles.trendLabel}>{t('mood.trend')}</Text>
            <Text style={styles.trendValue}>
              {trend > 0 ? '📈 Improving' : trend < 0 ? '📉 Declining' : '➡️ Steady'}
            </Text>
          </View>
        )}

        {/* Bar chart */}
        <Text style={styles.chartTitle}>{t('mood.history')}</Text>
        <View style={styles.chart}>
          {chartData.map((item, idx) => {
            const barH = item.avg ? (item.avg / 5) * 120 : 4;
            const color = item.avg ? MOOD_COLORS[item.avg] : Colors.border;
            const shortDay = new Date(item.day).toLocaleDateString(undefined, {
              weekday: 'narrow',
            });
            return (
              <View key={idx} style={styles.bar}>
                <Text style={styles.barEmoji}>
                  {item.avg ? MOOD_EMOJIS[item.avg] : ''}
                </Text>
                <View style={styles.barTrack}>
                  <View
                    style={[styles.barFill, { height: barH, backgroundColor: color }]}
                  />
                </View>
                <Text style={styles.barLabel}>{shortDay}</Text>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[1, 2, 3, 4, 5].map((score) => (
            <View key={score} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: MOOD_COLORS[score] }]} />
              <Text style={styles.legendText}>{moodLabels[score - 1]}</Text>
            </View>
          ))}
        </View>

        {history.length === 0 && (
          <Text style={styles.emptyText}>{t('mood.noData')}</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.navyDeep,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: { color: Colors.textLight, fontSize: 22, width: 32 },
  headerTitle: { color: Colors.textLight, fontSize: 18, fontWeight: '700' },
  content: { padding: 20, paddingBottom: 40 },
  trendCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  trendLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  trendValue: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  bar: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barEmoji: { fontSize: 10 },
  barTrack: {
    width: 14,
    height: 120,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },
  legend: { gap: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, color: Colors.textSecondary },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 40,
    fontSize: 14,
    fontStyle: 'italic',
  },
});

/**
 * CrisisScreen – crisis resources, country-aware, veteran mode aware.
 * All data is stored locally (no network needed) so it works offline.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import { CrisisResources, CountryList } from '../constants/crisis';
import { loadPrefs } from '../utils/secureStorage';

export default function CrisisScreen({ navigation }) {
  const { t } = useTranslation();
  const [country, setCountry] = useState('US');
  const [veteranMode, setVeteranMode] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'veteran'

  useEffect(() => {
    loadPrefs().then((p) => {
      setCountry(p?.country ?? 'US');
      setVeteranMode(p?.veteranMode ?? false);
    });
  }, []);

  const resources = CrisisResources[country] ?? CrisisResources.GLOBAL;
  const globalResources = CrisisResources.GLOBAL;

  const filteredLines =
    filter === 'veteran'
      ? resources.lines.filter((l) => l.veteran)
      : resources.lines;

  async function handleCall(number) {
    const url = `tel:${number.replace(/[^0-9+]/g, '')}`;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      Alert.alert('Call ' + number);
    }
  }

  async function handleUrl(url) {
    if (!url) return;
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) Linking.openURL(url);
  }

  function CrisisLine({ line }) {
    return (
      <View style={styles.lineCard}>
        <View style={styles.lineHeader}>
          <Text style={styles.lineLabel}>{line.label}</Text>
          {line.veteran && (
            <View style={styles.veteranBadge}>
              <Text style={styles.veteranBadgeText}>🎖 Veteran</Text>
            </View>
          )}
        </View>

        <View style={styles.lineActions}>
          {line.number && (
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => handleCall(line.number)}
              accessibilityLabel={`${t('crisis.callNow')} ${line.label}`}
            >
              <Text style={styles.callBtnText}>📞 {line.number}</Text>
            </TouchableOpacity>
          )}
          {line.text && (
            <View style={styles.textInfo}>
              <Text style={styles.textInfoLabel}>💬 {line.text}</Text>
            </View>
          )}
          {line.url && (
            <TouchableOpacity
              style={styles.urlBtn}
              onPress={() => handleUrl(line.url)}
              accessibilityLabel={`${t('crisis.visitSite')} ${line.label}`}
            >
              <Text style={styles.urlBtnText}>🌐 {t('crisis.visitSite')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.crisis} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>{t('crisis.title')}</Text>
          <Text style={styles.headerSub}>{t('crisis.subtitle')}</Text>
        </View>
      </View>

      {/* Emergency reminder */}
      <View style={styles.emergencyBanner}>
        <Text style={styles.emergencyText}>{t('crisis.reminder')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Country selector */}
        <Text style={styles.sectionLabel}>Resources for</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.countryRow}
          style={{ marginBottom: 16 }}
        >
          {CountryList.map((c) => (
            <TouchableOpacity
              key={c.code}
              style={[styles.countryChip, country === c.code && styles.chipSelected]}
              onPress={() => setCountry(c.code)}
            >
              <Text style={[styles.chipText, country === c.code && styles.chipTextSelected]}>
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter tabs */}
        {veteranMode && (
          <View style={styles.tabs}>
            {['all', 'veteran'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, filter === tab && styles.tabActive]}
                onPress={() => setFilter(tab)}
              >
                <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
                  {tab === 'all' ? t('crisis.allResources') : t('crisis.veteranOnly')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Resource lines */}
        <Text style={styles.sectionLabel}>{resources.name}</Text>
        {filteredLines.length === 0 ? (
          <Text style={styles.noResources}>
            No veteran-specific resources listed for this country yet.
            See All Resources for general crisis lines.
          </Text>
        ) : (
          filteredLines.map((line, i) => <CrisisLine key={i} line={line} />)
        )}

        {/* Global resources */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
          🌍 {globalResources.name}
        </Text>
        {globalResources.lines.map((line, i) => <CrisisLine key={i} line={line} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.crisis,
    paddingTop: 56,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  back: { color: Colors.textLight, fontSize: 22, width: 32 },
  headerTitle: { color: Colors.textLight, fontSize: 20, fontWeight: '800' },
  headerSub: { color: Colors.textLight, fontSize: 12, opacity: 0.85, marginTop: 2 },
  emergencyBanner: {
    backgroundColor: Colors.crisisBg,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FEB2B2',
  },
  emergencyText: {
    color: Colors.crisis,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  content: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  countryRow: { flexDirection: 'row', gap: 8 },
  countryChip: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipSelected: { borderColor: Colors.crisis, backgroundColor: Colors.crisisBg },
  chipText: { fontSize: 12, color: Colors.textSecondary },
  chipTextSelected: { color: Colors.crisis, fontWeight: '700' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 3,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: Colors.surface },
  tabText: { fontSize: 13, color: Colors.textMuted },
  tabTextActive: { color: Colors.crisis, fontWeight: '700' },
  lineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: Colors.crisis,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  lineLabel: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, flex: 1 },
  veteranBadge: {
    backgroundColor: '#EBF4FF',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  veteranBadgeText: { fontSize: 10, fontWeight: '700', color: '#2B6CB0' },
  lineActions: { gap: 6 },
  callBtn: {
    backgroundColor: Colors.crisis,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  callBtnText: { color: Colors.textLight, fontSize: 14, fontWeight: '700' },
  textInfo: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  textInfoLabel: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  urlBtn: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  urlBtnText: { color: Colors.textSecondary, fontSize: 13, fontWeight: '600' },
  noResources: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 16,
  },
});

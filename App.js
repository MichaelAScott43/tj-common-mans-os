import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Pressable, StyleSheet, Switch, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { personalityModes, defaultPersonalitySettings } from './src/config/personalityPromptConfig';
import {
  demoDailyBriefing,
  demoIntegrations,
  demoNotes,
  demoOpportunities,
  demoSocialFollowUps,
  demoTasks,
  demoUser
} from './src/data/demoData';
import { detectCrisisLanguage, generateDailyPlan, getEmergencyPrompt } from './src/services/aiService';

const tabs = ['Landing', 'Dashboard', 'Tasks', 'Opportunities', 'Notes', 'Integrations', 'Personality', 'Work', 'Privacy'];

const card = {
  backgroundColor: '#0f172a',
  borderColor: '#1e293b',
  borderWidth: 1,
  borderRadius: 16,
  padding: 14,
  marginBottom: 10
};

export default function App() {
  const [tab, setTab] = useState('Landing');
  const [integrations, setIntegrations] = useState(demoIntegrations);
  const [personality, setPersonality] = useState(defaultPersonalitySettings);
  const [previewText, setPreviewText] = useState('Need help planning today without burnout.');

  const planned = useMemo(() => generateDailyPlan({ briefing: demoDailyBriefing, personalitySettings: personality }), [personality]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>STEADY</Text>
          <Text style={styles.title}>Life Operations OS</Text>
        </View>
        <Text style={styles.muted}>{demoUser.name} · {demoUser.mode}</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 90 }}>
        {tab === 'Landing' && <Landing />}
        {tab === 'Dashboard' && <Dashboard planned={planned} />}
        {tab === 'Tasks' && <DataList title="Tasks + Reminders" rows={demoTasks} labelKey="title" />}
        {tab === 'Opportunities' && <DataList title="Opportunity Tracker" rows={demoOpportunities} labelKey="name" />}
        {tab === 'Notes' && (
          <>
            <DataList title="Notes + Memory" rows={demoNotes} labelKey="text" />
            <DataList title="Manual Social Follow-ups" rows={demoSocialFollowUps} labelKey="name" />
          </>
        )}
        {tab === 'Integrations' && (
          <View style={card}>
            <Text style={styles.sectionTitle}>INTEGRATIONS ARCHITECTURE</Text>
            <Text style={styles.text}>Mock/demo integrations keep base app functional without live API credentials.</Text>
            {integrations.map((item) => (
              <View key={item.id} style={styles.rowBetween}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textStrong}>{item.label}</Text>
                  <Text style={styles.muted}>{item.mode.toUpperCase()} · {item.connected ? 'Connected (metadata only)' : 'Not connected'}</Text>
                </View>
                <Pressable onPress={() => setIntegrations((prev) => prev.map((row) => row.id === item.id ? { ...row, connected: !row.connected } : row))} style={styles.btnAlt}>
                  <Text style={styles.btnAltText}>{item.connected ? 'Disconnect' : 'Connect'}</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
        {tab === 'Personality' && (
          <View style={card}>
            <Text style={styles.sectionTitle}>AI PERSONALITY ENGINE</Text>
            <Text style={styles.text}>Personalities modify voice and style while core planning logic remains unchanged.</Text>
            {Object.entries(personalityModes).map(([key, mode]) => (
              <Pressable key={key} onPress={() => setPersonality((prev) => ({ ...prev, mode: key }))} style={[styles.option, personality.mode === key && styles.optionActive]}>
                <Text style={styles.textStrong}>{mode.label}</Text>
              </Pressable>
            ))}
            <View style={styles.rowBetween}>
              <Text style={styles.text}>Companion features</Text>
              <Switch value={personality.companionFeaturesEnabled} onValueChange={(v) => setPersonality((prev) => ({ ...prev, companionFeaturesEnabled: v }))} />
            </View>
            {personality.mode === 'romantic' && (
              <View style={styles.rowBetween}>
                <Text style={styles.text}>18+ age gate & consent</Text>
                <Switch value={personality.romanticAgeConfirmed} onValueChange={(v) => setPersonality((prev) => ({ ...prev, romanticAgeConfirmed: v }))} />
              </View>
            )}
            <TextInput style={styles.input} value={personality.customPersona.name} onChangeText={(v) => setPersonality((prev) => ({ ...prev, customPersona: { ...prev.customPersona, name: v } }))} placeholder="Custom persona name" placeholderTextColor="#94a3b8" />
            <TextInput style={[styles.input, { minHeight: 90 }]} multiline value={previewText} onChangeText={setPreviewText} placeholder="Preview prompt" placeholderTextColor="#94a3b8" />
            <Text style={[styles.text, { color: detectCrisisLanguage(previewText) ? '#fda4af' : '#93c5fd' }]}>
              {detectCrisisLanguage(previewText) ? getEmergencyPrompt() : personalityModes[personality.mode].systemPrompt}
            </Text>
          </View>
        )}
        {tab === 'Work' && (
          <View style={card}>
            <Text style={styles.sectionTitle}>WORK MODE</Text>
            <Text style={styles.text}>Teams and Office add-in support are scaffolded in /integrations/work and are optional.</Text>
            <Text style={styles.text}>Work data is separated from personal mode by design.</Text>
          </View>
        )}
        {tab === 'Privacy' && (
          <View style={card}>
            <Text style={styles.sectionTitle}>PRIVACY & TRUST</Text>
            {[
              'Steady is user-controlled.',
              'Secure token-based connections with disconnect option.',
              'No sale of personal data.',
              'Personal and work separation.',
              'Minimum necessary data retention.',
              'No hardcoded credentials.'
            ].map((line) => <Text key={line} style={styles.text}>• {line}</Text>)}
            <Text style={[styles.text, { color: '#fda4af', marginTop: 8 }]}>Steady is AI, not human, and not a replacement for emergency care.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.tabBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {tabs.map((item) => (
            <Pressable key={item} onPress={() => setTab(item)} style={[styles.tabBtn, tab === item && styles.tabBtnActive]}>
              <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Landing() {
  return (
    <View style={card}>
      <Text style={styles.sectionTitle}>EXECUTIVE-LEVEL ORGANIZATION FOR EVERYDAY LIFE</Text>
      <Text style={styles.title}>A calm, premium command center for ordinary people.</Text>
      <Text style={styles.text}>Steady helps manage work, family, money, health, opportunities, follow-ups, and personal communications without mental overload.</Text>
    </View>
  );
}

function Dashboard({ planned }) {
  return (
    <>
      <View style={card}>
        <Text style={styles.sectionTitle}>AI DAILY BRIEFING</Text>
        <Text style={styles.text}>{planned.styledBriefing}</Text>
        {planned.top3Priorities.map((p) => <Text key={p} style={styles.text}>• {p}</Text>)}
        <Text style={[styles.text, { marginTop: 6, color: '#93c5fd' }]}>Do this next: {planned.doThisNext}</Text>
      </View>
      <View style={card}>
        <Text style={styles.sectionTitle}>TODAY SNAPSHOT</Text>
        <Text style={styles.text}>Upcoming reminders: {demoTasks.length}</Text>
        <Text style={styles.text}>Follow-ups needed: {demoTasks.filter((t) => t.followUp).length}</Text>
        <Text style={styles.text}>Open opportunities: {demoOpportunities.length}</Text>
        <Text style={styles.text}>Recent notes: {demoNotes.length}</Text>
      </View>
    </>
  );
}

function DataList({ title, rows, labelKey }) {
  return (
    <View style={card}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {rows.length === 0 ? <Text style={styles.muted}>Empty state: add your first record.</Text> : rows.map((row) => (
        <View key={row.id} style={styles.item}>
          <Text style={styles.textStrong}>{String(row[labelKey]).slice(0, 90)}</Text>
          <Text style={styles.muted}>{JSON.stringify(row)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#020617' },
  header: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e293b', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  body: { paddingHorizontal: 10 },
  kicker: { color: '#94a3b8', letterSpacing: 2, fontSize: 11, marginBottom: 2 },
  title: { color: '#e2e8f0', fontWeight: '700', fontSize: 20, marginBottom: 4 },
  sectionTitle: { color: '#94a3b8', fontSize: 11, letterSpacing: 1.2, marginBottom: 8 },
  text: { color: '#cbd5e1', fontSize: 14, marginBottom: 6, lineHeight: 20 },
  textStrong: { color: '#e2e8f0', fontSize: 14, fontWeight: '600', marginBottom: 2 },
  muted: { color: '#94a3b8', fontSize: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 },
  btnAlt: { borderColor: '#1e293b', borderWidth: 1, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 8 },
  btnAltText: { color: '#cbd5e1', fontSize: 12 },
  tabBar: { position: 'absolute', left: 8, right: 8, bottom: 10, borderWidth: 1, borderColor: '#1e293b', borderRadius: 16, padding: 8, backgroundColor: '#0f172a' },
  tabBtn: { borderRadius: 999, paddingVertical: 8, paddingHorizontal: 12, marginRight: 6, borderWidth: 1, borderColor: '#1e293b' },
  tabBtnActive: { borderColor: '#38bdf8', backgroundColor: '#082f49' },
  tabText: { color: '#94a3b8', fontSize: 12 },
  tabTextActive: { color: '#bae6fd' },
  option: { borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 10, marginBottom: 8 },
  optionActive: { borderColor: '#38bdf8', backgroundColor: '#082f49' },
  input: { borderWidth: 1, borderColor: '#1e293b', borderRadius: 10, padding: 10, color: '#e2e8f0', marginBottom: 8 },
  item: { borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 10, marginBottom: 8, backgroundColor: '#0b1224' }
});

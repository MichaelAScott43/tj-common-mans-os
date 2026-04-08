/**
 * JournalScreen – guided journal with rotating prompts.
 * Entries are stored in encrypted secure storage (HIPAA compliant).
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/colors';
import {
  saveJournalEntry,
  loadJournalEntries,
  deleteJournalEntry,
} from '../utils/secureStorage';
import { SessionManager } from '../utils/sessionManager';

function randomId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function JournalScreen({ navigation }) {
  const { t } = useTranslation();
  const prompts = t('journal.prompts', { returnObjects: true });

  const [entries, setEntries] = useState([]);
  const [text, setText] = useState('');
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * prompts.length));
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState('write'); // 'write' | 'history'

  useFocusEffect(
    useCallback(() => {
      loadJournalEntries().then(setEntries);
      SessionManager.touch();
    }, [])
  );

  async function handleSave() {
    if (!text.trim()) return;
    const entry = {
      id: randomId(),
      prompt: prompts[promptIndex],
      text: text.trim(),
    };
    await saveJournalEntry(entry);
    const updated = await loadJournalEntries();
    setEntries(updated);
    setText('');
    setSaved(true);
    setPromptIndex((i) => (i + 1) % prompts.length);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDeleteEntry(id) {
    Alert.alert(t('common.delete'), 'Delete this journal entry?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          await deleteJournalEntry(id);
          setEntries((prev) => prev.filter((e) => e.id !== id));
        },
      },
    ]);
  }

  function renderEntry({ item }) {
    const date = new Date(item.timestamp);
    return (
      <View style={styles.entryCard}>
        <Text style={styles.entryDate}>
          {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
        <Text style={styles.entryPrompt}>"{item.prompt}"</Text>
        <Text style={styles.entryText}>{item.text}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteEntry(item.id)}
          style={styles.deleteBtn}
          accessibilityLabel={t('common.delete')}
        >
          <Text style={styles.deleteBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.navyDeep} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('journal.title')}</Text>
        <TouchableOpacity onPress={() => setView(view === 'write' ? 'history' : 'write')}>
          <Text style={styles.toggleBtn}>
            {view === 'write' ? '📋' : '✏️'}
          </Text>
        </TouchableOpacity>
      </View>

      {view === 'write' ? (
        <View style={styles.writeArea}>
          {/* Prompt */}
          <View style={styles.promptCard}>
            <Text style={styles.promptLabel}>{t('journal.promptLabel')}</Text>
            <Text style={styles.promptText}>{prompts[promptIndex]}</Text>
            <TouchableOpacity
              onPress={() => setPromptIndex((i) => (i + 1) % prompts.length)}
              accessibilityLabel="Next prompt"
            >
              <Text style={styles.nextPrompt}>Different prompt →</Text>
            </TouchableOpacity>
          </View>

          {/* Text input */}
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder="Write here…"
            placeholderTextColor={Colors.textMuted}
            multiline
            onFocus={() => SessionManager.touch()}
          />

          {saved && <Text style={styles.savedMsg}>{t('journal.saved')} ✓</Text>}

          <TouchableOpacity
            style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!text.trim()}
          >
            <Text style={styles.saveBtnText}>{t('journal.save')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>{t('journal.empty')}</Text>
          }
          onScrollBeginDrag={() => SessionManager.touch()}
        />
      )}
    </KeyboardAvoidingView>
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
  toggleBtn: { fontSize: 22 },
  writeArea: { flex: 1, padding: 16 },
  promptCard: {
    backgroundColor: Colors.navyDeep,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  promptLabel: {
    fontSize: 11,
    color: Colors.tealLight,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  promptText: { color: Colors.textLight, fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
  nextPrompt: { color: Colors.tealLight, fontSize: 12, marginTop: 10, fontWeight: '600' },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 24,
    textAlignVertical: 'top',
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  savedMsg: {
    color: Colors.success,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  saveBtn: {
    backgroundColor: Colors.navyDeep,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: Colors.textLight, fontSize: 16, fontWeight: '700' },
  listContent: { padding: 16, paddingBottom: 40 },
  entryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryDate: { fontSize: 11, color: Colors.textMuted, marginBottom: 6 },
  entryPrompt: {
    fontSize: 12,
    color: Colors.teal,
    fontStyle: 'italic',
    marginBottom: 8,
    lineHeight: 18,
  },
  entryText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  deleteBtn: { position: 'absolute', top: 12, right: 12 },
  deleteBtnText: { fontSize: 16 },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 60,
    fontSize: 15,
    fontStyle: 'italic',
  },
});

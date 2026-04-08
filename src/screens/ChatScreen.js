/**
 * ChatScreen – AI talking/chat interface powered by Spark AI.
 *
 * Features:
 *   - Conversational chat UI
 *   - Multi-language (messages sent in the user's chosen language)
 *   - Text-to-speech (read responses aloud via expo-speech)
 *   - Crisis detection: if crisis keywords appear in user input,
 *     the UI surfaces the Help Now button prominently
 *   - Session-aware (touches SessionManager on each interaction)
 *   - No messages are stored in external logs — chat is session-only
 *     (not persisted) to protect privacy
 *
 * NOTE: AI responses currently use a placeholder (mock) implementation.
 * To connect a real AI backend, set EXPO_PUBLIC_SPARK_API_URL and
 * EXPO_PUBLIC_SPARK_API_KEY in your .env file and implement the
 * `callSparkAI` function in src/utils/sparkApi.js.
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Speech from 'expo-speech';
import { Colors } from '../constants/colors';
import CrisisButton from '../components/CrisisButton';
import { SessionManager } from '../utils/sessionManager';

// ─── Crisis keyword detection ──────────────────────────────────────────────
// Intentionally broad to err on the side of caution.
const CRISIS_PATTERNS = [
  /\b(kill\s+myself|end\s+my\s+life|suicide|suicidal|want\s+to\s+die|hurt\s+myself|self.?harm|no\s+reason\s+to\s+live|can't\s+go\s+on)\b/i,
  /\b(me\s+mato|quitarme\s+la\s+vida|suicid|hacerme\s+daño)\b/i, // Spanish
  /\b(me\s+tuer|suicid|me\s+faire\s+du\s+mal)\b/i,               // French
  /\b(me\s+matar|suicid|me\s+machucar)\b/i,                       // Portuguese
];

function detectCrisis(text) {
  return CRISIS_PATTERNS.some((re) => re.test(text));
}

// ─── Mock AI response ──────────────────────────────────────────────────────
// Replace this with a real API call when the backend is ready.
async function mockSparkResponse(userMessage, language) {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

  const responses = {
    en: [
      "I hear you. What you're feeling is valid, and I'm here with you.",
      "That sounds really tough. Can you tell me more about what's going on?",
      "You reached out — that takes courage. I'm listening.",
      "It's okay to not be okay. Let's talk through this together.",
      "Thank you for sharing that. What would feel most helpful right now?",
      "You're not alone in this. One small step at a time.",
    ],
    es: [
      "Te escucho. Lo que sientes es válido y estoy aquí contigo.",
      "Eso suena muy difícil. ¿Puedes contarme más?",
      "Comunicarte tomó valentía. Te estoy escuchando.",
      "Está bien no estar bien. Hablemos juntos.",
    ],
    fr: [
      "Je vous entends. Ce que vous ressentez est valide, et je suis là.",
      "Cela semble vraiment difficile. Pouvez-vous m'en dire plus?",
      "Vous avez tendu la main — cela demande du courage.",
      "Parlons-en ensemble, un pas à la fois.",
    ],
    pt: [
      "Eu te ouço. O que você sente é válido e estou aqui com você.",
      "Isso parece muito difícil. Pode me contar mais?",
      "Você alcançou — isso exige coragem. Estou ouvindo.",
      "Tudo bem não estar bem. Vamos conversar juntos.",
    ],
  };

  const pool = responses[language] ?? responses.en;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ─── Component ─────────────────────────────────────────────────────────────

let messageIdCounter = 0;
function newId() {
  messageIdCounter += 1;
  return String(messageIdCounter);
}

export default function ChatScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [messages, setMessages] = useState([
    {
      id: newId(),
      role: 'assistant',
      text: t('chat.disclaimer'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisVisible, setCrisisVisible] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const listRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      SessionManager.touch();
    }, [])
  );

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    SessionManager.touch();
    setInput('');

    const userMsg = { id: newId(), role: 'user', text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    // Crisis detection
    if (detectCrisis(text)) {
      setCrisisVisible(true);
      const crisisMsg = {
        id: newId(),
        role: 'assistant',
        text: t('chat.crisisDetected'),
        timestamp: new Date(),
        isCrisis: true,
      };
      setMessages((prev) => [...prev, crisisMsg]);
      return;
    }

    setLoading(true);
    try {
      const reply = await mockSparkResponse(text, lang);
      const assistantMsg = {
        id: newId(),
        role: 'assistant',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: newId(), role: 'assistant', text: t('common.error'), timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }

  async function handleSpeak(msg) {
    if (speakingId === msg.id) {
      Speech.stop();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(msg.id);
    Speech.speak(msg.text, {
      language: lang,
      onDone: () => setSpeakingId(null),
      onError: () => setSpeakingId(null),
    });
  }

  function renderMessage({ item }) {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {!isUser && (
          <Text style={styles.bubbleLabel}>Spark AI</Text>
        )}
        <Text
          style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}
        >
          {item.text}
        </Text>
        {!isUser && (
          <TouchableOpacity
            onPress={() => handleSpeak(item)}
            style={styles.speakBtn}
            accessibilityLabel={t('chat.speakResponse')}
          >
            <Text style={styles.speakBtnText}>
              {speakingId === item.id ? '🔇 Stop' : `🔊 ${t('chat.speakResponse')}`}
            </Text>
          </TouchableOpacity>
        )}
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
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Back">
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('chat.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Crisis banner */}
      {crisisVisible && (
        <View style={styles.crisisBanner}>
          <CrisisButton
            compact
            onPress={() => navigation.navigate('Crisis')}
          />
        </View>
      )}

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        onScrollBeginDrag={() => SessionManager.touch()}
      />

      {/* Typing indicator */}
      {loading && (
        <View style={styles.thinkingRow}>
          <ActivityIndicator size="small" color={Colors.teal} />
          <Text style={styles.thinkingText}>{t('chat.thinking')}</Text>
        </View>
      )}

      {/* Input area */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder={t('chat.placeholder')}
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={1000}
          onFocus={() => SessionManager.touch()}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
          accessibilityLabel={t('chat.placeholder')}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim() || loading}
          accessibilityLabel={t('chat.send')}
        >
          <Text style={styles.sendBtnText}>↑</Text>
        </TouchableOpacity>
      </View>
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
  crisisBanner: { padding: 12, backgroundColor: Colors.crisisBg },
  listContent: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  userBubble: {
    backgroundColor: Colors.navyDeep,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: Colors.surface,
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  bubbleLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.teal,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: Colors.textLight },
  aiText: { color: Colors.textPrimary },
  speakBtn: { marginTop: 8, alignSelf: 'flex-start' },
  speakBtnText: { fontSize: 12, color: Colors.teal, fontWeight: '600' },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  thinkingText: { color: Colors.textMuted, fontSize: 13, fontStyle: 'italic' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    maxHeight: 120,
  },
  sendBtn: {
    backgroundColor: Colors.teal,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { color: Colors.textLight, fontSize: 20, fontWeight: '700' },
});

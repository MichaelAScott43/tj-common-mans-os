import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CharacterSwitcher from './src/components/CharacterSwitcher';
import {
  tjWelcomeMessages,
  arlaneWelcomeMessages
} from './src/data/tjWelcomeMessages';

const voiceExamples = [
  'Remind me tomorrow at 3PM to pick up my prescription.',
  'Schedule a dentist appointment for next Friday morning.',
  'I need help organizing my bills this week.',
  'Remind me to call mom after work.'
];

export default function App() {
  const [activeCharacter, setActiveCharacter] = useState('TJ');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: tjWelcomeMessages[0]
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState(
    'Voice assistant ready. Tap the microphone to simulate voice capture.'
  );

  function switchCharacter(character) {
    setActiveCharacter(character);

    const welcome =
      character === 'TJ'
        ? tjWelcomeMessages[Math.floor(Math.random() * tjWelcomeMessages.length)]
        : arlaneWelcomeMessages[Math.floor(Math.random() * arlaneWelcomeMessages.length)];

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: welcome
      }
    ]);
  }

  function buildAssistantReply(userMessage) {
    const lower = userMessage.toLowerCase();

    if (
      lower.includes('remind') ||
      lower.includes('appointment') ||
      lower.includes('schedule')
    ) {
      return 'I captured that request and marked it as a reminder workflow. Calendar syncing and notifications are the next step.';
    }

    return activeCharacter === 'TJ'
      ? 'Got it. Let me help you figure this out one step at a time.'
      : 'Take a breath first. We do not need to solve everything at once.';
  }

  function handleSend(customMessage) {
    const messageToSend = customMessage || input;

    if (!messageToSend.trim()) return;

    const userMessage = messageToSend.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: userMessage
      },
      {
        role: 'assistant',
        text: buildAssistantReply(userMessage)
      }
    ]);

    setInput('');
  }

  function handleVoiceCapture() {
    setIsListening(true);
    setVoiceStatus('Listening for voice command...');

    setTimeout(() => {
      const simulatedTranscript =
        voiceExamples[Math.floor(Math.random() * voiceExamples.length)];

      setInput(simulatedTranscript);
      setVoiceStatus(`Voice captured: "${simulatedTranscript}"`);
      setIsListening(false);
    }, 1500);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.brand}>STEADY</Text>
          <Text style={styles.tagline}>The Common Man OS</Text>
          <Text style={styles.description}>
            AI-powered life navigation for hard-working people.
          </Text>
        </View>

        <CharacterSwitcher
          activeCharacter={activeCharacter}
          onSwitch={switchCharacter}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {activeCharacter === 'TJ' ? 'Talk to TJ' : 'Talk to Arlane'}
          </Text>

          <Text style={styles.sectionDescription}>
            {activeCharacter === 'TJ'
              ? 'TJ helps with reminders, errands, planning, affordability, and everyday life logistics.'
              : 'Arlane provides grounding support, encouragement, and emotional decompression when life feels heavy.'}
          </Text>

          <View style={styles.voiceCard}>
            <Text style={styles.voiceTitle}>Voice Assistant Beta</Text>
            <Text style={styles.voiceDescription}>{voiceStatus}</Text>

            <Pressable
              style={[
                styles.voiceButton,
                isListening ? styles.voiceButtonActive : null
              ]}
              onPress={handleVoiceCapture}
            >
              <Text style={styles.voiceButtonText}>
                {isListening ? 'Listening...' : '🎙 Start Voice Capture'}
              </Text>
            </Pressable>
          </View>

          <View style={styles.chatBox}>
            {messages.slice(-10).map((msg, idx) => (
              <Text
                key={`${idx}-${msg.text}`}
                style={[
                  styles.message,
                  msg.role === 'user'
                    ? styles.userMessage
                    : styles.assistantMessage
                ]}
              >
                {msg.role === 'user' ? 'You: ' : `${activeCharacter}: `}
                {msg.text}
              </Text>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder={
              activeCharacter === 'TJ'
                ? 'Tell TJ what you need help with...'
                : 'Tell Arlane what is weighing on you...'
            }
            placeholderTextColor="#9ca3af"
            value={input}
            onChangeText={setInput}
            multiline
          />

          <Pressable style={styles.button} onPress={() => handleSend()}>
            <Text style={styles.buttonText}>Send</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Planned Smart Features</Text>

          <Text style={styles.feature}>• Voice-to-reminder workflows</Text>
          <Text style={styles.feature}>• Calendar and appointment support</Text>
          <Text style={styles.feature}>• AI life organization assistant</Text>
          <Text style={styles.feature}>• Overwhelm reduction tools</Text>
          <Text style={styles.feature}>• Emotional support mode with Arlane</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Safety</Text>

          <Text style={styles.footerText}>
            Steady is not therapy, healthcare, or crisis intervention.
          </Text>

          <Text style={styles.footerText}>
            Steady exists to support, organize, and simplify life.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#090705'
  },
  container: {
    padding: 16,
    paddingBottom: 60
  },
  heroCard: {
    borderWidth: 1,
    borderColor: '#5a3020',
    borderRadius: 18,
    padding: 18,
    backgroundColor: '#120d0a',
    marginBottom: 16
  },
  brand: {
    color: '#fb923c',
    fontSize: 34,
    fontWeight: '900'
  },
  tagline: {
    color: '#fff7ed',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4
  },
  description: {
    color: '#d6d3d1',
    marginTop: 10,
    lineHeight: 22
  },
  section: {
    borderWidth: 1,
    borderColor: '#4d2a1b',
    borderRadius: 16,
    backgroundColor: '#120d0a',
    padding: 16,
    marginBottom: 14
  },
  sectionTitle: {
    color: '#fff7ed',
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 10
  },
  sectionDescription: {
    color: '#d6d3d1',
    lineHeight: 20,
    marginBottom: 12
  },
  voiceCard: {
    borderWidth: 1,
    borderColor: '#7c2d12',
    borderRadius: 14,
    padding: 14,
    backgroundColor: '#1c0f09',
    marginBottom: 14
  },
  voiceTitle: {
    color: '#fdba74',
    fontWeight: '800',
    fontSize: 18,
    marginBottom: 8
  },
  voiceDescription: {
    color: '#d6d3d1',
    lineHeight: 20,
    marginBottom: 12
  },
  voiceButton: {
    backgroundColor: '#c2410c',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  voiceButtonActive: {
    backgroundColor: '#ea580c'
  },
  voiceButtonText: {
    color: '#fff',
    fontWeight: '800'
  },
  chatBox: {
    borderWidth: 1,
    borderColor: '#59301d',
    borderRadius: 14,
    backgroundColor: '#0f0b08',
    padding: 12,
    minHeight: 220,
    marginBottom: 12
  },
  message: {
    marginBottom: 10,
    lineHeight: 20
  },
  userMessage: {
    color: '#fdba74'
  },
  assistantMessage: {
    color: '#e7e5e4'
  },
  input: {
    borderWidth: 1,
    borderColor: '#5a3020',
    borderRadius: 12,
    color: '#fff',
    padding: 12,
    marginBottom: 12,
    minHeight: 90,
    textAlignVertical: 'top'
  },
  button: {
    backgroundColor: '#ea580c',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: '800'
  },
  feature: {
    color: '#d6d3d1',
    marginBottom: 10,
    lineHeight: 20
  },
  footerText: {
    color: '#a8a29e',
    lineHeight: 20,
    marginBottom: 8
  }
});
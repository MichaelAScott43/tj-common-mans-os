import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet
} from 'react-native';
import { generateResponse } from '../services/aiOrchestrator';

export default function ChatScreen({ activeCharacter = 'TJ' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  function handleSend() {
    if (!input.trim()) return;

    const response = generateResponse({
      character: activeCharacter,
      input
    });

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        text: input
      },
      {
        role: 'assistant',
        text: response
      }
    ]);

    setInput('');
  }

  return (
    <View style={styles.container}>
      {messages.map((msg, idx) => (
        <Text
          key={`${idx}-${msg.text}`}
          style={msg.role === 'user' ? styles.user : styles.assistant}
        >
          {msg.role === 'user' ? 'You: ' : `${activeCharacter}: `}
          {msg.text}
        </Text>
      ))}

      <TextInput
        style={styles.input}
        placeholder="What do you need help with?"
        placeholderTextColor="#9ca3af"
        value={input}
        onChangeText={setInput}
      />

      <Pressable style={styles.button} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10
  },
  user: {
    color: '#fdba74',
    marginBottom: 8
  },
  assistant: {
    color: '#e7e5e4',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#5a3020',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    marginTop: 12,
    marginBottom: 10
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
  }
});

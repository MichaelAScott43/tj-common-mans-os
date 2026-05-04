import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Pressable, TextInput, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech-recognition';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [character, setCharacter] = useState('TJ');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [listening, setListening] = useState(false);

  const agenda = useMemo(() => reminders.filter((r) => r.status === 'pending').slice(0, 3), [reminders]);

  useEffect(() => { Notifications.requestPermissionsAsync(); loadReminders(); }, []);

  async function loadReminders() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reminders`);
      const json = await res.json();
      setReminders(json.reminders || []);
    } catch (e) {}
  }

  async function createReminder(text) {
    const dueAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await fetch(`${API_BASE_URL}/api/reminders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, dueAt, source: 'chat' }) });
    await Notifications.scheduleNotificationAsync({ content: { title: 'STEADY Reminder', body: text }, trigger: null });
    loadReminders();
  }

  async function sendMessage(raw) {
    const text = raw || input;
    if (!text.trim()) return;
    const user = { role: 'user', text };
    setMessages((m) => [...m, user]);
    setInput('');
    let assistantReply = 'Sorry, I hit a snag. Please try again in a second.';
    try {
      const chatRes = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, personality: character })
      });
      if (chatRes.ok) {
        const chatJson = await chatRes.json();
        assistantReply = chatJson.reply || assistantReply;
      }
    } catch (e) {}

    const assistant = { role: 'assistant', text: assistantReply, character };
    setMessages((m) => [...m, assistant]);
    await fetch(`${API_BASE_URL}/api/conversations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) });
    await fetch(`${API_BASE_URL}/api/conversations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(assistant) });
    if (/remind|schedule|appointment|task/i.test(text)) await createReminder(text);
  }

  async function captureVoice() {
    setListening(true);
    try {
      const result = await Speech.startAsync({ lang: 'en-US' });
      const transcript = result?.transcript || 'Remind me to check my schedule tonight';
      setInput(transcript);
    } catch (e) {
      setInput('Remind me tomorrow at 9 AM to call the school.');
    } finally { setListening(false); }
  }

  if (!onboarded) return <SafeAreaView style={styles.safe}><StatusBar style='light' /><View style={styles.card}><Text style={styles.brand}>STEADY</Text><Text style={styles.text}>The Common Man OS</Text><Text style={styles.sub}>Dependable help for busy and overwhelmed lives.</Text><Pressable style={styles.button} onPress={() => setOnboarded(true)}><Text style={styles.buttonText}>Start</Text></Pressable></View></SafeAreaView>;

  return <SafeAreaView style={styles.safe}><StatusBar style='light' /><FlatList ListHeaderComponent={<><View style={styles.card}><Text style={styles.brand}>STEADY</Text><Text style={styles.sub}>Daily Agenda</Text>{agenda.map((r) => <Text key={r._id} style={styles.text}>• {r.text}</Text>)}</View><View style={styles.row}><Pressable style={[styles.pill, character==='TJ'&&styles.pillActive]} onPress={() => setCharacter('TJ')}><Text style={styles.buttonText}>TJ</Text></Pressable><Pressable style={[styles.pill, character==='Arlane'&&styles.pillActive]} onPress={() => setCharacter('Arlane')}><Text style={styles.buttonText}>Arlane</Text></Pressable></View></>} data={messages} keyExtractor={(_,i)=>String(i)} renderItem={({item}) => <Text style={[styles.msg, item.role==='user'?styles.user:styles.assistant]}>{item.role==='user'?'You':'STEADY'}: {item.text}</Text>} ListFooterComponent={<View style={styles.card}><Pressable style={styles.voice} onPress={captureVoice}><Text style={styles.buttonText}>{listening?'Listening...':'🎙 Voice Capture'}</Text></Pressable><TextInput value={input} onChangeText={setInput} placeholder='Tell STEADY what you need...' placeholderTextColor='#a8a29e' style={styles.input} multiline /><Pressable style={styles.button} onPress={()=>sendMessage()}><Text style={styles.buttonText}>Send</Text></Pressable><Text style={styles.sub}>Calendar Integration: placeholder ready for Google/Outlook connectors.</Text></View>} /> </SafeAreaView>;
}

const styles = StyleSheet.create({ safe:{flex:1, backgroundColor:'#0f0a07'}, card:{margin:12,padding:14,borderRadius:14,backgroundColor:'#1a120e'}, brand:{color:'#fb923c',fontSize:32,fontWeight:'900'}, text:{color:'#f5f5f4',marginTop:6}, sub:{color:'#d6d3d1',marginTop:8}, row:{flexDirection:'row',gap:8,marginHorizontal:12}, pill:{flex:1,padding:12,backgroundColor:'#3f1f15',borderRadius:12,alignItems:'center'}, pillActive:{backgroundColor:'#c2410c'}, msg:{marginHorizontal:12,marginTop:8,padding:10,borderRadius:10}, user:{backgroundColor:'#7c2d12',color:'#fff7ed'}, assistant:{backgroundColor:'#292524',color:'#e7e5e4'}, input:{borderWidth:1,borderColor:'#57534e',borderRadius:12,color:'#fff',padding:12,minHeight:88,marginTop:10}, button:{backgroundColor:'#ea580c',padding:14,borderRadius:12,alignItems:'center',marginTop:10}, voice:{backgroundColor:'#9a3412',padding:14,borderRadius:12,alignItems:'center'}, buttonText:{color:'#fff',fontWeight:'800'} });

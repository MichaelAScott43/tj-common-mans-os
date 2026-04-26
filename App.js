import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, Pressable, ActivityIndicator, Linking, Animated, Easing, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';
const USER_ID = 'demo-user';
const pages = ['Landing', 'Chat', 'Tasks', 'Preferences', 'Beta'];

const commandExamples = [
  'TJ, remind me to pay rent Friday.',
  'TJ, order my usual pizza.',
  'TJ, add oil change to my calendar.',
  "TJ, draft a text saying I'm running late."
];

async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': USER_ID,
      ...(options.headers || {})
    }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function App() {
  const { width } = useWindowDimensions();
  const isMobile = width < 860;
  const [page, setPage] = useState('Landing');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Howdy. I am TJ. Talk normal, I handle the annoying part.' }]);
  const [input, setInput] = useState('');
  const [preferences, setPreferences] = useState(null);
  const [betaEmail, setBetaEmail] = useState('');
  const [betaList, setBetaList] = useState([]);

  const pendingTasks = useMemo(() => tasks.filter((x) => x.status === 'pending'), [tasks]);

  async function refresh() {
    try {
      const [taskRes, prefRes] = await Promise.all([api('/api/tj/tasks'), api('/api/tj/preferences')]);
      setTasks(taskRes.tasks || []);
      setPreferences(prefRes.preference || {});
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `Backend issue: ${error.message}` }]);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function sendCommand(text) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const res = await api('/api/tj/command', { method: 'POST', body: JSON.stringify({ commandText: text, source: 'mobile' }) });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.responseForUser }, { role: 'assistant', text: `Next: ${res.nextStep}` }]);
      if ((res.demoLinks || []).length) {
        setMessages((prev) => [...prev, { role: 'assistant', text: `Demo: ${res.demoLinks[0].label}` }]);
      }
      await refresh();
      return { ok: true, data: res };
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `That broke: ${error.message}` }]);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function savePrefs() {
    setLoading(true);
    try {
      const res = await api('/api/tj/preferences', { method: 'POST', body: JSON.stringify(preferences || {}) });
      setPreferences(res.preference);
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Preferences saved. Look at you being organized.' }]);
    } finally {
      setLoading(false);
    }
  }

  async function taskAction(id, action) {
    setLoading(true);
    try {
      await api(`/api/tj/tasks/${id}/${action}`, { method: 'POST' });
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  function joinBeta() {
    if (!betaEmail.includes('@')) return;
    const updated = [...betaList, betaEmail.trim().toLowerCase()];
    setBetaList(updated);
    setBetaEmail('');
    setMessages((prev) => [...prev, { role: 'assistant', text: 'Beta seat saved. You are on the list.' }]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.brand}>TJ - The Common Man&apos;s OS</Text>
        <Text style={styles.tagline}>Talk normal. TJ handles the annoying part.</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 110 }}>
        {page === 'Landing' && <Landing openChat={() => setPage('Chat')} openTasks={() => setPage('Tasks')} sendCommand={sendCommand} isMobile={isMobile} setInput={setInput} />}

        {page === 'Chat' && (
          <Section title="TJ Chat">
            <Text style={styles.text}>Voice input architecture is ready. For MVP we run text-first commands.</Text>
            <View style={styles.examplesWrap}>{commandExamples.map((example) => <Pressable key={example} onPress={() => sendCommand(example)} style={styles.exampleBtn}><Text style={styles.exampleTxt}>{example}</Text></Pressable>)}</View>
            <View style={styles.chatBox}>
              {messages.slice(-12).map((msg, idx) => (
                <Text key={`${idx}-${msg.text}`} style={[styles.msg, msg.role === 'user' ? styles.user : styles.assistant]}>{msg.role === 'user' ? 'You: ' : 'TJ: '}{msg.text}</Text>
              ))}
            </View>
            <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Tell TJ what to handle..." placeholderTextColor="#9ca3af" />
            <View style={styles.row}>
              <Pressable style={styles.cta} onPress={() => sendCommand(input)}><Text style={styles.ctaTxt}>Send</Text></Pressable>
              <Pressable style={styles.alt} onPress={() => setMessages((prev) => [...prev, { role: 'assistant', text: 'Mic input placeholder ready for native speech module.' }])}><Text style={styles.ctaTxt}>Voice Ready</Text></Pressable>
            </View>
          </Section>
        )}

        {page === 'Tasks' && (
          <Section title="Tasks">
            <Text style={styles.text}>Pending confirmations: {pendingTasks.length}</Text>
            {tasks.map((task) => (
              <View key={task.id || task._id} style={styles.card}>
                <Text style={styles.cardTitle}>{task.title}</Text>
                <Text style={styles.text}>{task.intent} · {task.status}</Text>
                {task.vendor ? <Text style={styles.text}>Vendor: {task.vendor}</Text> : null}
                <View style={styles.row}>
                  <Pressable style={styles.cta} onPress={() => taskAction(task.id || task._id, 'confirm')}><Text style={styles.ctaTxt}>Confirm</Text></Pressable>
                  <Pressable style={styles.alt} onPress={() => taskAction(task.id || task._id, 'cancel')}><Text style={styles.ctaTxt}>Cancel</Text></Pressable>
                </View>
              </View>
            ))}
          </Section>
        )}

        {page === 'Preferences' && (
          <Section title="Preferences">
            <Field label="Favorite food order" value={preferences?.favoriteFoodOrder || ''} onChange={(favoriteFoodOrder) => setPreferences((p) => ({ ...p, favoriteFoodOrder }))} />
            <Field label="Preferred pizza vendor" value={preferences?.preferredPizzaVendor || ''} onChange={(preferredPizzaVendor) => setPreferences((p) => ({ ...p, preferredPizzaVendor }))} />
            <Field label="Favorite grocery items (comma-separated)" value={(preferences?.favoriteGroceryItems || []).join(', ')} onChange={(txt) => setPreferences((p) => ({ ...p, favoriteGroceryItems: txt.split(',').map((x) => x.trim()).filter(Boolean) }))} />
            <Field label="Important contacts (comma-separated)" value={(preferences?.importantContacts || []).join(', ')} onChange={(txt) => setPreferences((p) => ({ ...p, importantContacts: txt.split(',').map((x) => x.trim()).filter(Boolean) }))} />
            <Field label="Default reminder time" value={preferences?.defaultReminderTime || ''} onChange={(defaultReminderTime) => setPreferences((p) => ({ ...p, defaultReminderTime }))} />
            <Field label="Tone preference" value={preferences?.tonePreference || ''} onChange={(tonePreference) => setPreferences((p) => ({ ...p, tonePreference }))} />
            <Pressable style={styles.cta} onPress={savePrefs}><Text style={styles.ctaTxt}>Save preferences</Text></Pressable>
          </Section>
        )}

        {page === 'Beta' && (
          <Section title="Join Beta">
            <Text style={styles.text}>Built for real life. Dedicated to the common man.</Text>
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9ca3af" value={betaEmail} onChangeText={setBetaEmail} />
            <Pressable style={styles.cta} onPress={joinBeta}><Text style={styles.ctaTxt}>Join Beta</Text></Pressable>
            <Text style={styles.text}>Beta signups this session: {betaList.length}</Text>
          </Section>
        )}
      </ScrollView>

      {loading ? <ActivityIndicator style={{ position: 'absolute', right: 16, top: 16 }} color="#fb923c" /> : null}

      <View style={styles.nav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pages.map((item) => (
            <Pressable key={item} style={[styles.navBtn, item === page && styles.navActive]} onPress={() => setPage(item)}>
              <Text style={[styles.navTxt, item === page && styles.navTxtActive]}>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Landing({ openChat, openTasks, sendCommand, isMobile, setInput }) {
  const [heroInput, setHeroInput] = useState('');
  const [heroConversation, setHeroConversation] = useState([]);
  const [exampleIndex, setExampleIndex] = useState(0);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.35)).current;

  const examples = [
    'Order my usual pizza',
    'Remind me to pay rent Friday',
    'Draft a text to my wife',
    'Add oil change to my calendar'
  ];

  useEffect(() => {
    const rotator = setInterval(() => setExampleIndex((prev) => (prev + 1) % examples.length), 2600);
    return () => clearInterval(rotator);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0.15, duration: 450, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 450, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.78, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.35, duration: 1600, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();
  }, [cursorOpacity, glowAnim]);

  function demoFallback(userInput) {
    const low = userInput.toLowerCase();
    if (low.includes('pizza') || low.includes('order')) return 'Pepperoni again? Bold strategy. Want me to prep the order?';
    if (low.includes('rent') || low.includes('remind')) return 'Reminder loaded. Future-you can thank current-you on Friday.';
    if (low.includes('text') || low.includes('wife')) return 'Draft ready: “Running late, be there soon.” Want me to queue edits?';
    if (low.includes('calendar') || low.includes('oil')) return 'Got it. Oil change draft added to your pending calendar tasks.';
    return 'I got it. Say it your way and I will translate the chaos into a plan.';
  }

  async function handleHeroSubmit(rawInput) {
    const userInput = rawInput.trim();
    if (!userInput) return;
    setHeroConversation((prev) => [...prev, `You: ${userInput}`]);

    try {
      await sendCommand(userInput);
      setHeroConversation((prev) => [...prev, 'TJ: Got it. Dropping this into your active task flow now.']);
    } catch (_error) {
      setHeroConversation((prev) => [...prev, `TJ: ${demoFallback(userInput)}`]);
    }

    setInput(userInput);
    setHeroInput('');
    setTimeout(() => openChat(), 300);
  }

  return (
    <>
      <Section title="Hero">
        <View style={[styles.heroSplit, isMobile && styles.heroSplitMobile]}>
          <View style={styles.heroLeft}>
            <Text style={styles.hero}>TJ - The Common Man&apos;s OS</Text>
            <Text style={styles.text}>Built for real life. Dedicated to the common man.</Text>
            <Text style={styles.text}>Talk normal. TJ handles the annoying part.</Text>
            <View style={styles.row}>
              <Pressable style={styles.cta} onPress={openChat}><Text style={styles.ctaTxt}>Start Talking to TJ</Text></Pressable>
              <Pressable style={styles.alt} onPress={() => setHeroInput(examples[exampleIndex])}><Text style={styles.ctaTxt}>Watch Demo</Text></Pressable>
            </View>

            <View style={styles.promptCard}>
              <Text style={styles.label}>What do you need handled?</Text>
              <TextInput
                style={styles.input}
                value={heroInput}
                onChangeText={setHeroInput}
                placeholder={examples[exampleIndex]}
                placeholderTextColor="#9ca3af"
              />
              <View style={styles.row}>
                <Pressable style={styles.cta} onPress={() => handleHeroSubmit(heroInput)}><Text style={styles.ctaTxt}>Send to TJ</Text></Pressable>
                <Text style={styles.rotator}>Try: {examples[exampleIndex]}<Animated.Text style={{ opacity: cursorOpacity }}>|</Animated.Text></Text>
              </View>
              {heroConversation.slice(-2).map((line, idx) => <Text key={`${line}-${idx}`} style={styles.text}>{line}</Text>)}
            </View>
          </View>

          <Animated.View style={[styles.heroRight, { opacity: glowAnim }]}> 
            <View style={styles.robotCard}>
              <Text style={styles.robotTitle}>TJ</Text>
              <Text style={styles.text}>Rugged southern robot. Boots up, feet up, one hand on a wrench, one eye on your to-do list.</Text>
              <Text style={styles.text}>Industrial garage/bar glow. Warm light. Zero panic.</Text>
              <Text style={styles.robotQuote}>“I got it.”</Text>
              <Text style={styles.smoke}>~ subtle smoke + neon flicker ambience ~</Text>
            </View>
          </Animated.View>
        </View>
      </Section>

      <Section title="What TJ Does">
        {['Order it.', 'Schedule it.', 'Handle it.', 'Save time.', 'Live better.'].map((x) => <Text key={x} style={styles.text}>• {x}</Text>)}
      </Section>

      <Section title="Just Talk to TJ">
        <Text style={styles.text}>Say it normal. TJ parses intent, drafts a task, and asks for confirmation before anything risky.</Text>
      </Section>

      <Section title="Built Different">
        {['Honest', 'Funny', 'Loyal', 'Private', 'Built for regular people'].map((x) => <Text key={x} style={styles.text}>• {x}</Text>)}
        <View style={styles.row}>
          <Pressable style={styles.cta} onPress={openTasks}><Text style={styles.ctaTxt}>View Tasks</Text></Pressable>
          <Pressable style={styles.alt}><Text style={styles.ctaTxt}>Join Beta</Text></Pressable>
        </View>
      </Section>

      <Section title="Footer">
        <Text style={styles.text}>TJ is an AI assistant, not a human. No therapy roleplay. No manipulative behavior. Just useful help.</Text>
        <Pressable onPress={() => Linking.openURL('https://www.dominos.com')}><Text style={[styles.text, { color: '#fb923c' }]}>Open Domino&apos;s demo link</Text></Pressable>
      </Section>
    </>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      {children}
    </View>
  );
}

function Field({ label, value, onChange }) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholderTextColor="#9ca3af" />
    </>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { borderBottomWidth: 1, borderBottomColor: '#3f3f46', padding: 14 },
  brand: { color: '#fb923c', fontWeight: '700', fontSize: 18 },
  tagline: { color: '#d4d4d8', marginTop: 4 },
  body: { paddingHorizontal: 10 },
  section: { backgroundColor: '#18181b', borderColor: '#3f3f46', borderWidth: 1, borderRadius: 14, padding: 12, marginVertical: 6 },
  sectionTitle: { color: '#a1a1aa', fontSize: 11, letterSpacing: 1, marginBottom: 8 },
  heroSplit: { flexDirection: 'row', gap: 12, alignItems: 'stretch' },
  heroSplitMobile: { flexDirection: 'column' },
  heroLeft: { flex: 1.2 },
  heroRight: { flex: 1, justifyContent: 'center' },
  hero: { color: '#fff7ed', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  promptCard: { borderWidth: 1, borderColor: '#52525b', borderRadius: 12, padding: 10, marginTop: 10, backgroundColor: '#111113' },
  rotator: { color: '#fdba74', flex: 1, paddingTop: 9, paddingLeft: 4, fontSize: 12 },
  robotCard: { borderWidth: 1, borderColor: '#7c2d12', backgroundColor: '#27180f', borderRadius: 14, padding: 12, minHeight: 215 },
  robotTitle: { color: '#fb923c', fontSize: 22, fontWeight: '800', marginBottom: 6 },
  robotQuote: { color: '#fed7aa', fontSize: 22, fontWeight: '700', marginTop: 10 },
  smoke: { color: '#a1a1aa', fontSize: 12, marginTop: 8, fontStyle: 'italic' },
  text: { color: '#e4e4e7', marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 6 },
  cta: { backgroundColor: '#ea580c', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  alt: { backgroundColor: '#3f3f46', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12 },
  ctaTxt: { color: 'white', fontWeight: '700' },
  chatBox: { borderWidth: 1, borderColor: '#3f3f46', borderRadius: 10, padding: 10, backgroundColor: '#09090b', maxHeight: 280 },
  msg: { marginBottom: 8 },
  user: { color: '#fdba74' },
  assistant: { color: '#d4d4d8' },
  examplesWrap: { marginBottom: 8 },
  exampleBtn: { padding: 8, borderWidth: 1, borderColor: '#3f3f46', borderRadius: 10, marginBottom: 6 },
  exampleTxt: { color: '#d4d4d8', fontSize: 12 },
  card: { borderWidth: 1, borderColor: '#3f3f46', borderRadius: 10, padding: 10, marginBottom: 8 },
  cardTitle: { color: '#fff', fontWeight: '700' },
  label: { color: '#fed7aa', fontSize: 12, marginTop: 6, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#52525b', borderRadius: 10, color: '#fff', padding: 10, marginBottom: 8 },
  nav: { position: 'absolute', left: 8, right: 8, bottom: 8, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#3f3f46', borderRadius: 12, padding: 8 },
  navBtn: { borderWidth: 1, borderColor: '#3f3f46', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, marginRight: 6 },
  navActive: { borderColor: '#fb923c', backgroundColor: '#431407' },
  navTxt: { color: '#a1a1aa', fontSize: 12 },
  navTxtActive: { color: '#fdba74' }
});

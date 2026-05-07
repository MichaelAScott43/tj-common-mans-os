import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  Briefcase,
  Calendar,
  CircleDollarSign,
  Compass,
  HeartPulse,
  Home,
  Landmark,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Target,
  UserRound
} from 'lucide-react';
import './styles/app.css';

const nav = [
  ['Life Hub', Home],['Career Center', Briefcase],['Financial Recovery', Landmark],['Funding Finder', CircleDollarSign],['Mental Wellness', HeartPulse],['Family Planner', Calendar],['AI Companion', Brain],['Secure Vault', Lock],['Daily Focus', Target],['Email + Calendar Sync', Mail],['Settings', Shield]
];

const cardAnim = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };

function GlassCard({ title, children, icon: Icon }) {
  return <motion.article {...cardAnim} transition={{ duration: 0.4 }} className="glass-card"><h3>{Icon && <Icon size={16} />} {title}</h3>{children}</motion.article>;
}

export default function App() {
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState('Life Hub');
  const [phase, setPhase] = useState(0);
  const [messages, setMessages] = useState([{ role: 'tj', text: 'Let’s stabilize your next 24 hours with one practical move.' }]);
  const [input, setInput] = useState('');
  const trust = useMemo(() => ['Private by design', 'Built for real life', 'Human-centered AI'], []);

  if (!authed) return (
    <div className="auth-wrap">
      <div className="ambient" />
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="auth-card">
        <p className="kicker">Steady • Life Operating System</p>
        <h1>Life is hard enough. Steady helps carry the weight.</h1>
        <p>An AI-powered life operating system for everyday people navigating work, finances, stress, family, and growth.</p>
        <div className="auth-actions"><button onClick={() => setPhase((p) => Math.min(2, p + 1))}>Start Onboarding</button><button className="ghost" onClick={() => setAuthed(true)}>Login</button></div>
        <div className="trust">{trust.map((t) => <span key={t}>{t}</span>)}</div>
        <div className="onboarding"><span className={phase >= 0 ? 'dot on' : 'dot'} /><span className={phase >= 1 ? 'dot on' : 'dot'} /><span className={phase >= 2 ? 'dot on' : 'dot'} /></div>
      </motion.section>
    </div>
  );

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((m) => [...m, { role: 'user', text: input }, { role: 'arlane', text: 'I hear you. Let’s choose one calming, doable action next.' }]);
    setInput('');
  };

  return <div className="os-shell">
    <aside>
      <div className="brand"><Sparkles size={16} /> STEADY</div>
      {nav.map(([label, Icon]) => <button key={label} className={active === label ? 'active' : ''} onClick={() => setActive(label)}><Icon size={16} /> {label}</button>)}
    </aside>
    <main>
      <header><div><p className="kicker">Executive Mode</p><h2>{active}</h2></div><div className="avatars"><span>TJ</span><span>AR</span><span><UserRound size={16} /></span></div></header>
      <section className="hero">
        <motion.div className="hero-bg" animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }} transition={{ duration: 18, repeat: Infinity, repeatType: 'reverse' }} />
        <h1>Life is hard enough. Steady helps carry the weight.</h1>
        <p>An AI-powered life operating system for everyday people navigating work, finances, stress, family, and growth.</p>
      </section>
      <AnimatePresence mode="wait">
        <motion.section key={active} className="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <GlassCard title="TJ Companion" icon={Compass}><p>Grounded, practical, calm. <span className="pulse" /> thinking...</p></GlassCard>
          <GlassCard title="Arlane Companion" icon={HeartPulse}><p>Warm and empathetic. <span className="typing">typing...</span></p></GlassCard>
          <GlassCard title="Daily Planner" icon={Calendar}><div className="skeleton" /><div className="skeleton short" /></GlassCard>
          <GlassCard title="Recovery Score" icon={Landmark}><div className="bar"><i style={{ width: '72%' }} /></div></GlassCard>
          <GlassCard title="Career + Resume" icon={Briefcase}><p>Resume optimization, job tracker, interview prep.</p></GlassCard>
          <GlassCard title="Funding Opportunities" icon={CircleDollarSign}><p>Relief grants, vouchers, and aid alerts personalized daily.</p></GlassCard>
          {active === 'AI Companion' && <GlassCard title="Conversation" icon={Brain}><div className="chat">{messages.map((m, i) => <p key={i}><b>{m.role}:</b> {m.text}</p>)}</div><form onSubmit={send}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Tell TJ + Arlane what you need" /><button>Send</button></form></GlassCard>}
        </motion.section>
      </AnimatePresence>
    </main>
  </div>;
}

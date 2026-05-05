import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

const COMMUNITY_ROOMS = ['Vent', 'Need Advice', 'Looking for Friends', 'Career Help', 'Mental Reset'];
const links = { mental: [{ label: '988 Crisis Lifeline', url: 'https://988lifeline.org/' }, { label: 'NAMI', url: 'https://www.nami.org/' }], financial: [{ label: 'Credit.org', url: 'https://credit.org/' }, { label: 'Upwork Side Gigs', url: 'https://www.upwork.com/' }, { label: 'Grants.gov', url: 'https://www.grants.gov/' }], jobs: [{ label: 'Indeed', url: 'https://www.indeed.com/' }, { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' }], legal: [{ label: 'Legal Services Corp', url: 'https://www.lsc.gov/' }] };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));
const pseudo = () => `${['Calm','Steel','Quiet','Kind','Brave'][Math.floor(Math.random()*5)]}${['River','Oak','Sky','Stone','Harbor'][Math.floor(Math.random()*5)]}${Math.floor(Math.random()*90)+10}`;
const API_BASE = 'http://localhost:5000';

export default function App() {
  const path = window.location.pathname;
  if (path.startsWith('/community/room/')) return <CommunityRoom roomName={decodeURIComponent(path.replace('/community/room/', ''))} />;
  if (path === '/community') return <CommunityHome />;
  if (path === '/admin/community') return <AdminCommunity />;
  return <MainApp />;
}

function CommunityHome() { return <div className="calm-shell"><h1>Steady Community</h1><p className="subtitle">A place to talk without judgment.</p><div className="room-list">{COMMUNITY_ROOMS.map((room)=><a key={room} href={`/community/room/${encodeURIComponent(room)}`} className="room-card">{room}</a>)}</div></div>; }

function CommunityRoom({ roomName }) {
  const [socket, setSocket] = useState(null); const [messages, setMessages] = useState([]); const [input, setInput] = useState(''); const [alert, setAlert] = useState(''); const [mutedUntil, setMutedUntil] = useState(0);
  const username = load('steady_pseudonym', null) || pseudo();
  const sessionId = load('steady_session', null) || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  useEffect(() => { save('steady_pseudonym', username); save('steady_session', sessionId); }, []);

  useEffect(() => {
    const s = io(API_BASE); setSocket(s);
    s.emit('community:join', { room: roomName });
    s.on('community:history', ({ messages: history }) => setMessages(history || []));
    s.on('community:message', (m) => setMessages((prev) => [...prev, m]));
    s.on('community:warning', (warning) => { setAlert(warning.message); if (warning.mutedUntil) setMutedUntil(warning.mutedUntil); });
    return () => s.disconnect();
  }, [roomName]);

  const muteLeft = Math.max(0, Math.ceil((mutedUntil - Date.now()) / 1000));
  const send = () => { if (!input.trim() || muteLeft > 0 || !socket) return; socket.emit('community:send', { room: roomName, message: input, username, sessionId }); setInput(''); setAlert(''); };
  const report = async (id) => { await fetch(`${API_BASE}/community/report`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId: id, reason: 'Safety concern' }) }); };

  return <div className="calm-shell"><h1>{roomName}</h1><p className="subtitle">Talk safely. Respect always.</p>{alert && <div className="warning-box">{alert}</div>}<div className="chat-area">{messages.map((m)=><div key={m.id} className="chat-bubble"><div><b>{m.username}</b> <span>{new Date(m.timestamp).toLocaleTimeString()}</span></div><p>{m.message}</p><button className="report" onClick={()=>report(m.id)}>Report</button></div>)}</div><div className="composer"><input className="input" value={input} onChange={(e)=>setInput(e.target.value)} disabled={muteLeft>0} placeholder={muteLeft>0?`Muted for ${muteLeft}s`:'Share calmly...'} /><button className="btn btn-active" onClick={send} disabled={muteLeft>0}>Send</button></div></div>;
}

function AdminCommunity() { const [flags, setFlags] = useState([]); const loadFlags = async()=>{ const r = await fetch(`${API_BASE}/community/admin/flagged`); const d = await r.json(); setFlags(d.flaggedMessages||[]); }; useEffect(()=>{loadFlags();},[]); return <div className="calm-shell"><h1>Community Admin</h1>{flags.map((f,i)=><div key={i} className="chat-bubble"><p>{f.messageId}</p><p>{f.reason}</p><p>{new Date(f.timestamp).toLocaleString()}</p></div>)}</div>; }

function MainApp() { return <div className="calm-shell"><a href="/community" className="room-card">Enter Steady Community</a><p className="subtitle">Community module added. Existing dashboard preserved in previous version.</p></div>; }

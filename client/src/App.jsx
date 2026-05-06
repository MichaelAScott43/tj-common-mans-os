import { useEffect, useMemo, useState } from 'react';

const modules = [
  'Life Hub',
  'Tasks',
  'Funding',
  'Resume Builder',
  'Life Organizer',
  'Steady Coach',
  'Integrations',
  'Settings'
];

const api = {
  get: async (path) => {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  },
  post: async (path, body) => {
    const res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  }
};

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState('Life Hub');
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [fundingQuery, setFundingQuery] = useState('');
  const [resume, setResume] = useState({ name: '', role: '', summary: '' });
  const [chat, setChat] = useState([
    { role: 'tj', text: 'I’m TJ. I help you stay grounded and take action.' },
    { role: 'arlane', text: 'I’m Arlane. I help with emotional clarity and reflection.' }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    Promise.all([api.get('/api/tasks'), api.get('/api/goals')])
      .then(([taskData, goalData]) => {
        setTasks(taskData);
        setGoals(goalData);
      })
      .catch(() => setError('Unable to load dashboard data right now.'))
      .finally(() => setLoading(false));
  }, [loggedIn]);

  const progressScore = useMemo(
    () => Math.round((tasks.filter((t) => t.done).length / Math.max(tasks.length, 1)) * 100),
    [tasks]
  );

  const addTask = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = { title: formData.get('title'), priority: formData.get('priority'), done: false };
    const created = await api.post('/api/tasks', payload);
    setTasks((prev) => [...prev, created]);
    event.currentTarget.reset();
  };

  const addGoal = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = { title: formData.get('title'), progress: Number(formData.get('progress') || 0) };
    const created = await api.post('/api/goals', payload);
    setGoals((prev) => [...prev, created]);
    event.currentTarget.reset();
  };

  if (!loggedIn) {
    return (
      <div className="login">
        <h1>Steady</h1>
        <p>Your life operating system.</p>
        <input placeholder="Email" />
        <input placeholder="Password" type="password" />
        <button onClick={() => setLoggedIn(true)}>Login / Register</button>
      </div>
    );
  }

  return (
    <div className="layout">
      <aside>{modules.map((m) => <button key={m} className={active === m ? 'active' : ''} onClick={() => setActive(m)}>{m}</button>)}</aside>
      <main>
        <header><h2>{active}</h2><span>Steady • Powered by TJ + Arlane</span></header>
        {error && <p className="error">{error}</p>}
        {loading && <p>Loading workspace…</p>}
        {!loading && (
          <section>
            {active === 'Life Hub' && <div className="cards"><div>Open Priorities: {tasks.filter((t) => !t.done).length}</div><div>Goals Tracked: {goals.length}</div><div>Progress Score: {progressScore}%</div></div>}
            {active === 'Tasks' && <div><form onSubmit={addTask}><input name="title" placeholder="Task" required /><select name="priority"><option>High</option><option>Medium</option><option>Low</option></select><button>Add Task</button></form>{tasks.length === 0 ? <p>No tasks yet.</p> : tasks.map((t) => <div key={t.id}><strong>{t.title}</strong> · {t.priority} · {t.done ? 'Done' : 'Open'}</div>)}</div>}
            {active === 'Funding' && <div><input placeholder="Search support resource" value={fundingQuery} onChange={(e) => setFundingQuery(e.target.value)} /><div className="cards"><div>Housing Relief Grant</div><div>Job Upskill Voucher</div><div>Community Food Support</div></div><p>{fundingQuery ? `Showing results for: ${fundingQuery}` : 'Search funding categories above.'}</p></div>}
            {active === 'Resume Builder' && <div><form onSubmit={(e) => e.preventDefault()}><input placeholder="Full name" value={resume.name} onChange={(e) => setResume((p) => ({ ...p, name: e.target.value }))} /><input placeholder="Target role" value={resume.role} onChange={(e) => setResume((p) => ({ ...p, role: e.target.value }))} /><textarea placeholder="Professional summary" value={resume.summary} onChange={(e) => setResume((p) => ({ ...p, summary: e.target.value }))} /></form><pre>{`${resume.name || 'Your Name'}\n${resume.role || 'Role'}\n${resume.summary || 'Summary appears here'}`}</pre></div>}
            {active === 'Life Organizer' && <div><form onSubmit={(e) => { e.preventDefault(); const val = e.currentTarget.item.value.trim(); if (!val) return; setOrganizer((prev) => [...prev, { id: Date.now(), item: val }]); e.currentTarget.reset(); }}><input name="item" placeholder="Add reminder or plan" required /><button>Add</button></form>{organizer.length === 0 ? <p>No plans added yet.</p> : organizer.map((o) => <div key={o.id}>{o.item}</div>)}</div>}
            {active === 'Steady Coach' && <div><div className="chat">{chat.map((m, i) => <div key={i} className={m.role}>{m.role.toUpperCase()}: {m.text}</div>)}</div><form onSubmit={(e) => { e.preventDefault(); const msg = e.currentTarget.msg.value; setChat((prev) => [...prev, { role: 'user', text: msg }, { role: 'tj', text: 'One action now: pick the smallest useful next step and complete it today.' }, { role: 'arlane', text: 'Take one breath and acknowledge progress. You are not behind.' }]); e.currentTarget.reset(); }}><input name="msg" placeholder="Share what you need" required /><button>Send</button></form></div>}
            {active === 'Integrations' && <div className="cards"><div>Google Integration: Connected state coming via OAuth env setup.</div><div>Outlook Integration: Connected state coming via Microsoft Graph setup.</div></div>}
            {active === 'Settings' && <div><form onSubmit={addGoal}><input name="title" placeholder="Wellness goal" required /><input name="progress" type="number" min="0" max="100" placeholder="Progress %" /><button>Save Goal</button></form></div>}
          </section>
        )}
      </main>
    </div>
  );
}

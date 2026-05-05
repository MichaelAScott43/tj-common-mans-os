import { useMemo, useState } from 'react';

const links = {
  mental: [
    { label: '988 Crisis Lifeline', url: 'https://988lifeline.org/' },
    { label: 'NAMI', url: 'https://www.nami.org/' }
  ],
  financial: [
    { label: 'Credit.org', url: 'https://credit.org/' },
    { label: 'Upwork Side Gigs', url: 'https://www.upwork.com/' },
    { label: 'Grants.gov', url: 'https://www.grants.gov/' }
  ],
  jobs: [
    { label: 'Indeed', url: 'https://www.indeed.com/' },
    { label: 'LinkedIn Jobs', url: 'https://www.linkedin.com/jobs/' }
  ],
  legal: [{ label: 'Legal Services Corp', url: 'https://www.lsc.gov/' }]
};

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => JSON.parse(localStorage.getItem(k) || JSON.stringify(d));

export default function App() {
  const [started, setStarted] = useState(false);
  const [character, setCharacter] = useState('Arlane');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(load('steady_messages', []));
  const [nextStep, setNextStep] = useState(load('steady_nextstep', null));
  const [notes, setNotes] = useState(load('steady_notes', ''));
  const [tasks, setTasks] = useState(load('steady_tasks', []));
  const [priority, setPriority] = useState(load('steady_priority', 'Define one clear win for today.'));
  const [budget, setBudget] = useState(load('steady_budget', { income: '', expenses: '' }));
  const [resume, setResume] = useState(load('steady_resume', { name: '', experience: '', skills: '' }));

  const progress = useMemo(() => tasks.length ? Math.round((tasks.filter(t => t.done).length / tasks.length) * 100) : 0, [tasks]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = { role: 'user', text: message };
    const updated = [...messages, userMessage];
    setMessages(updated);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, character })
    });
    const data = await res.json();
    const botMessage = { role: 'bot', text: data.response };
    const all = [...updated, botMessage];
    setMessages(all);
    setNextStep(data.nextStep);
    setPriority(data.nextStep.priorityAction);
    const newTasks = data.nextStep.actionableSteps.map((text) => ({ text, done: false }));
    setTasks(newTasks);
    save('steady_messages', all);
    save('steady_nextstep', data.nextStep);
    save('steady_priority', data.nextStep.priorityAction);
    save('steady_tasks', newTasks);
    setMessage('');
  };

  const toggleTask = (i) => {
    const next = tasks.map((t, idx) => idx === i ? { ...t, done: !t.done } : t);
    setTasks(next);
    save('steady_tasks', next);
  };

  const saveNotes = (v) => { setNotes(v); save('steady_notes', v); };
  const saveBudget = (k, v) => { const n = { ...budget, [k]: v }; setBudget(n); save('steady_budget', n); };
  const saveResume = (k, v) => { const n = { ...resume, [k]: v }; setResume(n); save('steady_resume', n); };

  const downloadResume = () => {
    const text = `${resume.name}\n\nExperience\n${resume.experience}\n\nSkills\n${resume.skills}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'steady-resume.txt'; a.click();
  };

  if (!started) return <Landing start={() => setStarted(true)} />;

  return (
    <div className="min-h-screen bg-base text-white p-4 md:p-8 font-sans">
      <h1 className="text-3xl font-extrabold mb-6">Steady – Life Operating System</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="Mental Core">
          <div className="flex gap-2 mb-3">
            {['TJ', 'Arlane'].map((c) => <button key={c} onClick={() => setCharacter(c)} className={`btn ${character===c?'btn-active':''}`}>{c}</button>)}
          </div>
          <div className="h-64 overflow-y-auto bg-black/30 rounded-xl p-3 mb-3">
            {messages.map((m, i) => <div key={i} className={`bubble ${m.role==='user'?'user':'bot'}`}>{m.text}</div>)}
          </div>
          <div className="flex gap-2">
            <input value={message} onChange={(e)=>setMessage(e.target.value)} className="input" placeholder="Tell Steady what is going on..." />
            <button onClick={sendMessage} className="btn btn-active">Send</button>
          </div>
          {nextStep && <div className="mt-4 space-y-2 text-sm"><p className="text-glow font-semibold">Do this today: {nextStep.priorityAction}</p>{nextStep.actionableSteps.map((s,i)=><p key={i}>• {s}</p>)}</div>}
        </Section>
        <Section title="Life Dashboard">
          <p className="mb-2"><span className="font-semibold">Today's priority:</span> {priority}</p>
          {tasks.map((t, i) => <label key={i} className="flex gap-2"><input type="checkbox" checked={t.done} onChange={()=>toggleTask(i)} />{t.text}</label>)}
          <textarea value={notes} onChange={(e)=>saveNotes(e.target.value)} className="input mt-3 h-24" placeholder="Notes" />
          <p className="mt-3">Progress: {progress}%</p>
        </Section>
        <Section title="Financial Support Hub">
          <div className="grid grid-cols-2 gap-2">
            <input className="input" placeholder="Income" value={budget.income} onChange={(e)=>saveBudget('income', e.target.value)} />
            <input className="input" placeholder="Expenses" value={budget.expenses} onChange={(e)=>saveBudget('expenses', e.target.value)} />
          </div>
          <p className="mt-3">Suggested Action: Build a 50/30/20 budget and cut one recurring expense this week.</p>
          <ResourceList data={links.financial} />
        </Section>
        <Section title="Job + Resume Engine">
          <input className="input mb-2" placeholder="Name" value={resume.name} onChange={(e)=>saveResume('name', e.target.value)} />
          <textarea className="input mb-2" placeholder="Experience" value={resume.experience} onChange={(e)=>saveResume('experience', e.target.value)} />
          <input className="input mb-2" placeholder="Skills" value={resume.skills} onChange={(e)=>saveResume('skills', e.target.value)} />
          <div className="flex gap-2 mb-2"><button className="btn" onClick={()=>navigator.clipboard.writeText(`${resume.name}\n${resume.experience}\n${resume.skills}`)}>Copy</button><button className="btn" onClick={downloadResume}>Download</button><button className="btn btn-active" onClick={()=>saveResume('experience', `${resume.experience}\n- Rewritten: Delivered measurable impact with ownership and consistency.`)}>Improve my resume</button></div>
          <ResourceList data={links.jobs} />
        </Section>
        <Section title="Resource Hub">
          <h4>Mental health</h4><ResourceList data={links.mental} />
          <h4>Financial help</h4><ResourceList data={links.financial} />
          <h4>Job boards</h4><ResourceList data={links.jobs} />
          <h4>Legal support</h4><ResourceList data={links.legal} />
        </Section>
      </div>
      <footer className="mt-10 text-xs text-gray-300 border-t border-white/10 pt-6 space-y-2">
        <p>Privacy Policy: "We collect minimal data necessary to operate the platform. We do not sell personal data."</p>
        <p>Cookie Notice: "This site uses cookies to improve experience."</p>
        <p>Disclaimer: "Steady is not a licensed medical, financial, or legal service. It provides general guidance only."</p>
      </footer>
    </div>
  );
}

function Landing({ start }) {
  return <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex items-center justify-center p-6">
    <div className="max-w-3xl text-center animate-fade">
      <div className="text-5xl font-black mb-3">Steady</div>
      <p className="text-xl mb-6">Your life, organized. One step at a time.</p>
      <div className="flex justify-center gap-6 mb-8"><div className="card">TJ ⚡</div><div className="card">Arlane 🌿</div><div className="card">Logo ◉</div></div>
      <button onClick={start} className="btn btn-active text-lg px-8 py-3">Start Now</button>
    </div>
  </div>;
}

function Section({ title, children }) { return <section className="bg-card rounded-2xl p-5 shadow-glow border border-white/10"><h2 className="text-xl font-bold mb-3">{title}</h2>{children}</section>; }
function ResourceList({ data }) { return <ul className="list-disc ml-5 mt-2">{data.map((l)=><li key={l.url}><a className="text-glow hover:underline" href={l.url} target="_blank">{l.label}</a></li>)}</ul>; }

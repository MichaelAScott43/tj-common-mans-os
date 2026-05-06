import { useMemo, useState } from 'react';

const modules = ['Life Hub','Tasks','Calendar','Notes','Contacts','Money Map','Goals','Steady Coach','Settings'];

const initialTasks = [{id:1,title:'Submit rent assistance form',priority:'High',done:false}];
const initialGoals = [{id:1,title:'Emergency fund',progress:45}];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [active, setActive] = useState('Life Hub');
  const [tasks, setTasks] = useState(initialTasks);
  const [notes, setNotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [goals, setGoals] = useState(initialGoals);
  const [events, setEvents] = useState([{id:1,title:'Case worker call',day:'Wed'}]);
  const [chat, setChat] = useState([{role:'coach',text:'Welcome to Steady. I’m here to keep you grounded and moving forward. — Powered by TJ'}]);

  const progressScore = useMemo(() => Math.round((tasks.filter(t => t.done).length / Math.max(tasks.length,1))*100), [tasks]);

  if (!loggedIn) {
    return <div className="login"><h1>Steady</h1><p>Powered by TJ</p><input placeholder="Email"/><input placeholder="Password" type="password"/><button onClick={() => setLoggedIn(true)}>Login</button></div>;
  }

  const add = (setter, item) => setter(prev => [...prev, { id: Date.now(), ...item }]);

  return <div className="layout">
    <aside>{modules.map(m => <button key={m} className={active===m?'active':''} onClick={()=>setActive(m)}>{m}</button>)}</aside>
    <main>
      <header><h2>{active}</h2><span>Steady OS</span></header>
      <section>{active==='Life Hub' && <div><div className="cards"><div>Daily Overview</div><div>Priorities: {tasks.filter(t=>!t.done).length}</div><div>Reminders: {events.length}</div><div>Progress Score: {progressScore}%</div></div></div>}
      {active==='Tasks' && <div><form onSubmit={e=>{e.preventDefault();add(setTasks,{title:e.target.title.value,priority:e.target.priority.value,done:false});e.target.reset();}}><input name="title" placeholder="Task" required/><select name="priority"><option>High</option><option>Medium</option><option>Low</option></select><button>Add Task</button></form>{tasks.map(t=><div key={t.id}><strong>{t.title}</strong> <span>{t.priority}</span> <button onClick={()=>setTasks(prev=>prev.map(p=>p.id===t.id?{...p,done:!p.done}:p))}>{t.done?'Undo':'Complete'}</button></div>)}</div>}
      {active==='Calendar' && <div><p>Week: Mon Tue Wed Thu Fri Sat Sun</p><form onSubmit={e=>{e.preventDefault();add(setEvents,{title:e.target.title.value,day:e.target.day.value});e.target.reset();}}><input name="title" placeholder="Event" required/><input name="day" placeholder="Day" required/><button>Add Event</button></form>{events.map(ev=><div key={ev.id}>{ev.day}: {ev.title}</div>)}</div>}
      {active==='Notes' && <div><form onSubmit={e=>{e.preventDefault();add(setNotes,{text:e.target.note.value});e.target.reset();}}><textarea name="note" required/><button>Save Note</button></form>{notes.map(n=><div key={n.id}>{n.text}</div>)}</div>}
      {active==='Contacts' && <div><form onSubmit={e=>{e.preventDefault();add(setContacts,{name:e.target.name.value,tag:e.target.tag.value});e.target.reset();}}><input name="name" placeholder="Contact name" required/><select name="tag"><option>Family</option><option>Work</option><option>Business</option><option>Support</option></select><button>Add Contact</button></form>{contacts.map(c=><div key={c.id}>{c.name} - {c.tag}</div>)}</div>}
      {active==='Money Map' && <div><div className="cards"><div>Income Snapshot: $2,400</div><div>Expenses: Housing, Food, Transport</div><div>Resources: local aid, grants, support funds</div></div></div>}
      {active==='Goals' && <div><form onSubmit={e=>{e.preventDefault();add(setGoals,{title:e.target.title.value,progress:Number(e.target.progress.value||0)});e.target.reset();}}><input name="title" placeholder="Goal" required/><input name="progress" type="number" min="0" max="100" placeholder="Progress %"/><button>Add Goal</button></form>{goals.map(g=><div key={g.id}>{g.title}<progress max="100" value={g.progress}/> {g.progress}%</div>)}</div>}
      {active==='Steady Coach' && <div><p>Powered by TJ</p><div className="chat">{chat.map((m,i)=><div key={i} className={m.role}>{m.text}</div>)}</div><form onSubmit={e=>{e.preventDefault();const msg=e.target.msg.value;setChat(prev=>[...prev,{role:'user',text:msg},{role:'coach',text:'Good step. Keep it simple: one priority now, one next. TJ would say consistency beats intensity.'}]);e.target.reset();}}><input name="msg" placeholder="Share what you need" required/><button>Send</button></form></div>}
      {active==='Settings' && <div><p>Profile, notifications, and preferences will live here.</p></div>}
      </section>
      <footer>Powered by TJ</footer>
    </main>
  </div>;
}

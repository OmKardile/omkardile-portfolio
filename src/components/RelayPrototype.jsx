'use client';
import { useState } from 'react';
import { Home, Plus, Bell, User, Clock, Check, ArrowLeft, ChevronRight } from 'lucide-react';

const C = {
  bg: '#F0F3F0',
  shell: '#E7E9E4',
  card: '#FFFFFF',
  pine: '#0F6E56',
  ink: '#1C2624',
  moss: '#62726B',
  border: '#DDE3DE',
  goldBg: '#F7EFDF',
  goldBorder: '#D9A84E',
  gold: '#7A5518',
  goldDark: '#4A3410',
};

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

function generateOptions(text) {
  const t = text.toLowerCase();
  if (t.includes('subscri') || t.includes('cancel')) {
    return [
      { label: 'Cancel now', save: 'Save ~$10/mo', tradeoff: 'Ends immediately', recommended: true },
      { label: 'Pause instead', save: 'Save ~$10/mo', tradeoff: 'Keeps your history' },
    ];
  }
  if (t.includes('bill') || t.includes('negotiat')) {
    return [
      { label: 'Request lower rate', save: 'Est. save $6/mo', tradeoff: 'May take a few days', recommended: true },
      { label: 'Switch plans', save: 'Est. save $15/mo', tradeoff: 'Fewer included features' },
    ];
  }
  return [
    { label: 'Handle it now', save: 'Best available outcome', tradeoff: 'Acts as soon as approved', recommended: true },
    { label: 'Just flag it', save: 'No action taken', tradeoff: 'You review it yourself' },
  ];
}

let nextId = 100;

function ScreenHeader({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{ background: 'none', border: 'none', padding: 4, marginLeft: -4, cursor: 'pointer', display: 'flex', color: C.moss }}>
          <ArrowLeft size={20} />
        </button>
      )}
      <p style={{ fontSize: 13, color: C.moss, margin: 0, fontWeight: 500 }}>{title}</p>
    </div>
  );
}

function OptionCard({ option, selected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: C.card,
        border: selected ? `1.5px solid ${C.pine}` : `0.5px solid ${C.border}`,
        borderRadius: 12,
        padding: '14px 16px',
        marginBottom: 10,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.ink, margin: 0 }}>{option.label}</p>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.pine, margin: 0 }}>{option.save}</p>
      </div>
      <p style={{ fontSize: 12, color: C.moss, margin: 0 }}>{option.tradeoff}</p>
    </div>
  );
}

function BottomNav({ screen, setScreen, badgeCount }) {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'delegate', icon: Plus, label: 'Delegate' },
    { id: 'approvals', icon: Bell, label: 'Approvals', badge: badgeCount },
    { id: 'activity', icon: User, label: 'Activity' },
  ];
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 12px 4px', borderTop: `0.5px solid ${C.border}`, background: C.bg }}>
      {items.map(item => {
        const Icon = item.icon;
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            aria-label={item.label}
            style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer', position: 'relative', color: active ? C.pine : C.moss, display: 'flex' }}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            {item.badge > 0 && (
              <span style={{ position: 'absolute', top: 0, right: 0, background: C.goldBorder, color: C.goldDark, fontSize: 10, fontWeight: 500, width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [openTaskId, setOpenTaskId] = useState(null);
  const [selectedOption, setSelectedOption] = useState(0);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Negotiate internet bill', status: 'researching', note: 'Researching · started today' },
    { id: 2, title: 'Cancel unused streaming plan', status: 'checkpoint', options: [
      { label: 'Cancel now', save: 'Save $12/mo', tradeoff: 'Loses remaining $4 credit', recommended: true },
      { label: 'Downgrade tier', save: 'Save $8/mo', tradeoff: 'Keeps offline downloads' },
    ] },
  ]);
  const [log, setLog] = useState([{ id: 0, title: 'Cancelled unused gym app', outcome: 'Saved $14/mo' }]);
  const [taskText, setTaskText] = useState('');
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({ subscriptions: 'ask', bills: 'ask', prices: 'ask' });

  const checkpointTasks = tasks.filter(t => t.status === 'checkpoint');
  const activeTasks = tasks.filter(t => t.status === 'researching');
  const openTask = tasks.find(t => t.id === openTaskId);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function openCheckpoint(id) {
    setOpenTaskId(id);
    setSelectedOption(0);
    setScreen('checkpoint');
  }

  function delegateTask() {
    if (!taskText.trim()) return;
    const id = nextId++;
    const title = taskText.trim();
    setTasks(prev => [...prev, { id, title, status: 'researching', note: 'Researching · just now' }]);
    setTaskText('');
    setScreen('home');
    showToast('Relay is on it');
    setTimeout(() => {
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, status: 'checkpoint', options: generateOptions(title) } : t)));
    }, 2400);
  }

  function approve(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const option = task.options[selectedOption];
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setLog(prev => [{ id: taskId, title: task.title, outcome: option.save }, ...prev]);
    setOpenTaskId(null);
    setScreen('home');
    showToast('Done — logged to activity');
  }

  function decline(taskId) {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setOpenTaskId(null);
    setScreen('home');
    showToast('Closed — nothing changed');
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '32px 16px', background: C.shell, minHeight: '100vh', fontFamily: FONT, boxSizing: 'border-box' }}>
      <style>{`
        @keyframes relayPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @media (prefers-reduced-motion: no-preference) { .relay-pulse { animation: relayPulse 1.8s ease-in-out infinite; } }
        .relay-btn:hover { opacity: 0.88; }
        textarea:focus, button:focus-visible { outline: 2px solid #0F6E56; outline-offset: 1px; }
      `}</style>
      <div style={{ width: '100%', maxWidth: 360, background: C.bg, borderRadius: 40, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 2px 16px rgba(28,38,36,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'min(700px, 88vh)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 22px 0', fontSize: 12, color: C.ink, fontWeight: 500, flexShrink: 0 }}>
          <span>9:41</span>
          <span style={{ letterSpacing: 1 }}>●●●</span>
        </div>

        <div style={{ flex: 1, padding: '18px 20px 8px', overflowY: 'auto' }}>
          {screen === 'home' && (
            <div>
              <p style={{ fontSize: 13, color: C.moss, margin: '0 0 2px' }}>Good morning</p>
              <p style={{ fontSize: 21, fontWeight: 500, color: C.ink, margin: '0 0 20px' }}>Maya</p>

              {checkpointTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => openCheckpoint(t.id)}
                  style={{ background: C.goldBg, border: `0.5px solid ${C.goldBorder}`, borderRadius: 12, padding: '14px 16px', marginBottom: 14, cursor: 'pointer' }}
                >
                  <p style={{ fontSize: 12, fontWeight: 500, color: C.gold, margin: '0 0 4px' }}>Needs your approval</p>
                  <p style={{ fontSize: 14, color: C.goldDark, margin: '0 0 2px' }}>{t.title}</p>
                  <p style={{ fontSize: 12, color: C.gold, margin: 0 }}>{t.options.length} options found</p>
                </div>
              ))}

              {activeTasks.length > 0 && (
                <>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, margin: '4px 0 10px' }}>In progress</p>
                  {activeTasks.map(t => (
                    <div key={t.id} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: 14, color: C.ink, margin: '0 0 2px' }}>{t.title}</p>
                        <p style={{ fontSize: 12, color: C.moss, margin: 0 }}>{t.note}</p>
                      </div>
                      <span className="relay-pulse" style={{ color: C.moss, display: 'flex' }}><Clock size={17} /></span>
                    </div>
                  ))}
                </>
              )}

              <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, margin: '14px 0 10px' }}>Done recently</p>
              {log.slice(0, 2).map(item => (
                <div key={item.id} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 14, color: C.ink, margin: '0 0 2px' }}>{item.title}</p>
                    <p style={{ fontSize: 12, color: C.pine, margin: 0 }}>{item.outcome}</p>
                  </div>
                  <span style={{ color: C.pine, display: 'flex' }}><Check size={17} /></span>
                </div>
              ))}
            </div>
          )}

          {screen === 'delegate' && (
            <div>
              <ScreenHeader title="Delegate a task" onBack={() => setScreen('home')} />
              <p style={{ fontSize: 13, color: C.moss, margin: '0 0 14px' }}>Try one, or write your own below</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
                {['Cancel a subscription', 'Negotiate a bill', 'Track a price'].map(s => (
                  <button
                    key={s}
                    onClick={() => setTaskText(s)}
                    className="relay-btn"
                    style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: '7px 14px', fontSize: 12.5, color: C.ink, cursor: 'pointer' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <textarea
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
                placeholder="e.g. cancel my unused meal kit subscription"
                rows={4}
                style={{ width: '100%', boxSizing: 'border-box', border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 12, fontSize: 14, color: C.ink, fontFamily: FONT, resize: 'none', marginBottom: 16, background: C.card }}
              />
              <button
                onClick={delegateTask}
                className="relay-btn"
                style={{ width: '100%', background: C.pine, color: '#fff', border: 'none', borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Delegate this
              </button>
              <p style={{ fontSize: 11.5, color: C.moss, marginTop: 10, textAlign: 'center' }}>Relay researches first — nothing happens without your OK</p>
            </div>
          )}

          {screen === 'approvals' && (
            <div>
              <ScreenHeader title="Approvals" />
              {checkpointTasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 10px', color: C.moss }}>
                  <p style={{ fontSize: 14, margin: 0 }}>Nothing needs you right now.</p>
                  <p style={{ fontSize: 12.5, margin: '6px 0 0' }}>Relay will surface anything here before it acts.</p>
                </div>
              ) : (
                checkpointTasks.map(t => (
                  <div key={t.id} onClick={() => openCheckpoint(t.id)} style={{ background: C.goldBg, border: `0.5px solid ${C.goldBorder}`, borderRadius: 12, padding: '14px 16px', marginBottom: 12, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 14, color: C.goldDark, margin: '0 0 2px' }}>{t.title}</p>
                      <p style={{ fontSize: 12, color: C.gold, margin: 0 }}>{t.options.length} options found</p>
                    </div>
                    <ChevronRight size={18} color={C.gold} />
                  </div>
                ))
              )}
            </div>
          )}

          {screen === 'checkpoint' && openTask && (
            <div>
              <ScreenHeader title="Checkpoint" onBack={() => setScreen('home')} />
              <p style={{ fontSize: 18, fontWeight: 500, color: C.ink, margin: '0 0 4px' }}>{openTask.title}</p>
              <p style={{ fontSize: 13, color: C.moss, margin: '0 0 18px' }}>Relay found {openTask.options.length} ways to handle this</p>
              {openTask.options.map((opt, i) => (
                <OptionCard key={i} option={opt} selected={selectedOption === i} onSelect={() => setSelectedOption(i)} />
              ))}
              <p style={{ fontSize: 12, color: C.gold, background: C.goldBg, display: 'inline-block', padding: '4px 10px', borderRadius: 20, margin: '10px 0 20px' }}>
                Waiting on you · no charge yet
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => approve(openTask.id)} className="relay-btn" style={{ flex: 1, background: C.pine, color: '#fff', border: 'none', borderRadius: 8, padding: 10, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                  Approve
                </button>
                <button onClick={() => decline(openTask.id)} className="relay-btn" style={{ flex: 1, background: 'transparent', color: C.ink, border: `0.5px solid ${C.moss}`, borderRadius: 8, padding: 10, fontSize: 14, cursor: 'pointer' }}>
                  Decline
                </button>
              </div>
            </div>
          )}

          {screen === 'activity' && (
            <div>
              <ScreenHeader title="Activity & settings" />
              <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, margin: '0 0 10px' }}>Log</p>
              {log.length === 0 && <p style={{ fontSize: 13, color: C.moss }}>Nothing logged yet.</p>}
              {log.map(item => (
                <div key={item.id} style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: 14, color: C.ink, margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 12, color: C.pine, margin: 0 }}>{item.outcome}</p>
                </div>
              ))}

              <p style={{ fontSize: 13, fontWeight: 500, color: C.ink, margin: '20px 0 10px' }}>How much Relay can decide on its own</p>
              {[
                { key: 'subscriptions', label: 'Subscriptions' },
                { key: 'bills', label: 'Bills' },
                { key: 'prices', label: 'Price tracking' },
              ].map(row => (
                <div key={row.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontSize: 13.5, color: C.ink, margin: 0 }}>{row.label}</p>
                  <div style={{ display: 'flex', background: C.card, border: `0.5px solid ${C.border}`, borderRadius: 20, padding: 2 }}>
                    {['ask', 'auto'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => setSettings(s => ({ ...s, [row.key]: mode }))}
                        style={{
                          border: 'none',
                          borderRadius: 18,
                          padding: '5px 12px',
                          fontSize: 11.5,
                          fontWeight: 500,
                          cursor: 'pointer',
                          background: settings[row.key] === mode ? C.pine : 'transparent',
                          color: settings[row.key] === mode ? '#fff' : C.moss,
                        }}
                      >
                        {mode === 'ask' ? 'Always ask' : 'Small auto-OK'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <BottomNav screen={screen} setScreen={setScreen} badgeCount={checkpointTasks.length} />
        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0 10px', background: C.bg, flexShrink: 0 }}>
          <div style={{ width: 100, height: 4, borderRadius: 2, background: C.ink, opacity: 0.25 }} />
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: C.ink, color: '#fff', padding: '10px 18px', borderRadius: 20, fontSize: 13, fontFamily: FONT, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

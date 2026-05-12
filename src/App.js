import React, { useState, useEffect } from 'react';

const API = 'https://hastily-smite-prefix.ngrok-free.dev';

const styles = {
  app: { minHeight: '100vh', backgroundColor: '#0a0a0a', color: '#fff', fontFamily: 'Inter, sans-serif' },
  loginPage: { minHeight: '100vh', backgroundColor: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginCard: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '16px', padding: '40px', width: '400px' },
  loginTitle: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' },
  loginSub: { fontSize: '14px', color: '#9ca3af', textAlign: 'center', marginBottom: '32px' },
  inputGroup: { marginBottom: '16px' },
  inputLabel: { fontSize: '14px', color: '#9ca3af', marginBottom: '8px', display: 'block' },
  input: { width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  loginBtn: { width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  errorMsg: { color: '#f87171', fontSize: '14px', textAlign: 'center', marginTop: '8px' },
  header: { borderBottom: '1px solid #1f2937', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerTitle: { fontSize: '20px', fontWeight: 'bold' },
  headerSub: { fontSize: '12px', color: '#9ca3af' },
  nav: { display: 'flex', gap: '8px', padding: '0 24px', borderBottom: '1px solid #1f2937', backgroundColor: '#0d1117' },
  navBtn: (active) => ({ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', color: active ? '#60a5fa' : '#9ca3af', borderBottom: active ? '2px solid #60a5fa' : '2px solid transparent', cursor: 'pointer', fontSize: '14px', fontWeight: active ? 'bold' : 'normal' }),
  content: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '32px' },
  card: { backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '20px' },
  cardTitle: { fontSize: '12px', color: '#9ca3af', marginBottom: '8px' },
  cardValue: { fontSize: '24px', fontWeight: 'bold' },
  sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#d1d5db', marginBottom: '16px' },
  signalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  badge: (color) => ({ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', backgroundColor: color === 'green' ? '#064e3b' : color === 'red' ? '#7f1d1d' : '#1f2937', color: color === 'green' ? '#34d399' : color === 'red' ? '#f87171' : '#9ca3af' }),
  row: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
  label: { fontSize: '14px', color: '#9ca3af' },
  progressBg: { width: '100%', backgroundColor: '#1f2937', borderRadius: '999px', height: '6px', margin: '8px 0' },
  progressFill: (score) => ({ height: '6px', borderRadius: '999px', backgroundColor: score >= 70 ? '#10b981' : '#f59e0b', width: `${score}%` }),
  noTrades: { textAlign: 'center', color: '#9ca3af', padding: '24px' },
  timeTxt: { fontSize: '12px', color: '#9ca3af' },
  loading: { textAlign: 'center', color: '#9ca3af', padding: '40px', fontSize: '18px' },
  logoutBtn: { backgroundColor: '#7f1d1d', color: '#f87171', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  startBtn: { backgroundColor: '#064e3b', color: '#34d399', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', marginRight: '8px' },
  stopBtn: { backgroundColor: '#7f1d1d', color: '#f87171', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1f2937' },
  settingInput: { backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '14px', width: '120px', textAlign: 'right' },
  saveBtn: { width: '100%', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '16px' },
  successMsg: { color: '#34d399', fontSize: '14px', textAlign: 'center', marginTop: '8px' },
  statusBadge: (color) => ({ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: color === 'green' ? '#064e3b' : '#7f1d1d', color: color === 'green' ? '#34d399' : '#f87171', padding: '6px 16px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' }),
};

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        onLogin(data.username);
      } else {
        setError('Invalid credentials!');
      }
    } catch {
      setError('Connection failed!');
    }
    setLoading(false);
  };

  return (
    <div style={styles.loginPage}>
      <div style={styles.loginCard}>
        <div style={{ textAlign: 'center', fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <div style={styles.loginTitle}>AI Algo Trading</div>
        <div style={styles.loginSub}>Yuvan Raja Cholan — Login</div>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Username</label>
          <input style={styles.input} type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.inputLabel}>Password</label>
          <input style={styles.input} type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button style={styles.loginBtn} onClick={handleLogin} disabled={loading}>
          {loading ? '🔄 Logging in...' : '🚀 Login'}
        </button>
        {error && <div style={styles.errorMsg}>❌ {error}</div>}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardTitle}>{title}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
    </div>
  );
}

function SignalCard({ data }) {
  const isBullish = data.trend === 'BULLISH';
  const hasSignal = data.signal !== 'NO TRADE';
  return (
    <div style={styles.card}>
      <div style={styles.signalHeader}>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.symbol}</span>
        <span style={styles.badge(isBullish ? 'green' : 'red')}>{data.trend}</span>
      </div>
      <div style={styles.row}><span style={styles.label}>Price</span><span style={{ fontFamily: 'monospace' }}>{data.price}</span></div>
      <div style={styles.row}>
        <span style={styles.label}>AI Score</span>
        <span style={{ fontWeight: 'bold', color: data.score >= 70 ? '#10b981' : '#f59e0b' }}>{data.score}%</span>
      </div>
      <div style={styles.progressBg}><div style={styles.progressFill(data.score)} /></div>
      <div style={styles.row}><span style={styles.label}>Order Blocks</span><span style={{ color: '#60a5fa' }}>{data.orderBlocks} detected</span></div>
      <div style={styles.row}><span style={styles.label}>FVGs</span><span style={{ color: '#a78bfa' }}>{data.fvgs} detected</span></div>
      <div style={styles.row}>
        <span style={styles.label}>Signal</span>
        <span style={styles.badge(hasSignal ? (data.signal.includes('BUY') ? 'green' : 'red') : 'gray')}>{data.signal}</span>
      </div>
      {data.reasons.length > 0 && <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>💡 {data.reasons.join(', ')}</div>}
    </div>
  );
}

function DashboardTab() {
  const [account, setAccount] = useState(null);
  const [signals, setSignals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [tradeLog, setTradeLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchAll = async () => {
    try {
     const headers = { 'ngrok-skip-browser-warning': 'true' };
const [acc, sig, pos, log] = await Promise.all([
  fetch(`${API}/api/account`, { headers }).then(r => r.json()),
  fetch(`${API}/api/signals`, { headers }).then(r => r.json()),
  fetch(`${API}/api/positions`, { headers }).then(r => r.json()),
  fetch(`${API}/api/tradelog`, { headers }).then(r => r.json()),
]);
      setAccount(acc);
      setSignals(sig);
      setPositions(pos);
      setTradeLog(log);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={styles.loading}>🤖 Loading...</div>;

  return (
    <div style={styles.content}>
      {account && (
        <div style={styles.grid4}>
          <StatCard title="💰 Balance" value={`$${account.balance.toFixed(2)}`} color="#60a5fa" />
          <StatCard title="📈 Equity" value={`$${account.equity.toFixed(2)}`} color="#a78bfa" />
          <StatCard title="💹 Profit/Loss" value={`$${account.profit.toFixed(2)}`} color={account.profit >= 0 ? "#34d399" : "#f87171"} />
          <StatCard title="✅ Free Margin" value={`$${account.freeMargin.toFixed(2)}`} color="#fbbf24" />
        </div>
      )}
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>🤖 AI Signals — Live <span style={{ fontSize: '12px', color: '#6b7280' }}>Updated: {lastUpdate.toLocaleTimeString()}</span></div>
        <div style={styles.grid2}>{signals.map(s => <SignalCard key={s.symbol} data={s} />)}</div>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>📈 Open Positions ({positions.length})</div>
        <div style={styles.card}>
          {positions.length === 0 ? <div style={styles.noTrades}>No open trades</div> :
            positions.map(pos => (
              <div key={pos.ticket} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1f2937' }}>
                <span style={{ fontWeight: 'bold' }}>{pos.symbol}</span>
                <span style={{ color: pos.type === 'BUY' ? '#34d399' : '#f87171' }}>{pos.type}</span>
                <span style={{ color: '#9ca3af' }}>Lot: {pos.lot}</span>
                <span style={{ color: '#9ca3af' }}>Entry: {pos.entry}</span>
                <span style={{ color: pos.profit >= 0 ? '#34d399' : '#f87171', fontWeight: 'bold' }}>${pos.profit}</span>
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>📝 Recent Trades</div>
        <div style={styles.card}>
          {tradeLog.length === 0 ? <div style={styles.noTrades}>No trades logged yet</div> :
            tradeLog.map((trade, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1f2937', fontSize: '14px' }}>
                <span style={{ color: '#9ca3af' }}>{trade.Date} {trade.Time}</span>
                <span style={{ fontWeight: 'bold' }}>{trade.Symbol}</span>
                <span style={{ color: trade.Signal === 'BUY' ? '#34d399' : '#f87171' }}>{trade.Signal}</span>
                <span style={{ color: '#60a5fa' }}>AI: {trade['AI Score'] || 'N/A'}%</span>
              </div>
            ))
          }
        </div>
      </div>
      <div>
        <div style={styles.sectionTitle}>⏰ Trading Sessions</div>
        <div style={styles.grid2}>
          {[{ name: '🇬🇧 London', hours: '8AM-4PM UTC' }, { name: '🇺🇸 New York', hours: '1PM-9PM UTC' }].map(s => (
            <div key={s.name} style={styles.card}>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{s.name}</div>
              <div style={{ color: '#9ca3af', fontSize: '14px' }}>{s.hours}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControlTab() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [botRunning, setBotRunning] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/settings`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' }, body: JSON.stringify(settings) })
      setSettings(data);
      setBotRunning(data.status === 'RUNNING');
    });
  }, []);

  const handleSave = async () => {
    await fetch(`${API}/api/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleStart = async () => {
    fetch(`${API}/api/bot/start`, { method: 'POST', headers: { 'ngrok-skip-browser-warning': 'true' } })
    setBotRunning(true);
  };

  const handleStop = async () => {
    fetch(`${API}/api/bot/stop`, { method: 'POST', headers: { 'ngrok-skip-browser-warning': 'true' } })
    setBotRunning(false);
  };

  if (!settings) return <div style={styles.loading}>Loading settings...</div>;

  return (
    <div style={styles.content}>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>🤖 Bot Control</div>
        <div style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Bot Status</div>
              <div style={{ color: botRunning ? '#34d399' : '#f87171', fontSize: '14px' }}>
                {botRunning ? '🟢 Running' : '🔴 Stopped'}
              </div>
            </div>
            <div>
              <button style={styles.startBtn} onClick={handleStart}>▶️ Start Bot</button>
              <button style={styles.stopBtn} onClick={handleStop}>⏹️ Stop Bot</button>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>⚙️ Risk Settings</div>
        <div style={styles.card}>
          {[
            { label: '💰 Risk Per Trade (%)', key: 'risk_percent', step: 0.1 },
            { label: '🛡️ Stop Loss (pips)', key: 'sl_pips', step: 1 },
            { label: '🎯 Take Profit (pips)', key: 'tp_pips', step: 1 },
            { label: '📊 Max Trades', key: 'max_trades', step: 1 },
            { label: '📉 Max Daily Loss (%)', key: 'max_daily_loss', step: 0.1 },
            { label: '🤖 AI Score Threshold (%)', key: 'ai_threshold', step: 1 },
          ].map(item => (
            <div key={item.key} style={styles.settingRow}>
              <span style={styles.label}>{item.label}</span>
              <input
                style={styles.settingInput}
                type="number"
                step={item.step}
                value={settings[item.key]}
                onChange={e => setSettings({ ...settings, [item.key]: parseFloat(e.target.value) })}
              />
            </div>
          ))}
          <button style={styles.saveBtn} onClick={handleSave}>💾 Save Settings</button>
          {saved && <div style={styles.successMsg}>✅ Settings Saved!</div>}
        </div>
      </div>
      <div>
        <div style={styles.sectionTitle}>📊 Trading Pairs</div>
        <div style={styles.card}>
          {['EURUSD', 'GBPUSD', 'USDJPY'].map(pair => (
            <div key={pair} style={styles.settingRow}>
              <span style={styles.label}>{pair}</span>
              <input
                type="checkbox"
                checked={settings.symbols ? settings.symbols.includes(pair) : false}
                onChange={e => {
                  const syms = e.target.checked
                    ? [...settings.symbols, pair]
                    : settings.symbols.filter(s => s !== pair);
                  setSettings({ ...settings, symbols: syms });
                }}
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
            </div>
          ))}
          <button style={styles.saveBtn} onClick={handleSave}>💾 Save Pairs</button>
        </div>
      </div>
    </div>
  );
}

function ReportsTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/reports`)
      .then(r => r.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loading}>📊 Loading Reports...</div>;
  if (!stats) return <div style={styles.loading}>No data yet!</div>;

  return (
    <div style={styles.content}>
      <div style={styles.grid4}>
        <StatCard title="📊 Total Trades" value={stats.total_trades || 0} color="#60a5fa" />
        <StatCard title="✅ Win Rate" value={`${stats.win_rate || 0}%`} color="#34d399" />
        <StatCard title="💰 Total Profit" value={`$${stats.total_profit || 0}`} color={(stats.total_profit || 0) >= 0 ? "#34d399" : "#f87171"} />
        <StatCard title="📉 Max Drawdown" value={`${stats.max_drawdown || 0}%`} color="#f87171" />
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>🏆 Win/Loss Breakdown</div>
        <div style={styles.grid2}>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#34d399' }}>{stats.wins || 0}</div>
              <div style={{ color: '#9ca3af', marginTop: '8px' }}>✅ Winning Trades</div>
            </div>
          </div>
          <div style={styles.card}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f87171' }}>{stats.losses || 0}</div>
              <div style={{ color: '#9ca3af', marginTop: '8px' }}>❌ Losing Trades</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>🎯 Win Rate Progress</div>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={styles.label}>Win Rate</span>
            <span style={{ fontWeight: 'bold', color: (stats.win_rate || 0) >= 50 ? '#34d399' : '#f87171' }}>{stats.win_rate || 0}%</span>
          </div>
          <div style={styles.progressBg}>
            <div style={{ ...styles.progressFill(stats.win_rate || 0), backgroundColor: (stats.win_rate || 0) >= 50 ? '#10b981' : '#f59e0b' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>0%</span>
            <span style={{ fontSize: '12px', color: '#34d399' }}>Target: 55%+</span>
            <span style={{ fontSize: '12px', color: '#9ca3af' }}>100%</span>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: '32px' }}>
        <div style={styles.sectionTitle}>📊 Per Symbol Performance</div>
        <div style={styles.grid2}>
          {stats.by_symbol && Object.entries(stats.by_symbol).map(([symbol, data]) => (
            <div key={symbol} style={styles.card}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' }}>{symbol}</div>
              <div style={styles.row}><span style={styles.label}>Trades</span><span>{data.trades}</span></div>
              <div style={styles.row}><span style={styles.label}>Wins</span><span style={{ color: '#34d399' }}>{data.wins}</span></div>
              <div style={styles.row}><span style={styles.label}>Losses</span><span style={{ color: '#f87171' }}>{data.losses}</span></div>
              <div style={styles.row}><span style={styles.label}>Win Rate</span><span style={{ color: data.win_rate >= 50 ? '#34d399' : '#f59e0b' }}>{data.win_rate}%</span></div>
              <div style={styles.progressBg}><div style={styles.progressFill(data.win_rate)} /></div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={styles.sectionTitle}>📝 All Trades</div>
        <div style={styles.card}>
          {(!stats.trades || stats.trades.length === 0) ? (
            <div style={styles.noTrades}>No trades yet — Monday la trade varum! 🚀</div>
          ) : (
            stats.trades.map((trade, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1f2937', fontSize: '14px' }}>
                <span style={{ color: '#9ca3af' }}>{trade.Date}</span>
                <span style={{ fontWeight: 'bold' }}>{trade.Symbol}</span>
                <span style={{ color: trade.Signal === 'BUY' ? '#34d399' : '#f87171' }}>{trade.Signal}</span>
                <span style={{ color: '#60a5fa' }}>AI: {trade['AI Score']}%</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [botSession, setBotSession] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/status`).then(r => r.json()).then(setBotSession);
    const interval = setInterval(() => {
      fetch(`${API}/api/status`).then(r => r.json()).then(setBotSession);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div>
            <div style={styles.headerTitle}>AI Algo Trading</div>
            <div style={styles.headerSub}>Welcome, {username}! 👑</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.statusBadge('green')}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }} />
            RUNNING
          </div>
          <div style={styles.statusBadge(botSession && botSession.session === 'ACTIVE' ? 'green' : 'red')}>
            {botSession && botSession.session === 'ACTIVE' ? '🟢 SESSION ACTIVE' : '🔴 SESSION CLOSED'}
          </div>
          <div style={styles.timeTxt}>🕐 {new Date().toLocaleTimeString()}</div>
          <button style={styles.logoutBtn} onClick={onLogout}>🚪 Logout</button>
        </div>
      </div>
      <div style={styles.nav}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'control', label: '⚙️ Control Panel' },
          { id: 'reports', label: '📊 Reports' },
        ].map(tab => (
          <button key={tab.id} style={styles.navBtn(activeTab === tab.id)} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'dashboard' ? <DashboardTab /> : null}
      {activeTab === 'control' ? <ControlTab /> : null}
      {activeTab === 'reports' ? <ReportsTab /> : null}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));
  const handleLogin = (username) => setUser(username);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };
  if (!user) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard username={user} onLogout={handleLogout} />;
}

export default App;
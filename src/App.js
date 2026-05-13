import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';

const API = 'https://hastily-smite-prefix.ngrok-free.dev';
const HEADERS = { 'ngrok-skip-browser-warning': 'true' };

// ============================================
// MOCK CHART DATA
// ============================================
const generateChartData = () => {
  const data = [];
  let price = 1.178;
  for (let i = 0; i < 24; i++) {
    price += (Math.random() - 0.5) * 0.002;
    data.push({ time: `${i}:00`, price: parseFloat(price.toFixed(5)) });
  }
  return data;
};

// ============================================
// STYLES
// ============================================
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080c14;
    --bg2: #0d1420;
    --bg3: #111927;
    --bg4: #162030;
    --border: rgba(255,255,255,0.06);
    --orange: #f97316;
    --orange2: #fb923c;
    --orange-glow: rgba(249,115,22,0.15);
    --green: #22c55e;
    --red: #ef4444;
    --text: #e2e8f0;
    --text2: #94a3b8;
    --text3: #475569;
    --blue: #3b82f6;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--bg4); border-radius: 2px; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px;
    min-width: 240px;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 24px 0;
    position: fixed;
    height: 100vh;
    overflow-y: auto;
    z-index: 100;
  }

  .logo {
    padding: 0 20px 24px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 16px;
  }

  .logo-text {
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, #f97316, #fb923c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .logo-sub { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 2px; }

  .nav-section { padding: 0 12px; margin-bottom: 8px; }
  .nav-label { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; padding: 0 8px; margin-bottom: 6px; letter-spacing: 1px; }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text2);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 2px;
  }

  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: var(--orange-glow); color: var(--orange); border: 1px solid rgba(249,115,22,0.2); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-bottom {
    margin-top: auto;
    padding: 16px 12px 0;
    border-top: 1px solid var(--border);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--bg3);
    border-radius: 10px;
    cursor: pointer;
  }

  .user-avatar {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, #f97316, #fb923c);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    color: white;
  }

  .user-name { font-size: 13px; font-weight: 700; }
  .user-role { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; }

  /* MAIN */
  .main {
    margin-left: 240px;
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* TOPBAR */
  .topbar {
    background: var(--bg2);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .topbar-title { font-size: 16px; font-weight: 800; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'DM Mono', monospace;
  }

  .status-dot { width: 6px; height: 6px; border-radius: 50%; }
  .status-green { background: rgba(34,197,94,0.15); color: #22c55e; border: 1px solid rgba(34,197,94,0.2); }
  .status-green .status-dot { background: #22c55e; box-shadow: 0 0 6px #22c55e; animation: pulse 2s infinite; }
  .status-red { background: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
  .status-red .status-dot { background: #ef4444; }
  .status-orange { background: var(--orange-glow); color: var(--orange); border: 1px solid rgba(249,115,22,0.2); }
  .status-orange .status-dot { background: var(--orange); }

  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

  .logout-btn {
    background: rgba(239,68,68,0.1);
    color: #ef4444;
    border: 1px solid rgba(239,68,68,0.2);
    padding: 6px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    font-family: 'Syne', sans-serif;
    transition: all 0.2s;
  }
  .logout-btn:hover { background: rgba(239,68,68,0.2); }

  /* CONTENT */
  .content { padding: 24px; flex: 1; }

  /* STAT CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }

  .stat-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 20px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s;
  }

  .stat-card:hover { border-color: rgba(249,115,22,0.3); transform: translateY(-2px); }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--orange), transparent); opacity: 0; transition: opacity 0.2s; }
  .stat-card:hover::before { opacity: 1; }

  .stat-label { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; margin-bottom: 8px; letter-spacing: 0.5px; }
  .stat-value { font-size: 24px; font-weight: 800; letter-spacing: -1px; }
  .stat-sub { font-size: 11px; color: var(--text3); margin-top: 4px; font-family: 'DM Mono', monospace; }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .text-orange { color: var(--orange); }
  .text-blue { color: var(--blue); }
  .text-purple { color: #a855f7; }

  /* GRID LAYOUTS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .grid-3 { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }

  /* CARDS */
  .card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
  }

  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-title { font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .card-body { padding: 20px; }

  /* SIGNAL CARDS */
  .signal-card {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.2s;
  }
  .signal-card:hover { border-color: rgba(249,115,22,0.3); }
  .signal-card:last-child { margin-bottom: 0; }

  .signal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .signal-symbol { font-size: 15px; font-weight: 800; }
  .signal-trend { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; font-family: 'DM Mono', monospace; }
  .trend-bull { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .trend-bear { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }

  .signal-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .signal-label { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; }
  .signal-val { font-size: 12px; font-weight: 600; font-family: 'DM Mono', monospace; }

  .score-bar-bg { width: 100%; height: 4px; background: var(--bg4); border-radius: 999px; margin: 8px 0; }
  .score-bar { height: 4px; border-radius: 999px; transition: width 0.5s; }

  .signal-badge { font-size: 10px; font-weight: 700; padding: 3px 10px; border-radius: 999px; font-family: 'DM Mono', monospace; }
  .badge-buy { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .badge-sell { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .badge-wait { background: var(--bg4); color: var(--text3); }

  .reasons { font-size: 10px; color: var(--text3); margin-top: 8px; font-family: 'DM Mono', monospace; line-height: 1.4; }

  /* POSITIONS TABLE */
  .table { width: 100%; }
  .table-header { display: grid; grid-template-columns: 1fr 80px 80px 100px 100px 80px; gap: 8px; padding: 8px 16px; border-bottom: 1px solid var(--border); }
  .table-label { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; letter-spacing: 0.5px; }
  .table-row { display: grid; grid-template-columns: 1fr 80px 80px 100px 100px 80px; gap: 8px; padding: 12px 16px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
  .table-row:hover { background: var(--bg3); }
  .table-cell { font-size: 12px; font-family: 'DM Mono', monospace; display: flex; align-items: center; }
  .table-symbol { font-weight: 700; font-size: 13px; font-family: 'Syne', sans-serif; }

  /* TRADE LOG */
  .trade-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; border-bottom: 1px solid var(--border); transition: background 0.2s; }
  .trade-item:hover { background: var(--bg3); }
  .trade-item:last-child { border-bottom: none; }
  .trade-date { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; }
  .trade-symbol { font-size: 13px; font-weight: 700; }
  .trade-type { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; font-family: 'DM Mono', monospace; }
  .type-buy { background: rgba(34,197,94,0.1); color: var(--green); }
  .type-sell { background: rgba(239,68,68,0.1); color: var(--red); }
  .trade-score { font-size: 10px; color: var(--orange); font-family: 'DM Mono', monospace; }

  /* SESSIONS */
  .session-card { background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; }
  .session-name { font-size: 13px; font-weight: 700; }
  .session-time { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 2px; }

  /* CONTROL */
  .control-section { margin-bottom: 24px; }
  .setting-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .setting-label { font-size: 13px; color: var(--text2); }
  .setting-input {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 6px 12px;
    color: var(--text);
    font-size: 13px;
    width: 120px;
    text-align: right;
    font-family: 'DM Mono', monospace;
    outline: none;
    transition: border-color 0.2s;
  }
  .setting-input:focus { border-color: var(--orange); }

  .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 700; font-family: 'Syne', sans-serif; transition: all 0.2s; }
  .btn-orange { background: var(--orange); color: white; }
  .btn-orange:hover { background: var(--orange2); }
  .btn-green { background: rgba(34,197,94,0.1); color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
  .btn-green:hover { background: rgba(34,197,94,0.2); }
  .btn-red { background: rgba(239,68,68,0.1); color: var(--red); border: 1px solid rgba(239,68,68,0.2); margin-left: 8px; }
  .btn-red:hover { background: rgba(239,68,68,0.2); }
  .btn-blue { background: rgba(59,130,246,0.1); color: var(--blue); border: 1px solid rgba(59,130,246,0.2); width: 100%; margin-top: 16px; }
  .btn-blue:hover { background: rgba(59,130,246,0.2); }

  .success-msg { color: var(--green); font-size: 12px; text-align: center; margin-top: 8px; font-family: 'DM Mono', monospace; }

  /* REPORTS */
  .report-stat { text-align: center; padding: 20px; }
  .report-num { font-size: 40px; font-weight: 800; letter-spacing: -2px; }
  .report-label { font-size: 11px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 4px; }

  .progress-bg { width: 100%; height: 6px; background: var(--bg4); border-radius: 999px; margin: 12px 0; }
  .progress-fill { height: 6px; border-radius: 999px; transition: width 0.8s; }

  /* EMPTY */
  .empty { text-align: center; padding: 32px; color: var(--text3); font-size: 13px; font-family: 'DM Mono', monospace; }

  /* LOGIN */
  .login-page { min-height: 100vh; background: var(--bg); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .login-glow { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%); border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
  .login-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 20px; padding: 40px; width: 400px; position: relative; z-index: 1; }
  .login-logo { text-align: center; margin-bottom: 32px; }
  .login-logo-text { font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #f97316, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .login-logo-sub { font-size: 12px; color: var(--text3); font-family: 'DM Mono', monospace; margin-top: 4px; }
  .login-input-group { margin-bottom: 16px; }
  .login-label { font-size: 12px; color: var(--text3); font-family: 'DM Mono', monospace; margin-bottom: 8px; display: block; letter-spacing: 0.5px; }
  .login-input { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; color: var(--text); font-size: 14px; outline: none; transition: border-color 0.2s; box-sizing: border-box; font-family: 'Syne', sans-serif; }
  .login-input:focus { border-color: var(--orange); }
  .login-btn { width: 100%; background: linear-gradient(135deg, #f97316, #fb923c); color: white; border: none; border-radius: 10px; padding: 14px; font-size: 15px; font-weight: 800; cursor: pointer; margin-top: 8px; font-family: 'Syne', sans-serif; transition: opacity 0.2s; letter-spacing: 0.5px; }
  .login-btn:hover { opacity: 0.9; }
  .login-error { color: var(--red); font-size: 12px; text-align: center; margin-top: 12px; font-family: 'DM Mono', monospace; }

  .tag { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 999px; font-family: 'DM Mono', monospace; }
  .tag-orange { background: var(--orange-glow); color: var(--orange); border: 1px solid rgba(249,115,22,0.2); }

  .update-time { font-size: 10px; color: var(--text3); font-family: 'DM Mono', monospace; }

  /* CHECKBOX */
  .pair-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .pair-name { font-size: 13px; font-weight: 700; }
  input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--orange); cursor: pointer; }

  @media (max-width: 768px) {
    .sidebar { width: 60px; min-width: 60px; }
    .logo-text, .logo-sub, .nav-item span, .user-name, .user-role { display: none; }
    .main { margin-left: 60px; }
    .stats-grid { grid-template-columns: 1fr 1fr; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .table-header, .table-row { grid-template-columns: 1fr 60px 60px 80px; }
    .table-cell:nth-child(5), .table-cell:nth-child(6) { display: none; }
  }
`;

// ============================================
// LOGIN
// ============================================
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
        headers: { ...HEADERS, 'Content-Type': 'application/json' },
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
      setError('Connection failed! Backend running-a?');
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <style>{css}</style>
      <div className="login-glow" />
      <div className="login-card">
        <div className="login-logo">
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
          <div className="login-logo-text">ALGOBOT</div>
          <div className="login-logo-sub">AI POWERED TRADING SYSTEM</div>
        </div>
        <div className="login-input-group">
          <label className="login-label">USERNAME</label>
          <input className="login-input" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <div className="login-input-group">
          <label className="login-label">PASSWORD</label>
          <input className="login-input" type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'AUTHENTICATING...' : '⚡ LAUNCH DASHBOARD'}
        </button>
        {error && <div className="login-error">⚠️ {error}</div>}
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD TAB
// ============================================
function DashboardTab() {
  const [account, setAccount] = useState(null);
  const [signals, setSignals] = useState([]);
  const [positions, setPositions] = useState([]);
  const [tradeLog, setTradeLog] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [chartData] = useState(generateChartData());

  const fetchAll = async () => {
    try {
      const [acc, sig, pos, log] = await Promise.all([
        fetch(`${API}/api/account`, { headers: HEADERS }).then(r => r.json()),
        fetch(`${API}/api/signals`, { headers: HEADERS }).then(r => r.json()),
        fetch(`${API}/api/positions`, { headers: HEADERS }).then(r => r.json()),
        fetch(`${API}/api/tradelog`, { headers: HEADERS }).then(r => r.json()),
      ]);
      setAccount(acc);
      setSignals(sig);
      setPositions(pos);
      setTradeLog(log);
      setLastUpdate(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="content">

      {/* STATS */}
      {account && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">BALANCE</div>
            <div className="stat-value text-blue">${account.balance.toFixed(2)}</div>
            <div className="stat-sub">Total Capital</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">EQUITY</div>
            <div className="stat-value text-purple">${account.equity.toFixed(2)}</div>
            <div className="stat-sub">Current Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">PROFIT / LOSS</div>
            <div className={`stat-value ${account.profit >= 0 ? 'text-green' : 'text-red'}`}>${account.profit.toFixed(2)}</div>
            <div className="stat-sub">Floating P&L</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">FREE MARGIN</div>
            <div className="stat-value text-orange">${account.freeMargin.toFixed(2)}</div>
            <div className="stat-sub">Available</div>
          </div>
        </div>
      )}

      {/* CHART + SIGNALS */}
      <div className="grid-3">

        {/* CHART */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📈 EURUSD — Live Price</div>
            <span className="tag tag-orange">M15</span>
          </div>
          <div className="card-body" style={{ padding: '16px 8px' }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} width={60} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: '#0d1420', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="price" stroke="#f97316" strokeWidth={2} fill="url(#priceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI SIGNALS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">🤖 AI Signals</div>
            <span className="update-time">{lastUpdate.toLocaleTimeString()}</span>
          </div>
          <div className="card-body" style={{ padding: '12px' }}>
            {signals.length === 0 ? (
              <div className="empty">Loading signals...</div>
            ) : (
              signals.map(s => (
                <div className="signal-card" key={s.symbol}>
                  <div className="signal-header">
                    <span className="signal-symbol">{s.symbol}</span>
                    <span className={`signal-trend ${s.trend === 'BULLISH' ? 'trend-bull' : 'trend-bear'}`}>{s.trend}</span>
                  </div>
                  <div className="signal-row">
                    <span className="signal-label">PRICE</span>
                    <span className="signal-val">{s.price}</span>
                  </div>
                  <div className="signal-row">
                    <span className="signal-label">AI SCORE</span>
                    <span className={`signal-val ${s.score >= 70 ? 'text-green' : s.score >= 50 ? 'text-orange' : 'text-red'}`}>{s.score}%</span>
                  </div>
                  <div className="score-bar-bg">
                    <div className="score-bar" style={{ width: `${s.score}%`, background: s.score >= 70 ? '#22c55e' : s.score >= 50 ? '#f97316' : '#ef4444' }} />
                  </div>
                  <div className="signal-row">
                    <span className="signal-label">SIGNAL</span>
                    <span className={`signal-badge ${s.signal.includes('BUY') ? 'badge-buy' : s.signal.includes('SELL') ? 'badge-sell' : 'badge-wait'}`}>{s.signal}</span>
                  </div>
                  {s.reasons.length > 0 && <div className="reasons">💡 {s.reasons.join(' · ')}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* POSITIONS + TRADES */}
      <div className="grid-2">

        {/* OPEN POSITIONS */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📊 Open Positions <span className="tag tag-orange" style={{ marginLeft: 8 }}>{positions.length}</span></div>
          </div>
          {positions.length === 0 ? (
            <div className="empty">No open positions</div>
          ) : (
            <div>
              <div className="table-header">
                <span className="table-label">SYMBOL</span>
                <span className="table-label">TYPE</span>
                <span className="table-label">LOT</span>
                <span className="table-label">ENTRY</span>
                <span className="table-label">CURRENT</span>
                <span className="table-label">P&L</span>
              </div>
              {positions.map(pos => (
                <div className="table-row" key={pos.ticket}>
                  <div className="table-cell table-symbol">{pos.symbol}</div>
                  <div className={`table-cell ${pos.type === 'BUY' ? 'text-green' : 'text-red'}`}>{pos.type}</div>
                  <div className="table-cell">{pos.lot}</div>
                  <div className="table-cell">{pos.entry}</div>
                  <div className="table-cell">{pos.current}</div>
                  <div className={`table-cell ${pos.profit >= 0 ? 'text-green' : 'text-red'}`}>${pos.profit}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RECENT TRADES */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">📝 Recent Trades</div>
          </div>
          {tradeLog.length === 0 ? (
            <div className="empty">No trades logged yet</div>
          ) : (
            tradeLog.slice(0, 8).map((trade, i) => (
              <div className="trade-item" key={i}>
                <div>
                  <div className="trade-symbol">{trade.Symbol}</div>
                  <div className="trade-date">{trade.Date} {trade.Time}</div>
                </div>
                <span className={`trade-type ${trade.Signal === 'BUY' ? 'type-buy' : 'type-sell'}`}>{trade.Signal}</span>
                <span className="trade-score">AI: {trade['AI Score'] || 'N/A'}%</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SESSIONS */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">⏰ Trading Sessions</div>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { flag: '🇬🇧', name: 'London Session', time: '8:00 AM – 4:00 PM UTC', active: new Date().getUTCHours() >= 8 && new Date().getUTCHours() < 16 },
              { flag: '🇺🇸', name: 'New York Session', time: '1:00 PM – 9:00 PM UTC', active: new Date().getUTCHours() >= 13 && new Date().getUTCHours() < 21 },
            ].map(s => (
              <div className="session-card" key={s.name}>
                <div>
                  <div className="session-name">{s.flag} {s.name}</div>
                  <div className="session-time">{s.time}</div>
                </div>
                <span className={`status-pill ${s.active ? 'status-green' : 'status-red'}`}>
                  <span className="status-dot" />
                  {s.active ? 'ACTIVE' : 'CLOSED'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

// ============================================
// CONTROL TAB
// ============================================
function ControlTab() {
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [botRunning, setBotRunning] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/settings`, { headers: HEADERS })
      .then(r => r.json())
      .then(data => { setSettings(data); setBotRunning(data.status === 'RUNNING'); });
  }, []);

  const handleSave = async () => {
    await fetch(`${API}/api/settings`, { method: 'POST', headers: { ...HEADERS, 'Content-Type': 'application/json' }, body: JSON.stringify(settings) });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleStart = async () => {
    await fetch(`${API}/api/bot/start`, { method: 'POST', headers: HEADERS });
    setBotRunning(true);
  };

  const handleStop = async () => {
    await fetch(`${API}/api/bot/stop`, { method: 'POST', headers: HEADERS });
    setBotRunning(false);
  };

  if (!settings) return <div className="content"><div className="empty">Loading settings...</div></div>;

  return (
    <div className="content">

      {/* BOT CONTROL */}
      <div className="control-section">
        <div className="card">
          <div className="card-header">
            <div className="card-title">🤖 Bot Control</div>
            <span className={`status-pill ${botRunning ? 'status-green' : 'status-red'}`}>
              <span className="status-dot" />
              {botRunning ? 'RUNNING' : 'STOPPED'}
            </span>
          </div>
          <div className="card-body" style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-green" onClick={handleStart}>▶ START BOT</button>
            <button className="btn btn-red" onClick={handleStop}>⏹ STOP BOT</button>
          </div>
        </div>
      </div>

      <div className="grid-2">

        {/* RISK SETTINGS */}
        <div className="card">
          <div className="card-header"><div className="card-title">⚙️ Risk Settings</div></div>
          <div className="card-body">
            {[
              { label: 'Risk Per Trade (%)', key: 'risk_percent', step: 0.1 },
              { label: 'Stop Loss (pips)', key: 'sl_pips', step: 1 },
              { label: 'Take Profit (pips)', key: 'tp_pips', step: 1 },
              { label: 'Max Trades', key: 'max_trades', step: 1 },
              { label: 'Max Daily Loss (%)', key: 'max_daily_loss', step: 0.1 },
              { label: 'AI Score Threshold (%)', key: 'ai_threshold', step: 1 },
            ].map(item => (
              <div className="setting-row" key={item.key}>
                <span className="setting-label">{item.label}</span>
                <input className="setting-input" type="number" step={item.step} value={settings[item.key]} onChange={e => setSettings({ ...settings, [item.key]: parseFloat(e.target.value) })} />
              </div>
            ))}
            <button className="btn btn-blue" onClick={handleSave}>💾 SAVE SETTINGS</button>
            {saved && <div className="success-msg">✅ Settings saved!</div>}
          </div>
        </div>

        {/* TRADING PAIRS */}
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Trading Pairs</div></div>
          <div className="card-body">
            {['EURUSD', 'GBPUSD', 'USDJPY'].map(pair => (
              <div className="pair-row" key={pair}>
                <span className="pair-name">{pair}</span>
                <input type="checkbox" checked={settings.symbols ? settings.symbols.includes(pair) : false} onChange={e => { const syms = e.target.checked ? [...settings.symbols, pair] : settings.symbols.filter(s => s !== pair); setSettings({ ...settings, symbols: syms }); }} />
              </div>
            ))}
            <button className="btn btn-blue" onClick={handleSave}>💾 SAVE PAIRS</button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ============================================
// REPORTS TAB
// ============================================
function ReportsTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/reports`, { headers: HEADERS })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) return <div className="content"><div className="empty">Loading reports...</div></div>;

  return (
    <div className="content">

      {/* OVERVIEW */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">TOTAL TRADES</div>
          <div className="stat-value text-blue">{stats.total_trades || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">WIN RATE</div>
          <div className={`stat-value ${(stats.win_rate || 0) >= 50 ? 'text-green' : 'text-red'}`}>{stats.win_rate || 0}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOTAL PROFIT</div>
          <div className={`stat-value ${(stats.total_profit || 0) >= 0 ? 'text-green' : 'text-red'}`}>${stats.total_profit || 0}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">MAX DRAWDOWN</div>
          <div className="stat-value text-red">{stats.max_drawdown || 0}%</div>
        </div>
      </div>

      <div className="grid-2">

        {/* WIN/LOSS */}
        <div className="card">
          <div className="card-header"><div className="card-title">🏆 Win / Loss</div></div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="report-stat">
                <div className="report-num text-green">{stats.wins || 0}</div>
                <div className="report-label">WINS</div>
              </div>
              <div className="report-stat">
                <div className="report-num text-red">{stats.losses || 0}</div>
                <div className="report-label">LOSSES</div>
              </div>
            </div>
            <div className="progress-bg">
              <div className="progress-fill" style={{ width: `${stats.win_rate || 0}%`, background: (stats.win_rate || 0) >= 50 ? '#22c55e' : '#f97316' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
              <span>0%</span>
              <span style={{ color: 'var(--orange)' }}>TARGET: 55%+</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* PER SYMBOL */}
        <div className="card">
          <div className="card-header"><div className="card-title">📊 Per Symbol</div></div>
          <div className="card-body">
            {stats.by_symbol && Object.keys(stats.by_symbol).length > 0 ? (
              Object.entries(stats.by_symbol).map(([symbol, data]) => (
                <div key={symbol} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700 }}>{symbol}</span>
                    <span className={`tag ${data.win_rate >= 50 ? 'text-green' : 'text-red'}`} style={{ fontSize: 11 }}>{data.win_rate}%</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${data.win_rate}%`, background: data.win_rate >= 50 ? '#22c55e' : '#f97316' }} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>{data.trades} trades · {data.wins}W · {data.losses}L</div>
                </div>
              ))
            ) : (
              <div className="empty">No symbol data yet</div>
            )}
          </div>
        </div>

      </div>

      {/* ALL TRADES */}
      <div className="card">
        <div className="card-header"><div className="card-title">📝 All Trades</div></div>
        {(!stats.trades || stats.trades.length === 0) ? (
          <div className="empty">No trades yet — Bot run pannaa data varum! 🚀</div>
        ) : (
          stats.trades.map((trade, i) => (
            <div className="trade-item" key={i}>
              <div>
                <div className="trade-symbol">{trade.Symbol}</div>
                <div className="trade-date">{trade.Date} {trade.Time}</div>
              </div>
              <span className={`trade-type ${trade.Signal === 'BUY' ? 'type-buy' : 'type-sell'}`}>{trade.Signal}</span>
              <span className="trade-score">AI: {trade['AI Score'] || 'N/A'}%</span>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

// ============================================
// MAIN DASHBOARD
// ============================================
function Dashboard({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [botSession, setBotSession] = useState(null);

  useEffect(() => {
    const fetchStatus = () => fetch(`${API}/api/status`, { headers: HEADERS }).then(r => r.json()).then(setBotSession).catch(() => {});
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'control', icon: '⚙️', label: 'Control Panel' },
    { id: 'reports', icon: '📈', label: 'Reports' },
  ];

  return (
    <div className="app">
      <style>{css}</style>

      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-text">⚡ ALGOBOT</div>
          <div className="logo-sub">AI TRADING SYSTEM</div>
        </div>

        <div className="nav-section">
          <div className="nav-label">NAVIGATION</div>
          {navItems.map(item => (
            <div key={item.id} className={`nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="user-avatar">{username[0].toUpperCase()}</div>
            <div>
              <div className="user-name">{username}</div>
              <div className="user-role">TRADER</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-title">
            {navItems.find(n => n.id === activeTab)?.icon} {navItems.find(n => n.id === activeTab)?.label}
          </div>
          <div className="topbar-right">
            <span className="status-pill status-green">
              <span className="status-dot" /> RUNNING
            </span>
            <span className={`status-pill ${botSession?.session === 'ACTIVE' ? 'status-green' : 'status-red'}`}>
              <span className="status-dot" />
              {botSession?.session === 'ACTIVE' ? 'SESSION ACTIVE' : 'SESSION CLOSED'}
            </span>
            <span className="update-time">{new Date().toLocaleTimeString()}</span>
            <button className="logout-btn" onClick={onLogout}>LOGOUT</button>
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === 'dashboard' ? <DashboardTab /> : null}
        {activeTab === 'control' ? <ControlTab /> : null}
        {activeTab === 'reports' ? <ReportsTab /> : null}

      </div>
    </div>
  );
}

// ============================================
// APP
// ============================================
function App() {
  const [user, setUser] = useState(localStorage.getItem('username'));
  const handleLogin = (username) => setUser(username);
  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('username'); setUser(null); };
  if (!user) return <LoginPage onLogin={handleLogin} />;
  return <Dashboard username={user} onLogout={handleLogout} />;
}

export default App; 

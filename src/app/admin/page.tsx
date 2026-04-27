
'use client';
import { useState } from 'react';

const ADMIN_KEY = 'mv-admin-2025';

const STATUS_OPTIONS = [
  { value: 'under_review', label: '🔵 Send to Peer Review', color: '#3182ce' },
  { value: 'revision_required', label: '🟡 Request Major Revision', color: '#d69e2e' },
  { value: 'minor_revision', label: '🟠 Request Minor Revision', color: '#ed8936' },
  { value: 'accepted', label: '🟢 Accept Manuscript', color: '#38a169' },
  { value: 'rejected', label: '🔴 Reject Manuscript', color: '#e53e3e' },
  { value: 'published', label: '🟣 Mark as Published', color: '#805ad5' },
];

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Status update form
  const [subId, setSubId] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [statusResult, setStatusResult] = useState<{success?:boolean;error?:string;status?:string}|null>(null);
  const [sendingStatus, setSendingStatus] = useState(false);

  // Reviewer matching form
  const [matchSubId, setMatchSubId] = useState('');
  const [matchTitle, setMatchTitle] = useState('');
  const [matchSpecialty, setMatchSpecialty] = useState('');
  const [matchAbstract, setMatchAbstract] = useState('');
  const [matchResult, setMatchResult] = useState<{success?:boolean;matched?:number;message?:string;error?:string}|null>(null);
  const [matchLoading, setMatchLoading] = useState(false);

  // AI Screener test form
  const [screenSubId, setScreenSubId] = useState('');
  const [screenTitle, setScreenTitle] = useState('');
  const [screenAbstract, setScreenAbstract] = useState('');
  const [screenSpecialty, setScreenSpecialty] = useState('');
  const [screenEmail, setScreenEmail] = useState('');
  const [screenName, setScreenName] = useState('');
  const [screenResult, setScreenResult] = useState<{success?:boolean;decision?:string;summary?:string;error?:string}|null>(null);
  const [screenLoading, setScreenLoading] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_KEY) {
      setAuthed(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const sendStatusUpdate = async () => {
    if (!subId || !authorEmail || !title || !selectedStatus) {
      setStatusResult({ error: 'Please fill all required fields.' });
      return;
    }
    setSendingStatus(true);
    setStatusResult(null);
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': ADMIN_KEY },
        body: JSON.stringify({ submissionId: subId, authorEmail, authorName, title, status: selectedStatus, customNote })
      });
      const data = await res.json();
      setStatusResult(data);
      if (data.success) {
        setSubId(''); setAuthorEmail(''); setAuthorName('');
        setTitle(''); setSelectedStatus(''); setCustomNote('');
      }
    } catch { setStatusResult({ error: 'Network error. Please try again.' }); }
    setSendingStatus(false);
  };

  const runReviewerMatch = async () => {
    if (!matchSubId || !matchTitle || !matchSpecialty) {
      setMatchResult({ error: 'Please fill all required fields.' });
      return;
    }
    setMatchLoading(true);
    setMatchResult(null);
    try {
      const res = await fetch('/api/match-reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: matchSubId, title: matchTitle, specialty: matchSpecialty, abstract: matchAbstract })
      });
      const data = await res.json();
      setMatchResult(data);
    } catch { setMatchResult({ error: 'Network error. Please try again.' }); }
    setMatchLoading(false);
  };

  const runAIScreen = async () => {
    if (!screenSubId || !screenTitle || !screenAbstract || !screenEmail) {
      setScreenResult({ error: 'Please fill all required fields.' });
      return;
    }
    setScreenLoading(true);
    setScreenResult(null);
    try {
      const res = await fetch('/api/screen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: screenSubId, title: screenTitle, abstract: screenAbstract, specialty: screenSpecialty, authorEmail: screenEmail, authorName: screenName })
      });
      const data = await res.json();
      setScreenResult(data);
    } catch { setScreenResult({ error: 'Network error. Please try again.' }); }
    setScreenLoading(false);
  };

  // Login screen
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '40px', width: '380px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🏥</div>
            <h2 style={{ margin: 0, color: '#1a365d', fontWeight: 800 }}>Editor Dashboard</h2>
            <p style={{ margin: '6px 0 0', color: '#718096', fontSize: '0.9rem' }}>Medical Vanguard — Editorial Office</p>
          </div>
          <label style={{ display: 'block', marginBottom: '6px', color: '#4a5568', fontWeight: 600, fontSize: '0.9rem' }}>Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            placeholder="Enter admin password"
            style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', marginBottom: '12px' }}
          />
          {authError && <p style={{ color: '#e53e3e', fontSize: '0.85rem', margin: '0 0 12px' }}>{authError}</p>}
          <button onClick={handleLogin} style={{ width: '100%', background: '#1a365d', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer' }}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const cardStyle = { background: 'white', borderRadius: '12px', padding: '28px', marginBottom: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' };
  const inputStyle = { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', boxSizing: 'border-box' as const, marginBottom: '12px', fontFamily: 'inherit' };
  const labelStyle = { display: 'block', marginBottom: '4px', color: '#4a5568', fontWeight: 600, fontSize: '0.85rem' };
  const btnBase = { border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8' }}>
      {/* Header */}
      <div style={{ background: '#1a365d', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>🏥 Medical Vanguard — Editor Dashboard</h1>
          <p style={{ color: '#90cdf4', margin: '2px 0 0', fontSize: '0.85rem' }}>Agentic Editorial Management System</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/" style={{ color: '#90cdf4', textDecoration: 'none', fontSize: '0.85rem' }}>← Back to Journal</a>
          <button onClick={() => setAuthed(false)} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'AI Screener', desc: 'Auto-screens scope & sends author email', icon: '🤖', color: '#3182ce' },
            { label: 'Reviewer Matcher', desc: 'Finds & emails best-fit reviewers', icon: '🎯', color: '#38a169' },
            { label: 'Status Updates', desc: 'One-click author notification emails', icon: '📧', color: '#805ad5' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: '10px', padding: '16px', borderLeft: `4px solid ${s.color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontWeight: 700, color: '#1a365d', fontSize: '0.95rem' }}>{s.label}</div>
              <div style={{ color: '#718096', fontSize: '0.8rem', marginTop: '3px' }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* PANEL 1: AI Screener */}
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 6px', color: '#1a365d', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🤖 AI Submission Screener
          </h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 20px' }}>
            Paste details from a new submission. AI checks scope and automatically emails the author an acceptance-for-review or desk rejection.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Submission ID *</label>
              <input style={inputStyle} value={screenSubId} onChange={e => setScreenSubId(e.target.value)} placeholder="MV-XXXXXXXX" />
            </div>
            <div>
              <label style={labelStyle}>Author Email *</label>
              <input style={inputStyle} value={screenEmail} onChange={e => setScreenEmail(e.target.value)} placeholder="author@university.edu" />
            </div>
            <div>
              <label style={labelStyle}>Author Name</label>
              <input style={inputStyle} value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="Dr. John Smith" />
            </div>
            <div>
              <label style={labelStyle}>Specialty / Field</label>
              <input style={inputStyle} value={screenSpecialty} onChange={e => setScreenSpecialty(e.target.value)} placeholder="e.g. Cardiology" />
            </div>
          </div>
          <label style={labelStyle}>Manuscript Title *</label>
          <input style={inputStyle} value={screenTitle} onChange={e => setScreenTitle(e.target.value)} placeholder="Full manuscript title" />
          <label style={labelStyle}>Abstract * (paste full abstract)</label>
          <textarea style={{...inputStyle, height: '100px', resize: 'vertical'}} value={screenAbstract} onChange={e => setScreenAbstract(e.target.value)} placeholder="Background: ... Methods: ... Results: ... Conclusion: ..." />
          <button
            onClick={runAIScreen}
            disabled={screenLoading}
            style={{...btnBase, background: '#3182ce', color: 'white', opacity: screenLoading ? 0.7 : 1}}
          >
            {screenLoading ? '⏳ Screening...' : '🤖 Run AI Screener & Email Author'}
          </button>
          {screenResult && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: screenResult.error ? '#fff5f5' : screenResult.decision === 'desk_reject' ? '#fff5f5' : '#f0fff4', border: `1px solid ${screenResult.error ? '#fed7d7' : screenResult.decision === 'desk_reject' ? '#fed7d7' : '#c6f6d5'}` }}>
              {screenResult.error ? (
                <p style={{ margin: 0, color: '#c53030' }}>❌ {screenResult.error}</p>
              ) : (
                <>
                  <p style={{ margin: '0 0 6px', fontWeight: 700, color: screenResult.decision === 'desk_reject' ? '#c53030' : '#276749' }}>
                    {screenResult.decision === 'desk_reject' ? '❌ DESK REJECTED' : '✅ ACCEPTED FOR REVIEW'}
                  </p>
                  <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem' }}>{screenResult.summary}</p>
                  <p style={{ margin: '6px 0 0', color: '#718096', fontSize: '0.8rem' }}>Author has been notified by email.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* PANEL 2: Reviewer Matcher */}
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 6px', color: '#1a365d' }}>🎯 Auto Reviewer Matching</h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 20px' }}>
            Enter submission details to automatically find and email the top 3 matching reviewers from your reviewer database.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Submission ID *</label>
              <input style={inputStyle} value={matchSubId} onChange={e => setMatchSubId(e.target.value)} placeholder="MV-XXXXXXXX" />
            </div>
            <div>
              <label style={labelStyle}>Specialty *</label>
              <input style={inputStyle} value={matchSpecialty} onChange={e => setMatchSpecialty(e.target.value)} placeholder="e.g. Cardiology, Neurology" />
            </div>
          </div>
          <label style={labelStyle}>Manuscript Title *</label>
          <input style={inputStyle} value={matchTitle} onChange={e => setMatchTitle(e.target.value)} placeholder="Full manuscript title" />
          <label style={labelStyle}>Abstract (optional but recommended)</label>
          <textarea style={{...inputStyle, height: '80px', resize: 'vertical'}} value={matchAbstract} onChange={e => setMatchAbstract(e.target.value)} placeholder="Paste abstract for better matching..." />
          <button
            onClick={runReviewerMatch}
            disabled={matchLoading}
            style={{...btnBase, background: '#38a169', color: 'white', opacity: matchLoading ? 0.7 : 1}}
          >
            {matchLoading ? '⏳ Matching...' : '🎯 Find & Email Matched Reviewers'}
          </button>
          {matchResult && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: matchResult.error ? '#fff5f5' : '#f0fff4', border: `1px solid ${matchResult.error ? '#fed7d7' : '#c6f6d5'}` }}>
              {matchResult.error ? (
                <p style={{ margin: 0, color: '#c53030' }}>❌ {matchResult.error}</p>
              ) : matchResult.matched === 0 ? (
                <p style={{ margin: 0, color: '#744210' }}>⚠️ {matchResult.message || 'No reviewers matched. Add reviewers via the /reviewers signup page first.'}</p>
              ) : (
                <p style={{ margin: 0, color: '#276749', fontWeight: 700 }}>✅ {matchResult.matched} reviewer(s) found and invited by email!</p>
              )}
            </div>
          )}
        </div>

        {/* PANEL 3: Status Update */}
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 6px', color: '#1a365d' }}>📧 Send Status Update to Author</h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', margin: '0 0 20px' }}>
            Select a status and click send. The author receives a professional formatted email instantly.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Submission ID *</label>
              <input style={inputStyle} value={subId} onChange={e => setSubId(e.target.value)} placeholder="MV-XXXXXXXX" />
            </div>
            <div>
              <label style={labelStyle}>Author Email *</label>
              <input style={inputStyle} value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} placeholder="author@email.com" />
            </div>
            <div>
              <label style={labelStyle}>Author Name</label>
              <input style={inputStyle} value={authorName} onChange={e => setAuthorName(e.target.value)} placeholder="Dr. Jane Smith" />
            </div>
          </div>
          <label style={labelStyle}>Manuscript Title *</label>
          <input style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} placeholder="Full manuscript title" />
          <label style={labelStyle}>New Status *</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '8px', marginBottom: '12px' }}>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSelectedStatus(opt.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: `2px solid ${selectedStatus === opt.value ? opt.color : '#e2e8f0'}`,
                  background: selectedStatus === opt.value ? `${opt.color}15` : 'white',
                  color: selectedStatus === opt.value ? opt.color : '#4a5568',
                  fontWeight: selectedStatus === opt.value ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  textAlign: 'left' as const,
                  transition: 'all 0.15s'
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <label style={labelStyle}>Editor's Note (optional — will appear in email)</label>
          <textarea style={{...inputStyle, height: '70px', resize: 'vertical'}} value={customNote} onChange={e => setCustomNote(e.target.value)} placeholder="Add any additional message for the author..." />
          <button
            onClick={sendStatusUpdate}
            disabled={sendingStatus || !selectedStatus}
            style={{...btnBase, background: selectedStatus ? STATUS_OPTIONS.find(o=>o.value===selectedStatus)?.color || '#1a365d' : '#a0aec0', color: 'white', opacity: (sendingStatus || !selectedStatus) ? 0.7 : 1}}
          >
            {sendingStatus ? '⏳ Sending...' : `📧 Send ${selectedStatus ? STATUS_OPTIONS.find(o=>o.value===selectedStatus)?.label.split(' ').slice(1).join(' ') : 'Status Update'}`}
          </button>
          {statusResult && (
            <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: statusResult.error ? '#fff5f5' : '#f0fff4', border: `1px solid ${statusResult.error ? '#fed7d7' : '#c6f6d5'}` }}>
              {statusResult.error ? (
                <p style={{ margin: 0, color: '#c53030' }}>❌ {statusResult.error}</p>
              ) : (
                <p style={{ margin: 0, color: '#276749', fontWeight: 700 }}>✅ Status update email sent successfully — "{statusResult.status}"</p>
              )}
            </div>
          )}
        </div>

        {/* Help box */}
        <div style={{ background: '#ebf8ff', borderRadius: '10px', padding: '20px', border: '1px solid #bee3f8' }}>
          <h3 style={{ margin: '0 0 10px', color: '#2b6cb0', fontSize: '1rem' }}>💡 How the Agentic System Works</h3>
          <div style={{ color: '#2c5282', fontSize: '0.85rem', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 6px' }}><strong>When a submission arrives in your email:</strong></p>
            <ol style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Copy the submission ID, title, abstract & author email from the notification</li>
              <li>Paste into the AI Screener above → it emails the author automatically</li>
              <li>If in-scope, paste the same details into Reviewer Matcher → reviewers are emailed</li>
              <li>As the review progresses, use Status Updates to keep the author informed in one click</li>
            </ol>
            <p style={{ margin: '10px 0 0' }}>Add your OpenAI API key in Vercel env vars as <code>OPENAI_API_KEY</code> to enable full AI screening.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

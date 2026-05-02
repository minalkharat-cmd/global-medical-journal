'use client';
import { useState, useEffect } from 'react';

interface Submission {
  submission_id: string;
  title: string;
  authors: string;
  abstract: string;
  specialty: string;
  manuscript_type: string;
  status: string;
  submitted_at: string;
  review_id?: number;
  recommendation?: string;
  comments?: string;
  review_date?: string;
}

export default function ReviewerDashboard() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [reviewer, setReviewer] = useState<{ name: string; email: string; token: string } | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [comments, setComments] = useState('');
  const [score, setScore] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('reviewer_session');
    if (saved) {
      const sess = JSON.parse(saved);
      setReviewer(sess);
      fetchSubmissions(sess.token);
    }
  }, []);

  async function fetchSubmissions(tok: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/reviewer-submissions', {
        headers: { Authorization: `Bearer ${tok}` }
      });
      const data = await res.json();
      if (data.submissions) setSubmissions(data.submissions);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    try {
      const res = await fetch('/api/reviewer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
      });
      const data = await res.json();
      if (!res.ok) { setLoginError(data.error || 'Login failed'); return; }
      setReviewer(data);
      localStorage.setItem('reviewer_session', JSON.stringify(data));
      fetchSubmissions(data.token);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setReviewer(null);
    setSubmissions([]);
    localStorage.removeItem('reviewer_session');
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || !reviewer) return;
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await fetch('/api/reviewer-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reviewer.token}` },
        body: JSON.stringify({ submission_id: selected.submission_id, recommendation, comments, score: score ? parseInt(score) : null })
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitMsg('Review submitted successfully!');
        setSelected(null);
        setRecommendation(''); setComments(''); setScore('');
        fetchSubmissions(reviewer.token);
      } else {
        setSubmitMsg(data.error || 'Failed to submit review');
      }
    } finally {
      setSubmitting(false);
    }
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    under_review: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };

  if (!reviewer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🔬</div>
            <h1 className="text-2xl font-bold text-gray-900">Reviewer Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Medical Vanguard Journal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reviewer Token</label>
              <input type="password" value={token} onChange={e => setToken(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your assigned token" />
            </div>
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Reviewer Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome, {reviewer.name}</p>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">Sign Out</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {submitMsg && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${submitMsg.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {submitMsg}
          </div>
        )}

        {selected ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <button onClick={() => setSelected(null)} className="flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4 gap-1">
              ← Back to submissions
            </button>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selected.title}</h2>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Authors:</span> {selected.authors}</p>
              <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Specialty:</span> {selected.specialty}</p>
              <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Type:</span> {selected.manuscript_type}</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Abstract</p>
                <p className="text-sm text-gray-600 leading-relaxed">{selected.abstract}</p>
              </div>
            </div>

            {selected.review_id ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-medium text-green-800 mb-1">✓ Review already submitted</p>
                <p className="text-sm text-green-700"><span className="font-medium">Recommendation:</span> {selected.recommendation}</p>
                <p className="text-sm text-green-700 mt-1"><span className="font-medium">Comments:</span> {selected.comments}</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <h3 className="font-semibold text-gray-900">{selected.review_id ? 'Update Your Review' : 'Submit Your Review'}</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recommendation *</label>
                <select value={recommendation} onChange={e => setRecommendation(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select recommendation...</option>
                  <option value="accept">Accept</option>
                  <option value="minor_revision">Minor Revision</option>
                  <option value="major_revision">Major Revision</option>
                  <option value="reject">Reject</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (1-10, optional)</label>
                <input type="number" min="1" max="10" value={score} onChange={e => setScore(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 7" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Comments *</label>
                <textarea value={comments} onChange={e => setComments(e.target.value)} required rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Provide detailed feedback on the manuscript..." />
              </div>
              <button type="submit" disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Assigned Manuscripts ({submissions.length})
              </h2>
              <button onClick={() => fetchSubmissions(reviewer.token)} className="text-sm text-blue-600 hover:text-blue-800">
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="bg-white rounded-xl h-32 animate-pulse border border-gray-200" />)}
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p className="font-medium">No manuscripts assigned yet</p>
                <p className="text-sm mt-1">Check back later or contact the editor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map(sub => (
                  <div key={sub.submission_id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[sub.status] || 'bg-gray-100 text-gray-700'}`}>
                            {sub.status?.replace('_', ' ') || 'pending'}
                          </span>
                          {sub.review_id && <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">✓ Reviewed</span>}
                          <span className="text-xs text-gray-400">{sub.specialty}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{sub.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{sub.authors}</p>
                        <p className="text-sm text-gray-400">Submitted: {new Date(sub.submitted_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => { setSelected(sub); setRecommendation(sub.recommendation || ''); setComments(sub.comments || ''); }}
                        className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 rounded-lg transition-colors">
                        {sub.review_id ? 'Edit Review' : 'Review'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
